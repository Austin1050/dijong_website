# Dijong African Cuisine – Website Project

## Project Title
Dijong African Cuisine Website Development Project  
**Portfolio of Evidence (PoE) – Parts 1, 2 & 3**

---

## Student Information
- **Student Name:** Tokollo Austin Monama
- **Student Number:** ST10502017 
- **Module:** WEDE5020 – Web Development  
- **Live Deployment URL:** [https://dijong-african-cuisine.netlify.app](https://dijong-african-cuisine.netlify.app)

---

## Project Overview
Dijong African Cuisine is a South African restaurant based in Gauteng that specialises in authentic, 100% fire-cooked African food. The restaurant offers a range of carefully curated meals and catering packages (Standard and VIP) for individuals, families, events, and corporate clients.

This web application replaces the previous basic HTML structure with a dynamic, accessible, search-engine-optimized, and interactive online experience. The website allows customers to:
- View detailed catering packages and submit online event bookings.
- Explore food items dynamically loaded from JSON files.
- Filter and sort menu meals in real-time by price, name, and category.
- Manage an interactive shopping cart using `localStorage` and submit orders via WhatsApp.
- Submit client-side validated enquiries and contact messages with AJAX asynchronous processing.
- Locate restaurant branches using interactive Leaflet.js maps.
- Experience high-resolution image viewing via an interactive Lightbox gallery.

**Project Pages:**
- `index.html` (Home & Kitchen Staff)
- `about.html` (About Us, Vision, Mission)
- `services.html` (Catering Services & Event Types)
- `standardpackage.html` (Standard Catering Booking)
- `vippackage.html` (VIP Catering Booking)
- `orders.html` (Dynamic Food Menu, Search/Sort & Shopping Cart)
- `enquiries.html` (Custom Enquiries Form)
- `contact.html` (Contact Us, Mail Compilation & Interactive Maps)

---

## Website Goals and Objectives

### Primary Goals
- Enable easy online ordering of African meals and catering packages.
- Generate quality customer enquiries for custom events and bulk orders.
- Clearly showcase food menu categories and catering package options.
- Build trust and brand credibility through responsive styling, interactive elements, and authentic storytelling.
- Deliver optimal performance, accessibility (WCAG), and mobile responsiveness across all device viewports.

### Key Performance Indicators (KPIs)
- Number of completed orders placed via `orders.html` (tracked via WhatsApp CTA).
- Conversion rate from package pages to completed bookings.
- Number of validated form submissions on `contact.html` and `enquiries.html`.
- Page speed loading efficiency and zero broken dynamic asset fetches.
- Search engine indexation via `sitemap.xml` and `robots.txt`.

---

## Part 1 Details: Discovery & Proposals
Part 1 established the foundation for the project through research, structural planning, sitemap creation, timeline mapping, and two comprehensive budget proposals in South African Rands (ZAR):
- **Proposal 1:** Focus on direct package sales and online food ordering workflows.
- **Proposal 2:** Focus on event services, bulk catering packages, and custom client enquiries.

---

## Part 2 Details: UI Design, Responsiveness & Wireframes
Part 2 established the visual design system, CSS architecture, responsive layout structures, and low-fidelity wireframes across mobile and desktop breakpoints:
- Low-fidelity wireframes mapped layout hierarchy for all pages (`Part2/Wireframes/`).
- Centralized CSS stylesheet (`css_assets/style.css`) incorporating global resets, layout rules, typography stacks, and standard button components.
- Responsive breakpoints (`768px`, `480px`, and `≥1400px`) for mobile drawer navigation and card stacking.
- Hover states for product grids, hero image rotations, checkmark event lists, and validation styling (`:valid` / `:invalid`).

---

## Part 3 Details: Functionality, SEO & Deployment

Part 3 enhances the website into a fully functional, interactive web application incorporating client-side JavaScript, dynamic data processing, client-side validation, technical SEO, and automated deployment.

### 1. Interactive Elements & JavaScript Enhancements (`js_assets/main.js`)
* **Mobile Responsive Navigation Drawer:** Toggles navbar link visibility using accessible ARIA attributes (`aria-expanded`) and handles outside-click and `Escape` key closures.
* **Lightbox Image Gallery Modal:** Dynamic modal popup attached to product images allowing users to view high-resolution food images and captions in a dark overlay.
* **Interactive Leaflet Maps:** Integrated OpenStreetMap interactive maps using Leaflet.js on `contact.html` for both Pretoria West and Kwa-Thema Springs locations.
* **Scroll Reveal Animations:** Powered by `IntersectionObserver` to reveal content blocks as they scroll into view (`.reveal.in-view`).
* **Persistent Shopping Cart (`localStorage`):** Slide-out modal cart allowing users to increment, decrement, remove, and calculate total pricing for items. Order summaries can be sent directly to WhatsApp (`wa.me`).

### 2. Dynamic Content & Real-Time Filtering
* **Asynchronous Fetch API:** Loads food items dynamically from an external JSON data file (`data/menu.json`).
* **Real-time Search & Filter:** Includes an input search bar (with debouncing), category dropdown filter (Chicken, Beef, Pork, Full Plates, Sides, Platters), and multi-criteria sorting (Price: Low to High, Price: High to Low, Name: A–Z).

### 3. Form Functionality & Client-Side Validation
* **Custom JS Regex Validation:** Validates full names, valid email patterns, 10-digit telephone numbers, and enforces future-date restrictions on booking calendars.
* **Visual Error Feedback:** Dynamically injects `.field-error` text and applies red `.has-error` borders to invalid form fields.
* **AJAX Asynchronous Submission:** Submits form data asynchronously using `fetch()` without reloading the page.
* **Contact Mail Compilation (`contact.html`):** Compiles validated form fields into a pre-filled `mailto:` link addressing `dijongafricancuisine4002@gmail.com`.
* **Processed Enquiry Responses (`enquiries.html`):** Dynamically updates feedback messages depending on the enquiry type selected (e.g., Table Booking, Catering, Menu Question).

### 4. Search Engine Optimization (SEO) & Technical Setup
* **On-Page SEO:** Structured meta descriptions, OpenGraph tags, unique page titles, clean semantic HTML5 markup (`<header>`, `<main>`, `<section>`, `<footer>`), and descriptive `alt` tags on all images.
* **Technical SEO Files:** Added `robots.txt` and `sitemap.xml` in the root folder to guide search engine crawlers.
* **Performance:** Lazy loading (`loading="lazy"`) added to image assets to reduce initial load time.

---

## Timeline and Milestones
| Week   | Milestone                              | Deliverable                          | Status     |
|--------|----------------------------------------|--------------------------------------|------------|
| 1–2    | Discovery & Planning                   | Content audit, sitemap, wireframes   | Completed  |
| 3–4    | Design                                 | High-fidelity mockups + style guide  | Completed  |
| 5–8    | Development                            | All 8 pages built and linked         | Completed  |
| 9      | Interactive JS & Validation            | Dynamic menu, cart, forms & maps     | Completed  |
| 10–11  | SEO, Testing & Revisions               | Meta tags, sitemaps & cross-browser  | Completed  |
| 12     | Deployment & Go-Live                   | Netlify automated deployment         | Completed  |

---

## Directory & File Structure

```text
DIJONG-AFRICAN-CUISINE/
│
├── index.html                  # Homepage & Kitchen Staff Grid
├── about.html                  # Story, Vision & Mission Sections
├── orders.html                 # Dynamic Menu, Search/Sort, Shopping Cart
├── services.html               # Catering Overview & Event List
├── enquiries.html              # Custom Enquiry Form with Processed Feedback
├── contact.html                # Contact Information, Mailto Form & Leaflet Maps
├── standardpackage.html        # Standard Catering Booking Form
├── vippackage.html             # VIP Catering Booking Form
│
├── robots.txt                  # Search Engine Crawler Directives
├── sitemap.xml                 # XML Sitemap for Search Indexing
├── README.md                   # Project Documentation & References
│
├── css_assets/
│   └── style.css               # Global Master Stylesheet
│
├── js_assets/
│   └── main.js                 # Vanilla JavaScript Application Logic
│
├── data/
│   └── menu.json               # External JSON Data Source for Menu Items
│
└── _images/                    # Dish Photos, Logos, and Staff Images
Sitemap
text

Dijong African Cuisine Website
│
├── index.html                  (Home)
├── about.html                  (About Us)
├── services.html               (Services)
│   ├── standardpackage.html    (Standard Package Booking)
│   └── vippackage.html         (VIP Package Booking)
├── orders.html                 (Place an Order / Dynamic Menu)
├── enquiries.html              (Custom Enquiries)
└── contact.html                (Contact Us & Maps)

Changelog
[2026-08-15] – Part 1 Initial Submission
Created two complete Website Project Proposals in South African Rands (ZAR).
Defined website goals, target audience, KPIs, and project milestones.
Mapped out structural sitemap and initial page requirements.
[2026-09-18] – Part 2 UI Styling, Responsive CSS & Wireframes
Created low-fidelity wireframes (mobile + desktop) saved under Part2/Wireframes/.
Built global stylesheet (css_assets/style.css) with resets, typography, and button components.
Implemented sticky navigation bar, cart count badge, and mobile drawer toggle styles.
Styled hero sections, product grids, events checklist, forms, and footer.
Added media queries for 768px and 480px responsive breakpoints.
[2026-10-24] – Part 3 Functionality, SEO & Netlify Deployment
HTML Bug Fixes: Fixed duplicate element IDs (id="home", id="about") on about.html by replacing them with unique IDs (#vision, #mission, #about-details) to ensure valid DOM querying.
Dynamic Content Loading: Integrated data/menu.json and Fetch API on orders.html to dynamically render food cards.
Search & Filter: Added search bar, category dropdown, and sorting (Price / Name) to orders.html.
Interactive Lightbox: Implemented modal popup viewing for dish photos across product cards.
Leaflet Interactive Maps: Replaced static Google Map iframes on contact.html with interactive Leaflet.js map instances and custom markers.
Form Validation & AJAX: Built custom JavaScript client-side validation, error labels (.field-error), and asynchronous AJAX submission (httpbin.org/post) on contact.html, enquiries.html, and package booking forms.
Mail Compilation: Configured contact.html to automatically compile user submissions into a mailto: link for dijongafricancuisine4002@gmail.com.
Persistent Shopping Cart: Built a slide-out cart modal using localStorage (dijong_cart_v3) with item quantity adjustments and WhatsApp order integration.
SEO & Performance: Created robots.txt and sitemap.xml in the root folder, added <meta name="description"> tags, OpenGraph attributes, and lazy loading (loading="lazy").
Deployment: Deployed the project to Netlify at https://dijong-african-cuisine.netlify.app.
Deployment Instructions
This project is deployed and hosted on Netlify:

Root Directory Setup: All HTML files, robots.txt, sitemap.xml, css_assets/, js_assets/, data/, and _images/ are located in the main directory.
Netlify Deployment: The root folder is linked via Netlify drag-and-drop / Git integration.
Live Testing: Access https://dijong-african-cuisine.netlify.app to verify all page routing, dynamic fetching, form handling, and interactive Leaflet map renderings.
References (IIE Harvard Anglia Style)
Afrihost, 2025. Web hosting packages. [Online]. Available at: https://www.afrihost.com [Accessed 10 August 2026].

Agafonkin, V., 2024. Leaflet: an open-source JavaScript library for mobile-friendly interactive maps. [Online]. Available at: https://leafletjs.com/ [Accessed 18 May 2026].

Baymard Institute, 2023. E-commerce UX research. [Online]. Available at: https://baymard.com/research [Accessed 10 August 2026].

Httpbin, 2026. httpbin.org: HTTP Request & Response Service. [Online]. Available at: https://httpbin.org/ [Accessed 18 May 2026].

Mozilla Developer Network, 2026a. Fetch API. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API [Accessed 18 May 2026].

Mozilla Developer Network, 2026b. Intersection Observer API. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API [Accessed 18 May 2026].

Mozilla Developer Network, 2026c. Window.localStorage. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage [Accessed 18 May 2026].

OpenStreetMap contributors, 2026. OpenStreetMap. [Online]. Available at: https://www.openstreetmap.org/ [Accessed 18 May 2026].

W3Schools, 2025. HTML, CSS and JavaScript tutorials. [Online]. Available at: https://www.w3schools.com [Accessed 05 August 2026].

World Wide Web Consortium (W3C), 2023. Web Content Accessibility Guidelines (WCAG) 2.2. [Online]. Available at: https://www.w3.org/TR/WCAG22/ [Accessed 18 September 2026].

xneelo, 2024. South African web hosting. [Online]. Available at: https://xneelo.co.za [Accessed 09 August 2026].

End of README.md
