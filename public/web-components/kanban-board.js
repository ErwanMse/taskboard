const ICONS = {
    circle: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 11.1A10 10 0 1 1 12.9 2.5"/><polyline points="22 4 12 14.5 9 11.5"/></svg>`,
    pencil: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    tag: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L3 3l.24 6.59a2 2 0 0 0 .59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l6.34-6.34a2 2 0 0 0 .01-2.84Z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

const COLUMNS = [
    { id: "todo", label: "To Do", icon: "circle" },
    { id: "doing", label: "Doing", icon: "clock" },
    { id: "done", label: "Done", icon: "check" },
];

const TAG_LABELS = {
    urgent: "Urgent",
    bug: "Bug",
    feature: "Feature",
    perso: "Perso",
};

class KanbanBoard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        try {
            const res = await fetch("/api/tasks");
            if (!res.ok) {
                throw new Error(`L'API a répondu avec le statut ${res.status}`);
            }
            const tasks = await res.json();
            this.render(tasks);
        } catch (err) {
            console.error("kanban-board: échec du chargement des tâches", err);
            this.renderError(err);
        }
    }

    async updateStatus(id, status) {
        try {
            await fetch("/api/update_status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            });
        } catch (err) {
            console.error("kanban-board: échec de la mise à jour du statut", err);
        }
        this.connectedCallback();
    }

    async deleteTask(id) {
        try {
            await fetch("/api/delete_task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
        } catch (err) {
            console.error("kanban-board: échec de la suppression", err);
        }
        this.connectedCallback();
    }

    async updateTitle(id, title) {
        try {
            await fetch("/api/update_title", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, title })
            });
        } catch (err) {
            console.error("kanban-board: échec du renommage", err);
        }
        this.connectedCallback();
    }

    async updateTag(id, tag) {
        try {
            await fetch("/api/update_tag", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, tag })
            });
        } catch (err) {
            console.error("kanban-board: échec du changement de tag", err);
        }
        this.connectedCallback();
    }

    renderError(err) {
        this.shadowRoot.innerHTML = `
            <style>
                :host { font-family: 'Plus Jakarta Sans', sans-serif; }
                .error-box {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    background: var(--tag-urgent-bg, #fef2f2);
                    color: var(--tag-urgent-color, #ef4444);
                    border: 1px solid var(--tag-urgent-color, #ef4444);
                    border-radius: 14px;
                    padding: 16px 18px;
                }
                .error-box strong { display: block; margin-bottom: 4px; font-size: 14px; }
                .error-box p { margin: 0; font-size: 13px; opacity: 0.9; }
            </style>
            <div class="error-box">
                ${ICONS.alert}
                <div>
                    <strong>Impossible de charger les tâches</strong>
                    <p>Vérifie la console et l'onglet réseau : la requête vers /api/tasks a échoué (${(err && err.message) || "erreur inconnue"}). Assure-toi que le serveur PHP tourne et que router.php reçoit bien les requêtes /api/*.</p>
                </div>
            </div>
        `;
    }

    render(tasks) {
        if (!Array.isArray(tasks)) {
            this.renderError(new Error("réponse de l'API invalide (tableau attendu)"));
            return;
        }

        // Normalisation : éviter undefined
        const normalizedTasks = tasks.map(t => ({
            ...t,
            tag: t.tag || "none",
            title: t.title || "(sans titre)"
        }));

        const grouped = {
            todo: normalizedTasks.filter(t => t.status === "todo"),
            doing: normalizedTasks.filter(t => t.status === "doing"),
            done: normalizedTasks.filter(t => t.status === "done")
        };

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .board {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                }

                .column {
                    flex: 1;
                    min-width: 240px;
                }

                .col-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 14px;
                    border-radius: 14px;
                    margin-bottom: 12px;
                    transition: background 0.3s ease;
                }

                .col-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--text);
                }

                .col-count {
                    margin-left: auto;
                    min-width: 20px;
                    height: 20px;
                    padding: 0 6px;
                    border-radius: 999px;
                    color: #fff;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .tasks {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    min-height: 220px;
                    padding: 4px;
                    border-radius: 16px;
                    border: 1.5px dashed transparent;
                    transition: border-color 0.15s ease, background 0.15s ease;
                }

                .column[data-status="todo"].drag-over .tasks { border-color: var(--col-todo-accent); background: var(--column-bg-hover); }
                .column[data-status="doing"].drag-over .tasks { border-color: var(--col-doing-accent); background: var(--column-bg-hover); }
                .column[data-status="done"].drag-over .tasks { border-color: var(--col-done-accent); background: var(--column-bg-hover); }

                .task {
                    position: relative;
                    background: var(--task-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 14px;
                    padding: 14px;
                    cursor: grab;
                    transition: box-shadow 0.15s ease, transform 0.15s ease, background 0.3s ease, border-color 0.3s ease;
                }

                .task:hover {
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
                }

                .task:active {
                    cursor: grabbing;
                }

                .task-actions {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    gap: 4px;
                    opacity: 0;
                    transition: opacity 0.15s ease;
                }

                .task:hover .task-actions {
                    opacity: 1;
                }

                .act {
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    cursor: pointer;
                    border-radius: 6px;
                }

                .act:hover { background: var(--column-bg-hover); color: var(--text); }
                .act.delete:hover { color: var(--accent-red); }
                .act.edit:hover { color: var(--accent-blue); }
                .act.tag-edit:hover { color: var(--accent-green); }

                .title {
                    display: block;
                    margin: 0;
                    padding-right: 62px;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 1.45;
                    color: var(--text);
                }

                .tag {
                    margin-top: 10px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 10px;
                    border-radius: 999px;
                    text-transform: capitalize;
                }

                .tag .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }

                .empty {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 0;
                    font-size: 12px;
                    color: var(--text-muted);
                    text-align: center;
                }

                input.title-edit, select.tag-select {
                    font: inherit;
                    font-size: 14px;
                    color: var(--text);
                    background: var(--input-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 6px 8px;
                    width: 100%;
                }
            </style>

            <div class="board">
                ${COLUMNS.map(col => `
                    <div class="column" data-status="${col.id}">
                        <div class="col-header" style="background:var(--col-${col.id}-bg)">
                            <span style="color:var(--col-${col.id}-accent); display:flex;">${ICONS[col.icon]}</span>
                            <span class="col-label">${col.label}</span>
                            <span class="col-count" style="background:var(--col-${col.id}-accent)">${grouped[col.id].length}</span>
                        </div>

                        <div class="tasks">
                            ${grouped[col.id].map(t => `
                                <div class="task" draggable="true" data-id="${t.id}">
                                    <div class="task-actions">
                                        <span class="act tag-edit" data-id="${t.id}" title="Changer le tag">${ICONS.tag}</span>
                                        <span class="act edit" data-id="${t.id}" title="Renommer">${ICONS.pencil}</span>
                                        <span class="act delete" data-id="${t.id}" title="Supprimer">${ICONS.x}</span>
                                    </div>

                                    <p class="title">${t.title}</p>

                                    ${t.tag !== "none" ? `
                                        <div class="tag" style="color:var(--tag-${t.tag}-color); background:var(--tag-${t.tag}-bg)">
                                            <span class="dot" style="background:var(--tag-${t.tag}-color)"></span>
                                            ${TAG_LABELS[t.tag] || t.tag}
                                        </div>
                                    ` : ""}
                                </div>
                            `).join("")}

                            ${grouped[col.id].length === 0 ? `<div class="empty">Aucune tâche</div>` : ""}
                        </div>
                    </div>
                `).join("")}
            </div>
        `;

        // DRAG START
        this.shadowRoot.querySelectorAll(".task").forEach(task => {
            task.addEventListener("dragstart", e => {
                e.dataTransfer.setData("id", task.dataset.id);
            });
        });

        // DRAG OVER + DROP
        this.shadowRoot.querySelectorAll(".column").forEach(col => {
            col.addEventListener("dragover", e => {
                e.preventDefault();
                col.classList.add("drag-over");
            });

            col.addEventListener("dragleave", () => {
                col.classList.remove("drag-over");
            });

            col.addEventListener("drop", e => {
                col.classList.remove("drag-over");
                const id = e.dataTransfer.getData("id");
                const newStatus = col.dataset.status;
                this.updateStatus(id, newStatus);
            });
        });

        // DELETE
        this.shadowRoot.querySelectorAll(".delete").forEach(btn => {
            btn.addEventListener("click", () => {
                this.deleteTask(btn.dataset.id);
            });
        });

        // EDIT TITLE
        this.shadowRoot.querySelectorAll(".edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const taskEl = btn.closest(".task");
                const titleEl = taskEl.querySelector(".title");

                const input = document.createElement("input");
                input.className = "title-edit";
                input.value = titleEl.textContent.trim();

                titleEl.replaceWith(input);
                input.focus();
                input.select();

                const save = () => {
                    const newTitle = input.value.trim();
                    if (newTitle) this.updateTitle(id, newTitle);
                };

                input.addEventListener("blur", save);
                input.addEventListener("keydown", e => {
                    if (e.key === "Enter") save();
                });
            });
        });

        // EDIT TAG
        this.shadowRoot.querySelectorAll(".tag-edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const taskEl = btn.closest(".task");

                const select = document.createElement("select");
                select.className = "tag-select";
                select.innerHTML = `
                    <option value="none">Sans tag</option>
                    <option value="urgent">Urgent</option>
                    <option value="bug">Bug</option>
                    <option value="feature">Feature</option>
                    <option value="perso">Perso</option>
                `;

                const currentTag = taskEl.querySelector(".tag");
                if (currentTag) {
                    select.value = Object.keys(TAG_LABELS).find(
                        k => TAG_LABELS[k].toLowerCase() === currentTag.textContent.trim().toLowerCase()
                    ) || "none";
                    currentTag.replaceWith(select);
                } else {
                    taskEl.appendChild(select);
                }

                select.focus();

                const save = () => this.updateTag(id, select.value);

                select.addEventListener("blur", save);
                select.addEventListener("change", save);
            });
        });
    }
}

customElements.define("kanban-board", KanbanBoard);