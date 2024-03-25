## How to make the adjusted file

Spec: https://developer.chrome.com/docs/webstore/images?hl=en#icons

Fight with GIMP to crop 96x96

And imagemagick

```bash
convert assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-3-96.png -gravity center -background white -extent 128x128 assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-3-128x128.png
convert assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-3-128x128.png -transparent white assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-3-128x128-t.png
```

But the cropping is not perfect, having ugly edge...
