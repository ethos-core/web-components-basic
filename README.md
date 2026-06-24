# web-components-basic

A collection of reusable Web Components and Web API demos built with vanilla TypeScript — no frameworks required.

## Web Components

Custom elements using Shadow DOM for style encapsulation.

| Component | Tag | Description |
|---|---|---|
| Star Rating | `<star-rating>` | Interactive star-based rating input with keyboard support |
| Color Picker | `<color-picker>` | HSL color picker with sliders and live preview |
| Lazy Image | `<lazy-image>` | Image element with lazy-loading via Intersection Observer |
| Data Table | `<data-table>` | Sortable, filterable, paginated data table |
| Toast Notification | `<toast-notification>` | Auto-dismissing toast notification with type variants |

## Web APIs Playground

Interactive demos showcasing modern browser APIs.

| # | API | Description |
|---|---|---|
| 1 | Intersection Observer | Scroll-triggered card animations |
| 2 | ResizeObserver | Size-aware responsive box with color changes |
| 3 | Web Workers | Prime number calculation offloaded to a worker thread |
| 4 | Clipboard API | Copy and paste text with the async clipboard API |
| 5 | Geolocation API | Current position retrieval with OpenStreetMap link |
| 6 | Web Speech API | Speech-to-text with voice commands (dark mode, scroll top) |
| 7 | Drag and Drop API | File drop zone with type detection and size formatting |
| 8 | URLSearchParams | Live URL query parameter management |

## Tech Stack

- **TypeScript** — type-safe component and demo authoring
- **Vite** — fast dev server and build tool
- **Shadow DOM** — style encapsulation per component

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
├── index.html
├── src/
│   ├── components/
│   │   ├── star-rating.ts
│   │   ├── color-picker.ts
│   │   ├── lazy-image.ts
│   │   ├── data-table.ts
│   │   └── toast-notification.ts
│   ├── demos/
│   │   ├── intersection-observer.ts
│   │   ├── resize-observer.ts
│   │   ├── web-workers.ts
│   │   ├── clipboard.ts
│   │   ├── geolocation.ts
│   │   ├── speech.ts
│   │   ├── drag-and-drop.ts
│   │   └── url-search-params.ts
│   ├── prime-worker.ts
│   └── main.ts
├── tsconfig.json
└── package.json
```

## License

ISC
