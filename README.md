# AsnkiPC — High-Performance Custom PCs

A multi-page website for a fictional custom PC store, **AsnkiPC**. The project was created by a team of three students for the Web Technologies (Front-End) course.

🔗 **Live site:** https://ryam1i.github.io/WEB1-Front-End-Assignments/
🔗 **Repository:** https://github.com/ryam1i/WEB1-Front-End-Assignments

## About the Project

The website helps visitors choose and order a pre-built or custom PC: browse the catalog, compare components, learn how assembly and delivery work, and submit an order request.

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Landing page with a hero section and key advantages of the builds |
| Catalog | `catalog.html` | Starter, Pro and Ultra builds with specifications and prices |
| Specs Table | `specs.html` | Component-by-component comparison (CPU, GPU, RAM, SSD, pricing) with a "Jump to" sidebar |
| Delivery Process | `delivery.html` | Carousel of assembly and delivery stages, delivery timeframes |
| Custom Order | `order.html` | Order form for a custom build |
| Our Team | `team.html` | Information about the team |

## Team and Responsibilities

| Member | Pages |
|---|---|
| Timur Yukhnovets | `index.html`, `team.html` (`css/member1.css`) |
| Asanali Toleukhan | `catalog.html`, `order.html` (`css/member2.css`) |
| Etmakhambetov Abdrakhman | `specs.html`, `delivery.html` (`css/member3.css`) |

### Etmakhambetov Abdrakhman — Specs & Delivery
- `specs.html` — Starter / Pro / Ultra comparison tables inside `table-responsive`, a sticky "Jump to" sidebar (`sticky-lg-top`), the "Included With Every Build" section and a call-to-action panel.
- `delivery.html` — Bootstrap carousel with 9 assembly and delivery steps (captions and indicators), plus delivery timeframe cards.
- `css/member3.css` — styles for the header, cards, sidebar, tables and carousel.

### Timur Yukhnovets — Home & Team
- `index.html` — landing page with a hero section, a call-to-action button and the "Why Choose Our Builds" advantage cards.
- `team.html` — team page with member cards (avatar, role, interests).
- `css/member1.css` — styles for the header, hero, advantage cards and team cards.

### Asanali Toleukhan — Catalog & Order
- `catalog.html` — Starter, Pro and Ultra build cards with images, key specifications, prices and "Configure & Order" buttons.
- `order.html` — custom build order form (contact details, build type, budget, delivery method, accent color, notes) with a product image.
- `css/member2.css` — styles for the catalog cards, form controls and buttons.

## Technologies

- **HTML5** — semantic markup (`header`, `main`, `section`, `article`, `aside`, `nav`, `footer`) and accessibility attributes (`aria-*`, `alt`, skip link).
- **CSS3** — CSS variables (colors, radii, fonts), dark theme, hover effects and transitions.
- **Flexbox** — header, card headings, call-to-action panel and navigation.
- **Bootstrap 5.3.3** (CDN) — grid system (`row` / `col-*`), `navbar` with a hamburger menu, `carousel`, `table-responsive`, forms and utility classes.

## Responsiveness

The site is responsive across three device types:

- **Desktop** (992 px and up) — multi-column grids and an expanded navigation menu.
- **Tablet** (768–991 px) — cards arranged in two columns.
- **Mobile** (up to 576 px) — single-column layout, hamburger menu, and spec tables that shrink to fit their cards without horizontal scrolling.

## Project Structure

```
├── index.html
├── catalog.html
├── specs.html
├── delivery.html
├── order.html
├── team.html
├── css/
│   ├── style.css      # imports the base styles
│   ├── base.css       # shared styles and variables
│   ├── member1.css    # index, team (Timur)
│   ├── member2.css    # catalog, order (Asanali)
│   └── member3.css    # specs, delivery (Etmakhambetov)
├── images/
└── README.md
```

## Running Locally

```bash
git clone https://github.com/ryam1i/WEB1-Front-End-Assignments.git
cd WEB1-Front-End-Assignments
```

Open `index.html` in a browser (or use the Live Server extension in VS Code). An internet connection is required to load Bootstrap from the CDN.