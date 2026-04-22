# Alt Shift Cover Letter Generator

React application for generating and storing job application cover letters. The app uses Google Gen AI for text generation and keeps generated applications locally in IndexedDB.

## Requirements

- Node.js
- pnpm
- Google Gen AI API key

## Environment

Create a local `.env` file from `.env.example` and set the API key:

```bash
cp .env.example .env
```

```env
VITE_GOOGLE_GEN_AI_API_KEY=your_api_key_here
```

The API key is read by the client application through Vite environment variables.

## Scripts

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Build the production bundle:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

Run lint checks:

```bash
pnpm lint
pnpm stylelint
```

Start Storybook:

```bash
pnpm storybook
```

## Notes

- Generated applications are stored in the browser with IndexedDB.
- The app can create new cover letters, open saved applications, regenerate existing letters, copy text to the clipboard, and delete saved records.
