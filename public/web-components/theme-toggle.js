const ICONS = {
    moon: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>`,
};

class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector("button").addEventListener("click", () => {
            const current = document.documentElement.dataset.theme;
            document.documentElement.dataset.theme = current === "dark" ? "light" : "dark";
            this.updateIcon();
        });
    }

    updateIcon() {
        const isDark = document.documentElement.dataset.theme === "dark";
        this.shadowRoot.querySelector("button").innerHTML = isDark ? ICONS.sun : ICONS.moon;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: contents;
                }

                button {
                    width: 38px;
                    height: 38px;
                    flex: 0 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    cursor: pointer;
                    border-radius: 12px;
                    border: none;
                    background: var(--input-bg);
                    color: var(--text);
                    transition: transform 0.15s ease, background 0.3s ease, color 0.3s ease;
                }

                button:hover {
                    transform: scale(1.05);
                }
            </style>

            <button type="button">${ICONS.moon}</button>
        `;
        this.updateIcon();
    }
}

customElements.define("theme-toggle", ThemeToggle);