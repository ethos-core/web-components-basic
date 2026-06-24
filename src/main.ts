import './components/star-rating';
import './components/color-picker';
import './components/lazy-image';
import './components/data-table';
import './components/toast-notification';
import { ToastNotification } from './components/toast-notification';
import { setupScrollAnimations } from './demos/intersection-observer';
import { setupResizeObserver } from './demos/resize-observer';
import { setupWebWorkers } from './demos/web-workers';
import { setupClipboard } from './demos/clipboard';
import { setupGeolocation } from './demos/geolocation';

const table = document.querySelector('data-table') as any;
table.data = [
  { name: 'Alice', age: 28, city: 'Tokyo' },
  { name: 'Bob', age: 34, city: 'Osaka' },
  { name: 'Charlie', age: 22, city: 'Kyoto' },
  { name: 'Diana', age: 41, city: 'Nagoya' },
  { name: 'Eve', age: 30, city: 'Fukuoka' },
  { name: 'Frank', age: 26, city: 'Sapporo' },
  { name: 'Grace', age: 37, city: 'Tokyo' },
];

document.getElementById('toast-success')!.addEventListener('click', () =>
  ToastNotification.show('Operation completed!', { type: 'success' })
);
document.getElementById('toast-error')!.addEventListener('click', () =>
  ToastNotification.show('Something went wrong.', { type: 'error' })
);
document.getElementById('toast-warning')!.addEventListener('click', () =>
  ToastNotification.show('Please check your input.', { type: 'warning' })
);
document.getElementById('toast-info')!.addEventListener('click', () =>
  ToastNotification.show('New update available.', { type: 'info' })
);

setupScrollAnimations();
setupResizeObserver();
setupWebWorkers();
setupClipboard();
setupGeolocation();
