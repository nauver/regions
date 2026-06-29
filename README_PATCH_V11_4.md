# Proud of My Region V11.4 cleanup patch

Replace:
- index.html
- kiosk.html
- map-screen.html
- assets/v11-4-cleanup.css
- assets/v11-4-cleanup.js

Do not replace:
- assets/config.js
- assets/app.js
- assets/styles.css

Changes:
- Fixes the default silhouette proportions so it no longer appears stretched in kiosk preview, wall portrait, admin thumbs and background cards.
- Removes visible references/links to Leaflet or leaflet.com/leafletjs.com from map attribution.
- Keeps required map/data credits visible: OpenStreetMap, European Commission Eurostat GISCO, EuroGeographics.

After deploy:
- Commit changes.
- Hard refresh with Ctrl+Shift+R.
- Verify map-screen.html and kiosk.html.
