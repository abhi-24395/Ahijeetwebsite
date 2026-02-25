# Abhijeet Kulkarni - Personal Website

A clean, minimal single-page personal website built with Node.js and Express.

## Features

- Single-page scrolling website
- Clean, professional design
- Responsive layout
- Backend API structure for future extensibility
- Contact form endpoint (ready for integration)

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3
- **Environment**: dotenv for configuration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, for custom configuration):
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## Project Structure

```
.
├── server.js          # Express server
├── package.json       # Dependencies and scripts
├── views/             # HTML templates
│   └── index.html     # Main page
├── public/            # Static assets (CSS, JS, images)
└── .env               # Environment variables (create from .env.example)
```

## API Endpoints

- `GET /` - Main website page
- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Contact form submission (ready for integration)

## Deployment

The website can be deployed to any Node.js hosting platform:
- Heroku
- Railway
- Render
- Vercel (with serverless functions)
- DigitalOcean App Platform

Make sure to set the `PORT` environment variable if required by your hosting platform.

## License

MIT

