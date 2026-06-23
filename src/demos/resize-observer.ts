export function setupResizeObserver() {
    const badge = document.getElementById('badge-resize') as HTMLElement;
    const output = document.getElementById('output-resize') as HTMLElement;
    const container = document.getElementById('resize-box')!;

    if (!('ResizeObserver' in window)) {
        badge.textContent = 'ResizeObserver is not supported in this browser';
        badge.classList.add('unsupported');
        output.textContent = 'ResizeObserver is not supported in this browser';
        return;
    }
    
    badge.textContent = 'Supported';
    badge.classList.add('supported');

    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        const size = width < 400 ? 'small' : width < 800 ? 'medium' : 'large';
        container.dataset.size = size;

        const labels: Record<string, string> = {
            small: '🟡 Small (< 400px)',
            medium: '🟢 Medium (400–800px)',
            large: '🔵 Large (> 800px)',
        };
        output.textContent = `Size: ${Math.round(width)} × ${Math.round(height)}px → ${labels[size]}`;
        }
    });

    observer.observe(container);
}