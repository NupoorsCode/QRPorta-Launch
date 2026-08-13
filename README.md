# QRporta Raksha Bandhan Microsite

Static GitHub Pages campaign site for the QRporta Raksha Bandhan 2026 campaign.

## 1. Configure the site

Open `script.js` and replace:

```js
campaignQRUrl: "https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY/reveal.html",
qrportaWebsiteUrl: "https://YOUR-QRPORTA-WEBSITE.com",
demoUrl: "https://YOUR-QRPORTA-WEBSITE.com/demo"
```

with the real URLs.

## 2. Run locally

Because the site uses client-side JavaScript and a CDN QR library, a local web server is recommended.

Python:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

## 3. GitHub Pages

1. Create a GitHub repository.
2. Upload all files while preserving the folder structure.
3. Go to **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select the `main` branch and `/root`.
6. Save.
7. Wait for GitHub Pages to publish the site.

## 4. Test the campaign date

The reveal page supports development previews:

- `reveal.html?preview=aug28`
- `reveal.html?preview=aug29`

Use these to test both experiences without changing your computer's clock.

## Important technical note

The campaign QR is intentionally a single public QR destination. The personal message is passed through the generated URL/local browser state for the demo experience. Do not put sensitive/private information in the QR URL.

For a production system where every recipient must receive private persistent messages, QRporta would need a backend/database or another server-side storage mechanism.
