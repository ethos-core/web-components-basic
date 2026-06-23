function calculatePrimesSync(limit: number): number[] {
    const primes: number[] = [];

    for (let i = 2; i <= limit; i++) {
        let isPrime = true;
        for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) { isPrime = false; break; }
        }
        if (isPrime) primes.push(i);
    }

    return primes;
}

export function setupWebWorkers() {
    const badge = document.getElementById('badge-workers')!;
    const output = document.getElementById('output-workers')!;
    const btnWorker = document.getElementById('btn-calc-primes') as HTMLButtonElement;
    const btnMain = document.getElementById('btn-calc-main') as HTMLButtonElement;
    const limitInput = document.getElementById('prime-limit') as HTMLInputElement;

    if (typeof Worker === 'undefined') {
        badge.textContent = 'Not Supported';
        badge.classList.add('unsupported');
        output.textContent = 'Web Workers are not supported in this browser.';
        btnWorker.disabled = true;
        return;
    }

    badge.textContent = 'Supported';
    badge.classList.add('supported');

    btnWorker.addEventListener('click', () => {
        const limit = Number(limitInput.value) || 100000;
        output.textContent = 'Calculating...';
        btnWorker.disabled = true;

        const start = performance.now();
        const worker = new Worker(
            new URL('../prime-worker.ts', import.meta.url),
            { type: 'module' }
        );

        worker.postMessage(limit);
        worker.onmessage = (e) => {
            const elapsed = (performance.now() - start).toFixed(2);
            output.textContent =
                `✅ Worker done: found ${e.data.count.toLocaleString()} primes (${elapsed}ms)\n` +
                `Main thread was not blocked.`;
            worker.terminate();
            btnWorker.disabled = false;
        };
        worker.onerror = (err) => {
            output.textContent = `❌ Worker error: ${err.message}`;
            worker.terminate();
            btnWorker.disabled = false;
        }
    });

    btnMain.addEventListener('click', () => {
        const limit = Number(limitInput.value) || 100000;
        output.textContent = '⏳ Calculating on main thread (UI may freeze)...';
    
        requestAnimationFrame(() => {
          const start = performance.now();
          const primes = calculatePrimesSync(limit);
          const elapsed = (performance.now() - start).toFixed(1);
          output.textContent =
            `✅ Main thread done: found ${primes.length.toLocaleString()} primes (${elapsed}ms)\n` +
            `⚠️ Notice how the UI froze during the calculation.`;
        });
    });    
}
