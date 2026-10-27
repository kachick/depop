## How to make the adjusted file

Remove padding so the icon fills the canvas and does not look small on the browser toolbar:

```bash
magick assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-128x128-t.png -trim +repage -resize 128x128! assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-128x128-t.png
```

### Note

Chrome Web Store guidelines suggest 16px padding (96x96 actual icon inside 128x128):
https://developer.chrome.com/docs/webstore/images?hl=en#icons

However, with that padding, the icon looks much smaller than other extension icons in the Chrome toolbar.
Therefore, this icon fills the full 128x128 canvas without padding.
