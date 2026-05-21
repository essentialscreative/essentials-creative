# Essentials Creative Portfolio Website

**Version 3.0 - Production Release**  
**Art with place and community**

## 🚀 Ready for Deployment

Production-ready website for Essentials Creative multimedia collective, featuring work by Indigenous, Latinx, and Asian artists across photography, design, video, projections, and installation art.

## ✅ Quick Start

```bash
# Install dependencies (optional, for development tools)
npm install

# Run local server
npm run serve
# Visit http://localhost:8000

# Deploy to Netlify
npm run deploy
```

## 📋 Documentation

### Core Documents
- **[PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md)** - Business requirements and specifications
- **[TESTING.md](TESTING.md)** - Comprehensive testing procedures
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and updates
- **[STYLE_GUIDE.md](STYLE_GUIDE.md)** - Design system and code standards

### Technical Guides
- **[STRUCTURE_MANIFEST.md](STRUCTURE_MANIFEST.md)** - File structure and dependencies
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre-deployment validation
- **[CODE_REVIEW_SUMMARY.md](CODE_REVIEW_SUMMARY.md)** - Recent improvements and optimizations

## 🎨 Tech Stack

- **Frontend**: HTML5, CSS3 (Custom Properties), Vanilla JavaScript ES6+
- **Hosting**: Netlify (Static Site)
- **Forms**: Formspree
- **Fonts**: Apercu (licensed)
- **Images**: WebP with JPEG fallbacks
- **Performance**: Lazy loading, optimized assets

## 📁 Project Structure

```
DEPLOY_TO_NETLIFY/
├── 📄 HTML Pages (21 files)
│   ├── index.html              # Homepage
│   ├── about.html              # About the collective
│   ├── contact.html            # Contact form
│   ├── photography.html        # Photography portfolio
│   ├── design.html            # Design portfolio
│   ├── video.html             # Video work
│   ├── installations.html     # Installation documentation
│   └── [project pages...]      # Individual projects
├── 📁 assets/
│   ├── css/ (14 files)        # Stylesheets
│   ├── js/ (16 files)         # JavaScript modules
│   ├── images/                # Image assets
│   └── fonts/                 # Typography
├── 📁 Documentation/
│   ├── PROJECT_REQUIREMENTS.md
│   ├── TESTING.md
│   ├── CHANGELOG.md
│   └── [other docs...]
└── ⚙️ Configuration/
    ├── netlify.toml           # Netlify config
    ├── package.json           # Dependencies
    ├── _redirects             # URL redirects
    └── _headers               # Security headers
```

## 🌐 Deployment Instructions

### Option 1: Drag & Drop
1. Log in to Netlify
2. Drag this entire DEPLOY_TO_NETLIFY folder to the Netlify dashboard
3. Site will be live in minutes!

### Option 2: Git Deployment
1. Push this folder to your Git repository
2. Connect the repository to Netlify
3. Set build settings (no build command needed - static site)
4. Deploy!

### Option 3: Netlify CLI
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Deploy from this folder
netlify deploy --dir=. --prod
```

## ✨ Features

- **Responsive Design**: Mobile-first approach
- **Portfolio Galleries**: Photography, Design, Video, Installations
- **Project Showcases**: Rhizomatic, Afterworld, Node, Plant Story Cards
- **Secure Contact Forms**: Honeypot protection, rate limiting
- **Performance Optimized**: Lazy loading, WebP images
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO Ready**: Meta tags, structured data, sitemap

## 🔧 Development

### Available Scripts
```bash
npm run serve          # Start local server
npm run lint           # Lint HTML, CSS, JS
npm run test           # Run test suite
npm run deploy         # Deploy to production
npm run deploy:preview # Deploy preview
```

### Performance Targets
- Lighthouse: 90+ Performance, 100 Accessibility
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Page Load: <3s on 3G connection

## 📞 Contact & Support

- **Website**: [essentialscreative.com](https://essentialscreative.com)
- **Instagram**: [@essentialscreative](https://instagram.com/essentialscreative)
- **Email**: essentialscreative@gmail.com
- **Locations**: Austin · San Antonio · London

## 📄 License

© 2026 Essentials Creative. All rights reserved.

---

**Status**: Production Ready v3.0  
**Last Updated**: May 14, 2026  
**Maintained by**: Essentials Creative Development Team