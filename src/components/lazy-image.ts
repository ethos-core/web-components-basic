class LazyImage extends HTMLElement {
    static observedAttributes = ['src', 'alt', 'width', 'height'];

    private shadow: ShadowRoot;
    private observer: IntersectionObserver;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                this.loadImage();
                this.observer.disconnect();
            }
        }, {
            rootMargin: '200px',
        });
        this.observer.observe(this);
    }

    disconnectedCallback() {
        this.observer.disconnect();
    }

    private loadImage() {
        const img = this.shadow.querySelector('img') as HTMLImageElement;
        img.src = this.getAttribute('src') || '';
        img.onload = () => {
            img.classList.add('loaded');
            this.dispatchEvent(new CustomEvent('loaded', {
                bubbles: true,
                composed: true,
            }));
        }
    }

    private render() {
        const w = this.getAttribute('width') || '100%';
        const h = this.getAttribute('height') || 'auto';
        const alt = this.getAttribute('alt') || '';

        this.shadow.innerHTML = `
            <style>
                :host { display: block; overflow: hidden; }
                .container { position: relative; width: ${w}px; height: ${h}px;
                            background: linear-gradient(135deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
                            background-size: 200% 100%;
                            animation: shimmer 1.5s infinite; }
                @keyframes shimmer { to { background-position: -200% 0; } }
                img { width: 100%; height: 100%; object-fit: cover;
                    opacity: 0; transition: opacity 0.5s ease; }
                img.loaded { opacity: 1; }
            </style>
            <div class="container">
                <img alt="${alt}" />
            </div>
        `;
    }
}

customElements.define('lazy-image', LazyImage);
