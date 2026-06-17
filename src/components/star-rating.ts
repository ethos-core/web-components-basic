class StarRating extends HTMLElement {
    static observedAttributes = ['value', 'max', 'readonly'];

    private shadow: ShadowRoot;
    private _value = 0;
    private _max = 5;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this._value = Number(this.getAttribute('value')) || 0;
        this._max = Number(this.getAttribute('max')) || 0;
        this.setAttribute('role', 'slider');
        this.setAttribute('tabindex', '0');
        this.setAttribute('aria-valuemin', '0');
        this.setAttribute('aria-valuemax', String(this._max));
        this.setAttribute('aria-valuenow', String(this._value));
        this.render();
        this.addEventListener();
    }

    attributeChangedCallback(name: string, _old: string, value: string) {
        if (name === 'value') {
            this._value = Number(value);
            this.setAttribute('aria-valuenow', String(this._value));
            this.render();
        }
        if (name === 'max') {
            this._max = Number(value);
            this.setAttribute('aria-valuemax', String(this._max));
            this.render();
        }
    }

    private addEventListeners() {
        this.shadow.addEventListener('click', (e => {
            const star = (e.target as HTMLElement).closest('[data-value]') as HTMLElement;
            if (star && !this.getAttribute('readonly')) {
                this.setValue(Number(star.dataset.value));
            }
        }));

        this.addEventListener('keydown', (e => {
            if (this.hasAttribute('readonly')) return;
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowUp':
                    this.setValue(Math.min(this._value + 1, this._max));
                    break;
                case 'ArrowLeft':
                case 'ArrowDown':
                    this.setValue(Math.max(this._value - 1, 0));
                    break;
            }
        }));
    }

    private setValue(val: number) {
        this._value = val;
        this.setAttribute('value', String(val));
        this.dispatchEvent(new CustomEvent('rating-change', {
            detail: { value: val },
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        const stars = Array.from({ length: this._max }, (_, i) => {
            const filled = i < this._value;
            return `<span class="star ${filled ? 'filled' : ''}" data-value="${i + 1}" aria-hidden="true">
                ${filled ? '★' : '☆'}
            </span>`;
        }).join('');

        this.shadow.innerHTML = `
            <style>
                :host { display: inline-flex; gap: 2px; cursor: pointer; font-size: 24px; }
                :host([readonly]) { cursor: default; }
                .star { transition: transform 0.15s ease, color 0.15s ease; }
                .star:hover { transform: scale(1.2); }
                .star.filled { color: #f5a623; }
            </style>
            ${stars}
        `;
    }
}

customElements.define('star-rating', StarRating);