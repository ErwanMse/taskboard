const TAG_LABELS = {
    urgent: "Urgent",
    bug: "Bug",
    feature: "Feature",
    perso: "Perso",
};

class TaskList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const tasks = await fetch("/api/tasks").then(r => r.json());
        this.render(tasks);
    }

    render(tasks) {
        const normalizedTasks = tasks.map(t => ({
            ...t,
            tag: t.tag || "none",
            title: t.title || "(sans titre)"
        }));

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .list {
                    background: var(--column-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    overflow: hidden;
                    transition: background 0.3s ease, border-color 0.3s ease;
                }

                .task {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--border-color);
                    transition: background 0.15s ease;
                }

                .task:last-child {
                    border-bottom: none;
                }

                .task:hover {
                    background: var(--column-bg-hover);
                }

                .id {
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--text-muted);
                    flex-shrink: 0;
                }

                .title {
                    flex: 1;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--text);
                }

                .tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 10px;
                    border-radius: 999px;
                    text-transform: capitalize;
                    flex-shrink: 0;
                }

                .tag .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }

                .empty {
                    padding: 24px 16px;
                    font-size: 12px;
                    color: var(--text-muted);
                    text-align: center;
                }
            </style>

            <div class="list">
                ${normalizedTasks.map(t => `
                    <div class="task">
                        <span class="id">#${t.id}</span>
                        <span class="title">${t.title}</span>
                        ${t.tag !== "none" ? `
                            <span class="tag" style="color:var(--tag-${t.tag}-color); background:var(--tag-${t.tag}-bg)">
                                <span class="dot" style="background:var(--tag-${t.tag}-color)"></span>
                                ${TAG_LABELS[t.tag] || t.tag}
                            </span>
                        ` : ""}
                    </div>
                `).join("")}

                ${normalizedTasks.length === 0 ? `<div class="empty">Aucune tâche</div>` : ""}
            </div>
        `;
    }
}

customElements.define("task-list", TaskList);