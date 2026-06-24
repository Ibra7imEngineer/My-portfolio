# ENG.IM Portfolio - Technical Guidelines & Maintenance

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Key Technologies](#key-technologies)
4. [Development Workflow](#development-workflow)
5. [Maintenance Checklist](#maintenance-checklist)
6. [Performance Tips](#performance-tips)
7. [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

### **Single Page Application (SPA)**

- Client-side rendering with vanilla JavaScript
- No external frameworks (lightweight approach)
- State management via global `portfolioState` object
- Dynamic UI updates without page reload

### **Progressive Web App (PWA)**

- Service Worker handles offline functionality
- Manifest enables app installation
- Responsive design works on all devices
- Can be installed on home screen

### **Data Persistence**

- **Primary**: localStorage (5-50MB depending on browser)
- **Remote**: Google Sheets Web App (optional sync)
- **Session**: sessionStorage (temporary storage)

## 📁 File Structure

```
portfolio/
├── index.html          # Main application (all-in-one file)
├── style.css           # Optional external CSS
├── sw.js               # Service Worker (offline support)
├── manifest.json       # PWA configuration
├── robots.txt          # SEO & crawler rules
├── sitemap.xml         # URL index for search engines
├── .htaccess           # Apache server configuration
├── README.md           # Project documentation
├── GUIDELINES.md       # This file
├── images/
│   ├── profile.jpg     # Profile picture
│   └── profil1.jpg     # Alternate image
└── cv/                 # CV PDF files
    └── (PDF files here)
```

## 🛠️ Key Technologies

| Technology             | Purpose                 | Version      |
| ---------------------- | ----------------------- | ------------ |
| **HTML5**              | Markup & structure      | ES2020       |
| **CSS3**               | Styling & animations    | Latest       |
| **JavaScript**         | Application logic       | ES6+         |
| **Service Worker API** | Offline support         | W3C Standard |
| **LocalStorage API**   | Client data persistence | HTML5        |
| **Fetch API**          | Network requests        | ES2015       |
| **Web App Manifest**   | PWA configuration       | W3C          |

## 🚀 Development Workflow

### **Local Development**

```bash
# Start local server (Python 3)
python -m http.server 8000

# Or using Node
npm install -g http-server
http-server

# Open browser
open http://localhost:8000
```

### **Testing**

1. **Desktop**: Chrome DevTools (F12)
   - Lighthouse for PWA audit
   - Network tab for caching
   - Performance tab for metrics

2. **Mobile**:
   - Use Chrome DevTools Remote Debugging
   - Test on actual device if possible
   - Check offline functionality

3. **PWA Installation**:
   - Must be HTTPS (or localhost)
   - Service Worker must register successfully
   - Manifest must be valid

### **Code Changes**

#### **Adding New Sections**

1. Add HTML in `<main class="main-content">`
2. Add CSS styling in `<style>` section
3. Add render function: `function renderNewSection() { ... }`
4. Call from `renderAll()`
5. Update navigation links

#### **Modifying Profile Data**

1. Locate `defaultData` object in script
2. Update nested properties
3. Update `getState()` function if needed
4. Test localStorage sync

#### **Adding Admin Features**

1. Add form in admin panel HTML
2. Create state updater function
3. Add save/delete handlers
4. Update `setState()` calls
5. Test with refresh

## ✅ Maintenance Checklist

### **Monthly**

- [ ] Review Google Analytics (if integrated)
- [ ] Check broken links (use web crawler)
- [ ] Update resume/CV if needed
- [ ] Verify all social links work

### **Quarterly**

- [ ] Update dependencies (Font Awesome, Google Fonts)
- [ ] Review performance metrics
- [ ] Test offline functionality
- [ ] Check mobile responsiveness on new devices
- [ ] Update sitemap.xml with latest projects

### **Annually**

- [ ] Full security audit
- [ ] Update SSL certificate (if HTTPS)
- [ ] Review and update portfolio projects
- [ ] Check PWA installation process
- [ ] Test all browsers and devices
- [ ] Update copyright year

### **Before Deployment**

- [ ] Test all forms and buttons
- [ ] Verify links (especially external ones)
- [ ] Check console for JavaScript errors
- [ ] Test offline mode (DevTools → Offline)
- [ ] Validate HTML/CSS (W3C Validators)
- [ ] Run Lighthouse audit
- [ ] Test on mobile devices

## ⚡ Performance Tips

### **Optimization Strategies**

1. **Image Optimization**
   - Use WebP format with JPEG fallback
   - Compress images with TinyPNG
   - Implement lazy loading for images

2. **Code Optimization**
   - Minify CSS and JavaScript
   - Remove unused CSS
   - Defer non-critical JavaScript loading

3. **Caching Strategy**
   - Cache static assets (1 year)
   - Cache HTML (1 day)
   - Use ETags for cache validation

4. **Network Optimization**
   - Enable GZIP compression
   - Use CDN for static assets
   - Minimize third-party scripts

### **Monitoring**

```javascript
// Built-in performance tracking
perfMonitor.mark("section-render-start");
renderProjects();
perfMonitor.measure("project-render", "section-render-start");
```

## 🐛 Troubleshooting

### **Service Worker Issues**

**Problem**: Service Worker not registering

```javascript
// Check browser console
// Verify sw.js exists and is accessible
// Ensure HTTPS or localhost
// Clear Application > Storage > Unregister Service Workers
```

### **PWA Won't Install**

- Must use HTTPS (except localhost)
- Check manifest.json is valid JSON
- Verify icons are accessible
- Check display property in manifest

### **Data Not Syncing**

- Check localStorage quota (DevTools → Application)
- Verify JSON is valid
- Check if key is correctly named
- Review browser's storage quota

### **Offline Issues**

- Check Service Worker active status
- Verify fetch events are being cached
- Test with DevTools Offline mode
- Check Network tab for failed requests

### **Performance Slow**

- Check Network tab for large assets
- Monitor CPU usage in Performance tab
- Use Lighthouse for suggestions
- Review animation frame rates

## 📞 Support & Contact

**For questions or issues:**

- Email: ibra7im.engineer@gmail.com
- Update this file as you discover solutions

## 🔄 Version History

| Version | Date       | Changes                      |
| ------- | ---------- | ---------------------------- |
| 1.0.0   | 2026-06-12 | Initial professional release |
|         |            | PWA support                  |
|         |            | Admin panel                  |
|         |            | SEO optimization             |
|         |            | Accessibility compliance     |

---

**Last Updated**: June 12, 2026
**Maintained by**: Ibrahim Muhamad
