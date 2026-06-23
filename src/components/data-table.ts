class DataTable extends HTMLElement {
    static observedAttributes = ['columns', 'page-size'];

    private shadow: ShadowRoot;
    private _data: Record<string, any>[] = [];
    private _columns: { key: string; label: string }[] = [];
    private _sortKey: string = '';
    private _sortDir: 'asc' | 'desc' = 'asc';
    private _filter: string = '';
    private _page = 0;
    private _pageSize = 10;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    set data(value: Record<string, any>[]) {
        this._data = value;
        this.render();
    }

    connectedCallback() {
        this._columns = JSON.parse(this.getAttribute('columns') || '[]');
        this._pageSize = Number(this.getAttribute('page-size')) || 10;
        this.render();
    }

    private get filteredData(): Record<string, any>[] {
        if (!this._filter) return this._data;
        return this._data.filter(row =>
            Object.values(row).some(val =>
                String(val).toLowerCase().includes(this._filter.toLowerCase())
            )
        )
    }

    private get sortedData(): Record<string, any>[] {
        const data = [...this.filteredData];
        if (!this._sortKey) return data;
        return data.sort((a, b) => {
            const aVal = a[this._sortKey];
            const bVal = b[this._sortKey];
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return this._sortDir === 'asc' ? cmp : -cmp;
        })
    }

    private get pagedData() {
        const start = this._page * this._pageSize;
        return this.sortedData.slice(start, start + this._pageSize);
    }

    private addListeners() {
        this.shadow.querySelectorAll('th[data-key]').forEach((th) => {
            th.addEventListener('click', () => {
              const key = (th as HTMLElement).dataset.key!;
              if (this._sortKey === key) {
                this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
              } else {
                this._sortKey = key;
                this._sortDir = 'asc';
              }
              this._page = 0;
              this.dispatchEvent(new CustomEvent('sort-change', {
                detail: { key: this._sortKey, direction: this._sortDir },
                bubbles: true,
                composed: true,
              }));
              this.render();
            });
        });
      
        const filterInput = this.shadow.querySelector('.filter') as HTMLInputElement;
        filterInput?.addEventListener('input', () => {
            this._filter = filterInput.value;
            this._page = 0;
            this.dispatchEvent(new CustomEvent('filter-change', {
              detail: { value: this._filter },
              bubbles: true,
              composed: true,
            }));
            this.render();
        });
      
          this.shadow.querySelector('.prev')?.addEventListener('click', () => {
            if (this._page > 0) {
              this._page--;
              this.dispatchEvent(new CustomEvent('page-change', {
                detail: { page: this._page },
                bubbles: true,
                composed: true,
              }));
              this.render();
            }
        });
      
          this.shadow.querySelector('.next')?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredData.length / this._pageSize);
            if (this._page < totalPages - 1) {
              this._page++;
              this.dispatchEvent(new CustomEvent('page-change', {
                detail: { page: this._page },
                bubbles: true,
                composed: true,
              }));
              this.render();
            }
        });      
    }

    private render() {
        const totalPages = Math.ceil(this.filteredData.length / this._pageSize);
    
        this.shadow.innerHTML = `
          <style>
            :host { display: block; font-family: system-ui; }
            .filter { padding: 8px 12px; margin-bottom: 12px; width: 100%;
                      border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; }
            th { cursor: pointer; user-select: none; padding: 10px; text-align: left;
                 background: #f8f9fa; border-bottom: 2px solid #dee2e6; }
            th:hover { background: #e9ecef; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            .pagination { display: flex; gap: 8px; margin-top: 12px; align-items: center; }
            button { padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px;
                     cursor: pointer; background: white; }
            button:disabled { opacity: 0.5; cursor: not-allowed; }
            .sort-icon { margin-left: 4px; }
          </style>
          <input class="filter" placeholder="Search..." value="${this._filter}" />
          <table>
            <thead><tr>
              ${this._columns.map((col) => `
                <th data-key="${col.key}">
                  ${col.label}
                  <span class="sort-icon">${this._sortKey === col.key ? (this._sortDir === 'asc' ? '▲' : '▼') : ''}</span>
                </th>
              `).join('')}
            </tr></thead>
            <tbody>
              ${this.pagedData.map((row) => `
                <tr>${this._columns.map((col) => `<td>${row[col.key] ?? ''}</td>`).join('')}</tr>
              `).join('')}
            </tbody>
          </table>
          <div class="pagination">
            <button class="prev" ${this._page === 0 ? 'disabled' : ''}>Prev</button>
            <span>${this._page + 1} / ${totalPages}</span>
            <button class="next" ${this._page >= totalPages - 1 ? 'disabled' : ''}>Next</button>
          </div>
        `;
    
        this.addListeners();
      }
}

customElements.define('data-table', DataTable);