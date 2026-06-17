# web-components-basic

A collection of reusable Web Components built with vanilla TypeScript and Shadow DOM — no frameworks required.

## Components

| Component | Tag | Description |
|---|---|---|
| Star Rating | `<star-rating>` | Interactive star-based rating input with keyboard support |
| Color Picker | `<color-picker>` | Color selection component |
| Lazy Image | `<lazy-image>` | Image element with lazy-loading via Intersection Observer |
| Data Table | `<data-table>` | Sortable / filterable data table |
| Toast Notification | `<toast-notification>` | Lightweight toast notification system |

## Tech Stack

- **TypeScript** — type-safe component authoring
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
│   └── main.ts
└── package.json
```

## License

ISC
