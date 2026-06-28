# Aayush Patel | Full-Stack Developer Portfolio

Welcome to my personal portfolio repository! This is a modern, high-performance personal website designed to showcase my academic foundations, skills, and projects as a Full-Stack Developer. 

The site is built with a focus on visual excellence, fluid micro-animations, premium glassmorphism styling, and native-feeling mobile UX patterns.

## 🚀 Key Features

* **Bento Grid Education Dashboard**: An asymmetric, modern grid layout showcasing academic specializations, degrees, status badges, and interactive skill chips with back-glow hover highlights and year watermarks.
* **Dynamic Project Details Modal**: An elegant, spring-animated details modal that pulls rich project metadata (detailed descriptions, features lists, and tech rows) dynamically, locking background scrolling for focus.
* **Fullscreen Image Lightbox**: A dedicated zoom-in lightbox viewer for project screenshot mockups that opens with physics-based scaling transitions.
* **Browser Back-Button Support (History API)**: State integration using location hashes (`#view`) so that pressing the native browser back button or doing a mobile swipe-back gesture closes open modals/lightboxes rather than exiting the website.
* **Responsive Capsule Navigation Bar**: An vertical-padding optimized capsule header that follows the screen scroll and features a smart viewport scrollspy that underlines your current active section.
* **Interactive Contact Flow**: A functional contact form with input validation and built-in transitions.
* **Custom Cursor Glow**: A cursor-following background gradient glow effect that responds dynamically to mouse movement across the layout.

## 🛠️ Technology Stack

* **Structure**: Semantic HTML5 markup
* **Styling**: Vanilla CSS3 (Custom properties, grid systems, HSL color tokens, glassmorphic blur filters, custom scrollbars)
* **Logic**: Vanilla ES6+ JavaScript (IntersectionObserver, History state API, DOM manipulation)
* **Form handling**: Client-side validations

## 📂 Project Structure

```text
├── index.html         # Main page structure, project metadata cards, and modal shells
├── style.css          # Design system, layouts, responsive grids, modals, and keyframes
├── script.js           # Scrollspy tracking, typing simulation, history routing, and modal triggers
└── images/            # Assets, logos, profile picture, and project mockups
    ├── logo.png
    ├── profile.png
    ├── project-academic.png
    ├── project-pti.png
    └── project-shreeji.png
```

## 💻 Local Setup & Deployment

To run this project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aayushkpatel/aayushkpatel.github.io.git
   ```
2. **Launch a local server**:
   * Open the directory in **VS Code** and run via **Live Server**, or
   * Place the directory inside your **XAMPP** `htdocs` folder and load via `http://localhost/`.

## 📄 License

This repository is self-licensed. Feel free to explore the code for learning or adaptation.
