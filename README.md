# Tribeca (Eleventy 3.1.5 Port)

Faithful Eleventy `3.1.5` + Luxon conversion of the original Ghost Tribeca theme.

## Credit

- Original repository: `https://github.com/TryGhost/Tribeca`
- Upstream project: `TryGhost/Tribeca`
- This repository is an Eleventy/Handlebars port that preserves upstream HTML/CSS structure where Ghost runtime helpers are not required.

## Stack

- Eleventy `3.1.5`
- Handlebars templates
- Luxon date filters (UTC-normalized output)

## Commands

```bash
npm ci
npm run start
npm run build
```

## Routes

- `/`
- `/posts/:slug/`
- `/tag/:tag/` (plus `/tags/` index)
- `/author/:author/` (plus `/authors/` index)
- `/feed/feed.xml`
- `/sitemap.xml`
- `/robots.txt`
- `/humans.txt`
- `/about/`, `/contact/`, `/404.html`

## License

License remains MIT, matching upstream Tribeca. See [LICENSE](LICENSE).
