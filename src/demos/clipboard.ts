export function setupClipboard() {
    const badge = document.getElementById('badge-clipboard')!;
    const output = document.getElementById('output-clipboard')!;
    const input = document.getElementById('clipboard-text') as HTMLInputElement;
    const btnCopy = document.getElementById('btn-copy') as HTMLButtonElement;
    const btnPaste = document.getElementById('btn-paste') as HTMLButtonElement;

    if (!navigator.clipboard) {
        badge.textContent = 'Not Supported';
        badge.classList.add('unsupported');
        output.textContent = 'Clipboard API is not supported in this browser (HTTPS required).';
        btnCopy.disabled = true;
        btnPaste.disabled = true;
        return;
    }

    badge.textContent = 'Supported';
    badge.classList.add('supported');

    btnCopy.addEventListener('click', async () => {
        const text = input.value;
        if (!text) {
        output.textContent = 'Please enter text to copy.';
        return;
        }
        try {
        await navigator.clipboard.writeText(text);
        const original = btnCopy.textContent;
        btnCopy.textContent = 'Copied ✓';
        output.textContent = `Copied to clipboard: "${text}"`;
        setTimeout(() => { btnCopy.textContent = original; }, 2000);
        } catch (err) {
        output.textContent = `❌ Copy failed: ${(err as Error).message}`;
        }
    });

    btnPaste.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            output.textContent = `Clipboard contents: "${text}"`;
        } catch (err) {
            output.textContent = `❌ Paste failed: ${(err as Error).message}\n（Check browser permissions settings）`;
        }
    });
}
