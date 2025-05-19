# Cat Pic Viewer

This is a web app that shows random cat pictures using TheCatAPI.

## Features
- View random cats
- Save your favorites
- View them later

## How to Run
1. Install dependencies: `npm install`
2. Run: `node server.js`
3. Visit: `http://localhost:3000`

## API
- `/api/cat` - Gets random cat
- `/api/save-favorite` - Saves image
- `/api/get-favorites` - Gets saved images

## Tech
- Chart.js
- Swiper.js
- Supabase

## Supported Browsers
- Chrome
- Firefox
- Edge
- Safari

## Known Issues
- RLS must be disabled in Supabase for saving to work

## Future Ideas
- Add delete button for saved images
- Add login for personal collections
