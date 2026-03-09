# SIPs - Self-Describing ABCD

An interactive, self-describing alphabet learning application designed specifically for toddlers (ages 2-5).

## Purpose

To teach children the alphabet using interactive storytelling cards. Each card features a letter, a familiar object, a colorful illustration, and a play button. When tapped, the object introduces itself and tells a fun, first-person story.

## How it works

- **26 Interactive Cards**: A complete A-Z grid of colorful cards.
- **Web Speech API**: Uses the browser's built-in `window.speechSynthesis` to read stories aloud. No external APIs or backend required.
- **Surprise Me**: A fun button that randomly selects a letter and plays its story.
- **Progress Tracking**: Uses `localStorage` to remember which letters the child has listened to, rewarding them with a star icon.
- **Delightful Animations**: Features confetti upon story completion and playful hover/tap animations.

## Technology Used

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Framer Motion** (for animations)
- **Lucide React** (for icons)
- **Canvas Confetti** (for rewards)
- **Web Speech API** (for text-to-speech)

## How Speech Works

The application uses the native `window.speechSynthesis` API. It attempts to find a friendly, clear English voice (preferring Google US English if available). The speech rate is slightly slowed down (`0.85`) and the pitch is slightly raised (`1.2`) to make it more engaging and understandable for toddlers.

## How to run locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the local URL provided by Vite (usually `http://localhost:3000`).

## How to deploy on GitHub Pages

This project is fully compatible with GitHub Pages as it is a 100% static site with no backend.

### Steps:

1. **Create repository**: Create a new repository on GitHub.
2. **Upload files**: Push this codebase to your new repository.
3. **Configure Vite for GitHub Pages**: If your repository is named `sips-abcd`, update `vite.config.ts` to include `base: '/sips-abcd/'`. If deploying to a user site (`username.github.io`), you can leave the base as `/`.
4. **Build the project**:
   ```bash
   npm run build
   ```
5. **Deploy**: You can use the `gh-pages` npm package or GitHub Actions to deploy the `dist` folder to the `gh-pages` branch.
6. **Enable GitHub Pages**: In your repository settings, go to Pages, and select the `gh-pages` branch as the source.
7. **Visit live URL**: Your site will be live at `https://username.github.io/repository-name`.
