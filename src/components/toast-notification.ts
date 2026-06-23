export class ToastNotification extends HTMLElement {
    static observedAttributes = ['type', 'duration'];
  
    private shadow: ShadowRoot;
    private timer?: number;
  
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      const duration = Number(this.getAttribute('duration')) || 3000;
      this.timer = window.setTimeout(() => this.dismiss(), duration);
      requestAnimationFrame(() => this.classList.add('visible'));
    }
  
    disconnectedCallback() {
      if (this.timer) clearTimeout(this.timer);
    }
  
    dismiss() {
      this.classList.add('dismissing');
      this.addEventListener('animationend', () => this.remove(), { once: true });
    }
  
    static show(message: string, options: { type?: string; duration?: number } = {}) {
      let container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        Object.assign(container.style, {
          position: 'fixed', top: '20px', right: '20px', zIndex: '9999',
          display: 'flex', flexDirection: 'column', gap: '8px',
        });
        document.body.appendChild(container);
      }
  
      const toast = document.createElement('toast-notification');
      toast.setAttribute('type', options.type || 'info');
      if (options.duration) toast.setAttribute('duration', String(options.duration));
      toast.textContent = message;
      container.appendChild(toast);
    }
  
    private render() {
      const type = this.getAttribute('type') || 'info';
      const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
  
      this.shadow.innerHTML = `
        <style>
          :host { display: block; padding: 12px 16px; border-radius: 8px; color: white;
                  font-family: system-ui; font-size: 14px; min-width: 280px;
                  background: ${colors[type as keyof typeof colors] || colors.info};
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  transform: translateX(120%); transition: transform 0.3s ease; }
          :host(.visible) { transform: translateX(0); }
          :host(.dismissing) { animation: fadeOut 0.3s forwards; }
          @keyframes fadeOut { to { opacity: 0; transform: translateX(120%); } }
          .content { display: flex; justify-content: space-between; align-items: center; }
          .close { background: none; border: none; color: white; cursor: pointer;
                   font-size: 18px; padding: 0 0 0 12px; }
        </style>
        <div class="content">
          <slot></slot>
          <button class="close" aria-label="Close">×</button>
        </div>
      `;
  
      this.shadow.querySelector('.close')!.addEventListener('click', () => this.dismiss());
    }
  }
  
  customElements.define('toast-notification', ToastNotification);