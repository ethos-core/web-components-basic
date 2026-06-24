function getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    });
}

function formatGeolocationError(error: GeolocationPositionError) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return 'Geolocation access was denied. Check browser permissions settings.';
        case error.POSITION_UNAVAILABLE:
            return 'Geolocation information is not available.';
        case error.TIMEOUT:
            return 'Geolocation request timed out.';
        default:
            return `Unknown error: ${error.message}`;
    }
}

export function setupGeolocation() {
    const badge = document.getElementById('badge-geolocation')!;
    const output = document.getElementById('output-geolocation')!;
    const btn = document.getElementById('btn-location') as HTMLButtonElement;

    if (!('geolocation' in navigator)) {
        badge.textContent = 'Not Supported';
        badge.classList.add('unsupported');
        output.textContent = 'Geolocation API is not supported in this browser.';
        btn.disabled = true;
        return;
    }

    badge.textContent = 'Supported';
    badge.classList.add('supported');


    btn.addEventListener('click', async () => {
        output.textContent = '⏳ Getting current location...';
        btn.disabled = true;
    
        try {
          const pos = await getCurrentPosition();
          const { latitude, longitude, accuracy } = pos.coords;
          const mapUrl = `https://www.openstreetmap.org/#map=15/${latitude}/${longitude}`;
    
          output.innerHTML =
            `📍 Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}\n` +
            `Accuracy: ±${Math.round(accuracy)}m\n` +
            `<a href="${mapUrl}" target="_blank" rel="noopener">🗺 Open in OpenStreetMap</a>`;
        } catch (err) {
          const geoErr = err as GeolocationPositionError;
          output.textContent = `❌ ${formatGeolocationError(geoErr)}`;
        } finally {
          btn.disabled = false;
        }
    });
}
