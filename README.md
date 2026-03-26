# OurTube

OurTube is a Next.js web app that helps users search YouTube videos and generate MP3 download links quickly.

It provides a streamlined flow:

1. Search videos
2. Pick a result
3. Generate an MP3 link
4. Keep local download history and analytics

## Highlights

- Fast video search experience
- One-click MP3 preparation flow
- Voice-enabled search input (browser-supported)
- Local download history with re-download actions
- Basic history analytics (daily activity, top channels, totals)
- Responsive UI built with reusable components

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui + Radix UI primitives
- Sonner for notifications
- RapidAPI backend integration for search and MP3 link generation

## Project Structure

```text
app/
	actions/search.ts         # Server action for search requests
	api/download/route.ts     # API route that prepares MP3 download links
	search/page.tsx           # Search results page
	download/page.tsx         # Download preparation and action page
	downloads/page.tsx        # Saved download history list
	history/page.tsx          # Download analytics view
components/
	layout/                   # Navbar, search bar, branding
	search/                   # Search results and download controls
	ui/                       # Reusable UI building blocks
lib/
	download-history.ts       # LocalStorage history state + helpers
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- A RapidAPI key for `yt-search-and-download-mp3.p.rapidapi.com`

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env.local` and add your API key:

```env
RAPIDAPI_KEY=your_rapidapi_key_here
```

3. Run the development server:

```bash
pnpm dev
```

4. Open http://localhost:3000

## Available Scripts

- `pnpm dev` - Start local development server
- `pnpm build` - Create production build
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint

## Key Routes

- `/` - Landing page
- `/search?query=...` - Search results
- `/download?...` - MP3 preparation flow
- `/downloads` - Saved downloads
- `/history` - History analytics
- `/api/download` - Server endpoint for MP3 link generation

## Environment Variables

| Variable       | Required | Description                                      |
| -------------- | -------- | ------------------------------------------------ |
| `RAPIDAPI_KEY` | Yes      | API key used by search and download integrations |

## Notes

- Download history is stored in browser localStorage and does not sync across devices.
- This project does not host media files; it generates links via a third-party API.
- Make sure your use complies with YouTube terms and local copyright laws.

## Deployment

You can deploy this project on any Node-compatible platform.

Typical production flow:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Set `RAPIDAPI_KEY` in your deployment environment before running the app.
