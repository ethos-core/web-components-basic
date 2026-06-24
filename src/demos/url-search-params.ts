class FilterState {
    private params: URLSearchParams;

    constructor() {
        this.params = new URLSearchParams(window.location.search);
    }

    get(key: string): string | null {
        return this.params.get(key);
    }

    set(key: string, value: string) {
        this.params.set(key, value);
        this.updateUrl();
    }

    delete(key: string) {
        this.params.delete(key);
        this.updateUrl();
    }

    clear() {
        this.params = new URLSearchParams();
        this.updateUrl();
    }

    entries(): [string, string][] {
        return Array.from(this.params.entries());
    }

    private updateUrl() {
        const query = this.params.toString();
        const newUrl = query
            ? `${window.location.pathname}?${query}`
            : window.location.pathname;
        window.history.replaceState(null, '', newUrl);
    }
}

export function setupUrlSearchParams() {
    const badge = document.getElementById('badge-url-params')!;
    const output = document.getElementById('output-url-params')!;
    const currentUrlDisplay = document.getElementById('current-url')!;
    const keyInput = document.getElementById('param-key') as HTMLInputElement;
    const valueInput = document.getElementById('param-value') as HTMLInputElement;
    const btnSet = document.getElementById('btn-param-set') as HTMLButtonElement;
    const btnDelete = document.getElementById('btn-param-delete') as HTMLButtonElement;
    const btnClear = document.getElementById('btn-param-clear') as HTMLButtonElement;

    if (!('URLSearchParams' in window)) {
        badge.textContent = 'Not Supported';
        badge.classList.add('unsupported');
        output.textContent = 'URLSearchParams is not supported in this browser.';
        return;
    }
    
    badge.textContent = 'Supported';
    badge.classList.add('supported');
    
    const filters = new FilterState();

    function updateDisplay() {
        currentUrlDisplay.textContent = window.location.href;
    
        const entries = filters.entries();
        if (entries.length === 0) {
            output.textContent = 'No parameters';
        } else {
            output.textContent = entries
                .map(([k, v]) => `${k} = ${v}`)
                .join('\n');
        }
    }

    updateDisplay();

    btnSet.addEventListener('click', () => {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        if (!key) {
          output.textContent = '⚠️ Please enter a key.';
          return;
        }
        filters.set(key, value);
        updateDisplay();
    });
    
    btnDelete.addEventListener('click', () => {
        const key = keyInput.value.trim();
        if (!key) {
          output.textContent = '⚠️ Please enter a key to delete.';
          return;
        }
        filters.delete(key);
        updateDisplay();
    });
    
    btnClear.addEventListener('click', () => {
        filters.clear();
        updateDisplay();
    });
}