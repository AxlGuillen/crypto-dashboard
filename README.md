<p align="center">
  <h1 align="center">Crypto Dashboard</h1>
  <p align="center">
    A modern, real-time cryptocurrency tracking application built with Next.js
    <br />
    <a href="https://crypto-dashboard.vercel.app"><strong>View Demo</strong></a>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="TailwindCSS" />
</p>

## Overview

Crypto Dashboard is a comprehensive cryptocurrency monitoring application that provides real-time data, market analysis, and portfolio tracking features. Built with performance and user experience in mind, it offers a clean interface to track the top 50 cryptocurrencies by market cap.

### Key Features

- **Real-Time Data** - Live cryptocurrency prices updated from CoinGecko API
- **Market Overview** - Global metrics including total market cap, volume, and BTC dominance
- **Interactive Charts** - Price history visualization with multiple time ranges (24h, 7d, 30d, 1y)
- **Watchlist** - Save and compare your favorite cryptocurrencies
- **Market Analysis** - Trending coins, top gainers and losers
- **Dark Mode** - Full theme support with system preference detection
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Performance Optimized** - Client-side caching and Vercel Speed Insights

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [TailwindCSS 4](https://tailwindcss.com/) |
| UI Components | [Radix UI](https://www.radix-ui.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| API | [CoinGecko](https://www.coingecko.com/en/api) |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/AxlGuillen/crypto-dashboard.git
   cd crypto-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
crypto-dashboard/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard (home)
│   ├── layout.tsx         # Root layout with providers
│   ├── crypto/[id]/       # Dynamic crypto detail page
│   ├── market/            # Market analysis page
│   └── watchlist/         # Favorites page
├── components/
│   ├── ui/                # Base UI components (Button, Card, Table, etc.)
│   ├── crypto/            # Crypto-specific components
│   ├── market/            # Market analysis components
│   └── layout/            # Layout components (Header)
├── hooks/                  # Custom React hooks for data fetching
├── lib/                    # Utilities (API client, cache, formatters)
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with top 50 cryptocurrencies |
| `/crypto/[id]` | Detailed view for a specific cryptocurrency |
| `/market` | Market analysis with trends and movers |
| `/watchlist` | Personal watchlist with comparison charts |

## API Reference

This project uses the [CoinGecko API](https://www.coingecko.com/en/api/documentation) (free tier):

- `GET /coins/markets` - Top cryptocurrencies by market cap
- `GET /coins/{id}` - Detailed cryptocurrency information
- `GET /coins/{id}/market_chart` - Historical price data
- `GET /global` - Global market statistics
- `GET /search/trending` - Trending cryptocurrencies

Data is cached client-side for 10 minutes to optimize performance.

## Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for the cryptocurrency data API
- [Vercel](https://vercel.com/) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com/) for UI component patterns

---

<p align="center">
  Made with Next.js and CoinGecko API
</p>
