function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;  
}

export function setupDragAndDrop() {
    const badge = document.getElementById('badge-dnd')!;
    const zone = document.getElementById('drop-zone')!;
    const fileList = document.getElementById('file-list')!;
  
    if (!('DataTransfer' in window)) {
        badge.textContent = 'Not Supported';
        badge.classList.add('unsupported');
        zone.textContent = 'Drag and Drop API is not supported in this browser.';
        return;
    }

    badge.textContent = 'Supported';
    badge.classList.add('supported');

    const droppedFiles: File[] = [];

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
        zone.textContent = '📂 Drop here!';
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
        zone.textContent = '📁 Drop files here';
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        zone.textContent = '📁 Drop files here';

        const files = Array.from(e.dataTransfer?.files || []);
        if (files.length === 0) return;

        droppedFiles.push(...files);
        renderFileList();
    });

    function renderFileList() {
        fileList.innerHTML = droppedFiles
        .map((file, i) => {
            const icon = file.type.startsWith('image/') ? '🖼'
            : file.type.startsWith('text/') ? '📄'
            : file.type.includes('pdf') ? '📕'
            : '📎';
            return `<li>${icon} ${file.name} (${formatFileSize(file.size)}) — ${file.type || 'unknown type'}</li>`;
        })
        .join('');
    }
}