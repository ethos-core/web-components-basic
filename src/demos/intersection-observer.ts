export function setupScrollAnimations() {
    const badge = document.getElementById('badge-intersection') as HTMLElement;
    const output = document.getElementById('output-intersection') as HTMLElement;

    if (!('IntersectionObserver' in window)) {
        badge.textContent = 'IntersectionObserver is not supported in this browser';
        badge.classList.add('unsupported');
        output.textContent = 'IntersectionObserver is not supported in this browser';
        return;
    }

    badge.textContent = 'IntersectionObserver is supported';
    badge.classList.add('supported');

    let animatedCount = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
                animatedCount++;
                output.textContent = `${animatedCount} elements animated`;
            }
        }, {
            threshold: 0.2,
        });
    });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });
}