class ColorPicker extends HTMLElement {
    static observedAttributes = ['value'];

    private shadow: ShadowRoot;
    private h = 0;
    private s = 100;
    private l = 50;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    private addEventListeners() {
        this.shadow.querySelectorAll('input[type="range"]').forEach(input => {
            const target = e.target as HTMLInputElement;
            const prop = target.dataset.prop as 'h' | 's' | 'l';
            this[prop] = Number(target.value);
            this.updatePreview();
            this.emitChange();
        })
    }

    private updatePreview() {
        const preview = this.shadow.querySelector('.preview') as HTMLElement;
        const color = `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
        preview.style.backgroundColor = color;
        this.style.setProperty('--selected-color', color);
    }

    private emitChange() {
        this.dispatchEvent(new CustomEvent('color-change', {
            detail: {
                hsl: `hsl(${this.h}, ${this.s}%, ${this.l}%)`,
                hex: this.hslToHex(this.h, this.s, this.l),
            },
            bubbles: true,
            composed: true,
        }));
    }

    private hslToHex(h: number, s: number, l: number): string {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                :host { display: block; padding: 16px; font-family: system-ui; }
                .preview { width: 100%; height: 60px; border-radius: 8px; margin-bottom: 12px;
                        border: 1px solid #ddd; background: hsl(${this.h}, ${this.s}%, ${this.l}%); }
                .slider-group { margin: 8px 0; }
                label { display: flex; justify-content: space-between; font-size: 14px; }
                input[type="range"] { width: 100%; }
                .hue-slider { accent-color: hsl(${this.h}, 100%, 50%); }
            </style>
            <div class="preview"></div>
            <div class="slider-group">
                <label>Hue: <span>${this.h}°</span></label>
                <input type="range" class="hue-slider" min="0" max="360" value="${this.h}" data-prop="h" />
            </div>
            <div class="slider-group">
                <label>Saturation: <span>${this.s}%</span></label>
                <input type="range" min="0" max="100" value="${this.s}" data-prop="s" />
            </div>
            <div class="slider-group">
                <label>Lightness: <span>${this.l}%</span></label>
                <input type="range" min="0" max="100" value="${this.l}" data-prop="l" />
            </div>
        `;
    }
}

customElements.define('color-picker', ColorPicker);
