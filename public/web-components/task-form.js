const ICONS = {
    plus: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    tag: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L3 3l.24 6.59a2 2 0 0 0 .59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l6.34-6.34a2 2 0 0 0 .01-2.84Z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>`,
};

class TaskForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector("form").addEventListener("submit", e => {
            e.preventDefault();
            this.submit();
        });
    }

    async submit() {
        const input = this.shadowRoot.querySelector("input");
        const select = this.shadowRoot.querySelector("select");

        const title = input.value.trim();
        const tag = select.value;

        if (!title) return;

        await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, tag })
        });

        input.value = "";
        select.value = "none";

        const board = document.querySelector("kanban-board");
        if (board) board.connectedCallback();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: contents;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                form {
                    display: contents;
                }

                .input-group, .tag-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--input-bg);
                    border-radius: 12px;
                    padding: 9px 12px;
                }

                .input-group {
                    flex: 1 1 180px;
                    min-width: 160px;
                }

                .tag-group {
                    flex: 0 0 auto;
                }

                .input-group svg, .tag-group svg {
                    color: var(--text-muted);
                    flex-shrink: 0;
                }

                input, select {
                    background: transparent;
                    border: none;
                    outline: none;
                    font: inherit;
                    font-size: 14px;
                    color: var(--text);
                }

                input {
                    flex: 1;
                    min-width: 0;
                }

                input::placeholder {
                    color: var(--text-muted);
                    opacity: 0.9;
                }

                select {
                    cursor: pointer;
                }

                button {
                    flex: 0 0 auto;
                    padding: 9px 18px;
                    font-size: 14px;
                    font-weight: 600;
                    font-family: inherit;
                    cursor: pointer;
                    border-radius: 12px;
                    border: none;
                    color: #fff;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    transition: opacity 0.2s ease, transform 0.1s ease;
                }

                button:hover { opacity: 0.9; }
                button:active { transform: scale(0.97); }
            </style>

            <form>
                <div class="input-group">
                    ${ICONS.plus}
                    <input type="text" placeholder="Nouvelle tâche…" />
                </div>

                <div class="tag-group">
                    ${ICONS.tag}
                    <select>
                        <option value="none">Sans tag</option>
                        <option value="urgent">Urgent</option>
                        <option value="bug">Bug</option>
                        <option value="feature">Feature</option>
                        <option value="perso">Perso</option>
                    </select>
                </div>

                <button type="submit">Ajouter</button>
            </form>
        `;
    }
}

customElements.define("task-form", TaskForm);