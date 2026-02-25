# Abhijeet Kulkarni - Personal Website

A clean, minimal single-page personal website built with Node.js and Express.

## Features

- Single-page portfolio (about, skills, projects, connect)
- Admin panel: site settings (status, availability, logo, tagline), add/remove works
- Live settings: status and “available for” (freelance, collaboration, mentorship) from admin
- Chat widget (“Ask Abhijeet”) with rule-based replies
- Contact form and public API for works and settings
- Responsive layout and hamburger nav on mobile

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

## Deployment (make it live)

### Deploy to Render (free, ~2 min)

1. Push this repo to GitHub (you already have [abhi-24395/Ahijeetwebsite](https://github.com/abhi-24395/Ahijeetwebsite)).
2. Go to **[render.com](https://render.com)** → Sign up / Log in (GitHub is fine).
3. **New** → **Blueprint** → connect your GitHub account and select the repo **Ahijeetwebsite**.
4. Render will read `render.yaml`: it will run `npm install` and `npm start`. Click **Apply**.
5. Wait for the first deploy to finish. Your site will be at `https://ahijeet-website.onrender.com` (or the name you see in the dashboard).
6. **Admin:** open `https://your-app.onrender.com/admin` → Login. Default credentials are in [ADMIN_PANEL.md](ADMIN_PANEL.md). Change the password after first login if you want.

**Note:** On Render’s free tier the app may sleep after inactivity; the first visit after that can take a few seconds to wake up.

**Optional:** In Render dashboard → your service → **Environment**, add `SESSION_SECRET` with a long random string (or leave the one Render generated).

### Other hosts

- **Railway:** Connect repo → set start command `npm start`.
- **Vercel / Netlify:** This app needs a Node server; use Render or Railway for the simplest deploy.

Set `PORT` if the host provides it (Render and Railway do automatically).

## License

MIT

