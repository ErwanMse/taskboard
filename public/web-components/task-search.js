const ICONS = {
    search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

class TaskSearch extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();

        const input = this.shadowRoot.querySelector("input");
        const clearBtn = this.shadowRoot.querySelector(".clear");

        input.addEventListener("input", e => {
            const query = e.target.value.toLowerCase();
            clearBtn.hidden = query.length === 0;
            this.filter(query);
        });

        clearBtn.addEventListener("click", () => {
            input.value = "";
            clearBtn.hidden = true;
            input.focus();
            this.filter("");
        });
    }

    filter(query) {
        const board = document.querySelector("kanban-board");
        if (!board) return;

        const tasks = board.shadowRoot.querySelectorAll(".task");

        tasks.forEach(task => {
            const title = (task.querySelector(".title")?.textContent || "").toLowerCase();
            const tag = (task.querySelector(".tag")?.textContent || "").toLowerCase();

            const match =
                title.includes(query) ||
                tag.includes(query);

            task.style.display = match ? "" : "none";
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: contents;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .search-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--input-bg);
                    border-radius: 12px;
                    padding: 9px 12px;
                    flex: 1 1 220px;
                    min-width: 180px;
                }

                .search-group svg {
                    color: var(--text-muted);
                    flex-shrink: 0;
                }

                input {
                    flex: 1;
                    min-width: 0;
                    background: transparent;
                    border: none;
                    outline: none;
                    font: inherit;
                    font-size: 14px;
                    color: var(--text);
                }

                input::placeholder {
                    color: var(--text-muted);
                    opacity: 0.9;
                }

                .clear {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: var(--text-muted);
                }

                .clear:hover {
                    color: var(--text);
                }
            </style>

            <div class="search-group">
                ${ICONS.search}
                <input type="text" placeholder="Rechercher une tâche…" />
                <button class="clear" type="button" hidden>${ICONS.x}</button>
            </div>
        `;
    }
}

customElements.define("task-search", TaskSearch);