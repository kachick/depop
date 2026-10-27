## How to make the adjusted files

Two different icon files are used to follow official guidelines:

1. **Toolbar icon** (`from-icon-sadness-star-2024-03-25-toolbar-128x128-t.png`):
   Fills the 128x128 canvas without padding so it does not look small next to other extension buttons on the browser toolbar.

   ```bash
   magick assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-toolbar-128x128-t.png -trim +repage -resize 128x128! assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-toolbar-128x128-t.png
   ```

2. **Store and management icon** (`from-icon-sadness-star-2024-03-25-store-128x128-t.png`):
   Follows Chrome Web Store guidelines (96x96 actual icon inside 128x128 with 16px transparent padding):
   https://developer.chrome.com/docs/webstore/images?hl=en#icons

   ```bash
   magick assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-toolbar-128x128-t.png -resize 96x96 -gravity center -background none -extent 128x128 assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-store-128x128-t.png
   ```
