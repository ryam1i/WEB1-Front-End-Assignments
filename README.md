# AsnkiPC

Final project for the Web Technologies (Front-End) course.

**Group:** SE-2507
**Team:** Asanali Toleukhan, Timur Yukhnovets, Abdrakhman Etmakhambetov

Live site: https://ryam1i.github.io/WEB1-Front-End-Assignments/
Repository: https://github.com/ryam1i/WEB1-Front-End-Assignments

## About

AsnkiPC is a website for a made-up shop that sells gaming and workstation PCs. Our users are gamers and people who want a ready PC but don't want to build it themselves. On the site you can look at builds, compare parts, read how delivery works and send an order request.

## Pages

- `index.html` – home page
- `catalog.html` – catalog with search, price filter and currency converter
- `specs.html` – table that compares the builds
- `delivery.html` – how we assemble and deliver a PC, order tracking
- `order.html` – order form (4 steps)
- `team.html` – about our team
- `signup.html`, `login.html`, `profile.html` – account pages

## Who did what

- **Timur Yukhnovets** – home page, team page
- **Asanali Toleukhan** – catalog, order form
- **Abdrakhman Etmakhambetov** – specs table, delivery page

The final project features (login, validation, dark mode, API) we did together.

## Features

- Light and dark mode. The button is in the header and the choice is saved in localStorage, so it stays the same on all pages.
- Sign up and log in without a backend. Users are saved in localStorage, after login you go to the profile page where your data is shown.
- Form validation in JavaScript (email, password, phone, required fields). Forms have `novalidate` and errors are shown under the inputs.
- Search and price filter in the catalog. The last search is saved and shown again next time.
- Currency converter in the catalog. It uses the free ExchangeRate API (https://open.er-api.com) to show prices in USD, EUR, GBP, KZT or RUB. There is a loading message and an error message if the API doesn't work.
- Responsive layout with Bootstrap, Flexbox and Grid.
- Hover effects and small animations on buttons and cards.

## Technologies

HTML, CSS, JavaScript, Bootstrap 5, jQuery.

## Folders

- `css/` – styles (`base.css` has the shared styles and colors)
- `js/` – scripts (`theme.js`, `auth.js`, `validators.js`, `catalog-search.js`, `currency.js` and others)
- `images/` – pictures
- `data/` – `products.json` for the catalog

## How to run

You can just open the live site. To run it on your computer:

```bash
git clone https://github.com/ryam1i/WEB1-Front-End-Assignments.git
cd WEB1-Front-End-Assignments
python3 -m http.server 8000
```

Then open http://localhost:8000. You need internet for Bootstrap, jQuery and the API.
