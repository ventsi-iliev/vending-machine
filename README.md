# Vending machine

Responsive vending-machine exercise built with React, Jotai, TypeScript, Express,
and an in-memory mocked products API.

## Requirements

- Docker with Docker Compose (recommended)

For running without Docker:

- Node.js 22.13 or newer
- npm

## Run with Docker

Build and start the frontend and backend together:

```sh
docker compose up --build
```

Open http://localhost:5173. Stop both services with `Ctrl+C`, or run
`docker compose down` if they were started in the background.

## Run without Docker

Install and start the mocked API:

```sh
cd backend
npm install
npm run dev
```

In a second terminal, install and start the web application:

```sh
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The API runs at http://localhost:3000.

## Production build

```sh
cd backend
npm run build
npm start
```

In another terminal:

```sh
cd frontend
npm run build
npm run preview
```

Run the frontend linter with `npm run lint` from the `frontend` directory.

## Currency and accepted coins

The machine supports EUR and USD and accepts only the coin buttons displayed in
the payment panel:

- EUR: 0.01, 0.02, 0.05, 0.10, 0.20, 0.50, 1, and 2
- USD: 0.01, 0.05, 0.10, 0.25, 0.50, and 1

The static demo conversion rate is 1 EUR = 1.1664 USD. Money calculations are
rounded to two decimal places. A purchase returns the amount inserted above the
product price as change. Reset returns all inserted coins without purchasing.

## Implementation notes

- `GET /products?currency=EUR|USD` is the mocked external resource used for the
  initial product list. Unsupported currencies receive HTTP 400.
- The mocked catalog contains at most 15 units of each product.
- Product create, read, update, delete, and vending stock changes happen only in
  the frontend application state. Refreshing requests fresh randomized mock data.
- Currency cannot be changed while coins are inserted; reset first to return
  them.
