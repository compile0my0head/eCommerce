# E-Commerce Platform

A production-focused Angular 18 e-commerce application with authentication, product browsing, cart and wishlist management, profile pages, and order checkout flows.

## Overview

This project is built with Angular 18 and follows a feature-based structure with standalone components, route guards, HTTP interceptors, and lazy-loaded routes. It is designed to be deployed to GitHub Pages and uses a production build base href of `/eCommerce/`.

## Key Features

- Authentication with login, registration, forgot password, verify code, and reset password flows
- Protected routes for cart, wishlist, profile, and orders
- Product browsing with category and product detail views
- Cart and wishlist management
- Checkout and order placement flow
- Loading state and request header interceptors
- Responsive UI built with Angular and SCSS

## Tech Stack

- Angular 18
- TypeScript
- RxJS
- SCSS
- Angular Router
- Angular HTTP Interceptors
- ngx-spinner
- ngx-owl-carousel-o
- SweetAlert2

## Project Structure

- `src/app/core` - guards, interceptors, services, interfaces, and shared logic
- `src/app/features` - feature modules and route entries for the main screens
- `src/app/layout` - shell, navbar, and footer
- `src/app/shared` - reusable UI pieces

## Requirements

- Node.js 20 or newer is recommended
- npm

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open:

```text
http://localhost:4200/
```

## Build

Create a production build:

```bash
npm run build:prod
```

The production output is written to `dist/e-commerce/browser`.

## Deploy to GitHub Pages

This repository includes an automated workflow in `.github/workflows/deploy.yml` that builds and publishes the app when changes are pushed to `main`.

Manual deployment is also available:

```bash
npm run deploy
```

## GitHub Pages Configuration

To confirm GitHub Pages is configured correctly:

1. Open your repository on GitHub.
2. Go to `Settings`.
3. Select `Pages` from the left sidebar.
4. Under `Build and deployment`, check the `Source` setting.
5. If you use the workflow in this repo, the source should be set to `GitHub Actions`.
6. If you use the older branch-based setup, the source should be `Deploy from a branch`.
7. If using the branch-based setup, confirm:
   - Branch is `gh-pages`
   - Folder is `/ (root)`
8. Save any changes, then wait for the latest workflow run or deployment to finish.
9. Open the Pages URL and verify the updated content is live.

If the site still does not update, check the `Actions` tab for the latest workflow run and confirm it completed successfully.

## Development Notes

- The app uses route guards to protect authenticated routes.
- HTTP interceptors attach auth headers and handle expired or unauthorized requests.
- The production build uses the correct base href for GitHub Pages hosting under `/eCommerce/`.

## Angular CLI

For additional Angular CLI help, run:

```bash
ng help
```
