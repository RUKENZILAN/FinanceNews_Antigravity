# Global Finance Desk

A minimalist, premium, and legally compliant web application that aggregates the latest financial news from the world's most respected financial sources. 

![Project Interface Mockup Placeholder]

## Features

- **Top-Tier Sources**: Aggregates live headlines from Financial Times, CNBC, Wall Street Journal, The Economist, and Yahoo Finance (serving as a proxy for Reuters/Bloomberg).
- **Legally Compliant**: Fully respects publisher copyright and paywalls. Uses official RSS feeds to fetch headlines, snippets, and publication dates, directly routing the user to the original source to read the full article.
- **Premium Aesthetics**: Features a modern, high-end "Dark Mode" by default with glassmorphism effects, designed to look like a professional finance terminal. 
- **Light/Dark Theme Toggle**: Easily switch between a deep dark theme and a clean light theme with a single click.
- **Live Feed & Auto-Refresh**: The dashboard automatically fetches new data every 60 seconds. A "Last Updated" timestamp keeps you informed.
- **No Backend Required**: The application runs 100% in the browser. It leverages the `rss2json` API to bypass CORS restrictions securely, meaning no Node.js or backend servers are needed to run it.

## Technologies Used

- **HTML5**: Semantic structure.
- **Vanilla CSS3**: Custom grid layouts, glassmorphism (`backdrop-filter`), animations, and CSS variables for theming.
- **Vanilla JavaScript (ES6+)**: Handles async fetching, RSS parsing (via API), DOM manipulation, and filtering logic without relying on heavy frameworks like React.

## How to Run Locally

Because this is a static, frontend-only application, running it locally is incredibly simple:

1. Clone or download this repository.
2. Open the folder.
3. Double-click the `index.html` file to open it in your default web browser (Chrome, Safari, Firefox, Edge).
4. That's it!

## Deployment

To deploy this project to the web so anyone can access it:

You can host this project for free on platforms like **GitHub Pages**, **Netlify**, or **Vercel**.
- **Netlify/Vercel**: Just drag and drop the folder containing these files into their web interface.
- **GitHub Pages**: Upload these files to a GitHub repository and enable GitHub pages in the repository settings.

## Legal Disclaimer
This platform only provides headlines and short snippets through officially provided RSS feeds. All content rights belong to their original publishers. This application does not bypass paywalls or scrape protected content.
