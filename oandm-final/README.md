# O&M Professionals — Website

A complete multi-page business website for O&M Professionals.
Dark/sleek design with gold accents. No frameworks required — pure HTML, CSS, and JavaScript.

---

## 📁 FILE STRUCTURE

```
oandm-professionals/
├── index.html          ← Home page (hero slider)
├── about.html          ← About Us page
├── services.html       ← Services page
├── projects.html       ← Featured Projects page
├── careers.html        ← Public job listings
├── admin.html          ← Password-protected admin panel
├── contact.html        ← Contact form
│
├── css/
│   ├── style.css       ← Main stylesheet (shared across all pages)
│   ├── careers.css     ← Careers page + job card + modal styles
│   └── admin.css       ← Admin dashboard styles
│
├── js/
│   ├── main.js         ← Nav, slider, file upload, scroll animations
│   ├── jobs.js         ← Job data (localStorage), careers render, apply modal
│   └── admin.js        ← Admin login, post job form, delete/status controls
│
├── images/
│   └── PLACE_IMAGES_HERE.txt   ← Drop all your images in this folder
│
└── README.md           ← This file
```

---

## 🚀 HOW TO PREVIEW LOCALLY

**Option A — Double-click (quick look):**
Unzip the folder and double-click `index.html`.
Note: Some browsers block local file access for JS — use Option B for full functionality.

**Option B — VS Code Live Server (recommended):**
1. Install VS Code: https://code.visualstudio.com
2. Install the "Live Server" extension (by Ritwick Dey)
3. Open the project folder in VS Code
4. Right-click `index.html` → "Open with Live Server"
5. Your browser will open at `http://127.0.0.1:5500`

---

## 🌐 HOW TO PUBLISH (GitHub Pages — FREE)

1. Create a free account at https://github.com
2. Click "New Repository" — name it anything (e.g. `oandm-site`)
3. Upload all files (drag & drop in the GitHub UI, or use GitHub Desktop)
4. Go to: Repository → Settings → Pages
5. Under "Branch", select `main` and folder `/root`, then click Save
6. Your site will be live at: `https://yourusername.github.io/oandm-site`
   (takes 1–2 minutes to go live)

**Custom domain (optional):**
- In Pages settings, enter your domain under "Custom domain"
- Point your domain's DNS A records to GitHub's IPs (they'll show you the IPs)

---

## 🖼️ ADDING IMAGES

All images go in the `images/` folder.

### Hero Slider (Home page)
| Filename     | Size        | Used for        |
|--------------|-------------|-----------------|
| slide1.jpg   | 1920×1080px | Slide 1         |
| slide2.jpg   | 1920×1080px | Slide 2         |
| slide3.jpg   | 1920×1080px | Slide 3         |

### About Page
| Filename   | Size      |
|------------|-----------|
| about.jpg  | 800×1000px (portrait) |

### Project Cards (projects.html)
Each project supports **multiple images** that auto-slide and are swipeable.
Name them like this:

| Project | Filenames                              |
|---------|----------------------------------------|
| Project 1 | project1a.jpg, project1b.jpg, project1c.jpg |
| Project 2 | project2a.jpg, project2b.jpg           |
| Project 3 | project3a.jpg, project3b.jpg, project3c.jpg |
| Project 4 | project4a.jpg, project4b.jpg           |
| Project 5 | project5a.jpg, project5b.jpg, project5c.jpg |
| Project 6 | project6a.jpg, project6b.jpg           |

You can add or remove images per project — just add more letters (project1d.jpg, etc.)
and update the `imgs` array in `projects.html` (see EDITING PROJECTS below).

**Recommended image sizes:** 1200×675px (16:9 ratio) for project cards.
**Accepted formats:** JPG, PNG, WebP

If an image is missing, the card will show a placeholder number — the site won't break.

---

## ✏️ EDITING CONTENT

### Change Company Name / Contact Info
- Open each `.html` file and find the text to change
- Contact details are in `contact.html` inside the `.contact-info` section
- Update email, phone, and location as needed

### Edit the Hero Slider (index.html)
Find the three `<div class="slide">` blocks. Each has:
- An eyebrow label (small text above the heading)
- A heading (`<h1>`)
- A subtitle paragraph
- Two buttons

### Edit Services (services.html)
Find the three `.service-card` divs. Edit the `<h3>` title, `<p>` description,
and `<li>` bullet points inside each card.

### Edit Projects (projects.html)
Open `projects.html` and scroll to the `var PROJECTS = [...]` array in the `<script>` tag.
Each project has:

```javascript
{
  id: 1,
  tag: 'Consulting',           // Category tag shown on card
  title: 'Your Project Title',
  full: 'Full description shown when Read More is clicked. Can be as long as you want.',
  imgs: ['project1a.jpg', 'project1b.jpg']  // Images in /images/ folder
}
```

Just edit the text values. To add more images to a project, add more filenames to the `imgs` array.

### Edit About Page (about.html)
- Edit the stats (200+, 50+, etc.) by finding `.stat-num` elements
- Edit the "15+ Years" badge by finding `.about-badge`
- Edit the body text paragraphs inside the `.about-grid` section
- Edit the three values cards (Integrity, Excellence, Partnership) in `.values-section`

---

## 💼 CAREERS & ADMIN SYSTEM

### How it works
- Jobs are stored in the visitor's browser using `localStorage`
- This means jobs persist on the same device/browser between visits
- To share jobs across devices/users, you would need a backend database (see GOING FURTHER)

### Admin Panel
- URL: `yoursite.com/admin.html`
- Default password: `admin123`

**⚠️ IMPORTANT: Change the password before going live!**
Open `js/jobs.js` and change line 8:
```javascript
const ADMIN_PASSWORD = 'your-new-password-here';
```

### From the Admin Panel you can:
- **Post a new job** — fill in title, location, type, salary, department, description
- **Change job status** — dropdown on each job: 🟢 Open / 🟡 Position Filled / 🔴 Closed
  - Open → shows Apply Now button on careers page
  - Position Filled / Closed → job still shows but is dimmed, no Apply button
- **Delete a job** — click Remove (permanent, cannot undo)

### Job Status Behaviour (careers.html)
| Status         | Shown on page | Apply button | Card appearance |
|----------------|--------------|--------------|-----------------|
| 🟢 Open        | Yes          | Yes          | Normal          |
| 🟡 Filled      | Yes          | No           | Dimmed          |
| 🔴 Closed      | Yes          | No           | Dimmed          |

---

## 📧 CONNECTING THE CONTACT FORM

Currently the contact form shows a success message but doesn't actually send an email.
To make it send real emails, use **Formspree** (free up to 50 submissions/month):

1. Go to https://formspree.io and create a free account
2. Create a new form — you'll get a URL like `https://formspree.io/f/xyzabc`
3. Open `js/main.js` and find the comment that says:
   `// TO CONNECT A REAL BACKEND`
4. Replace the success simulation with:
```javascript
const formData = new FormData(contactForm);
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  body: formData,
  headers: { 'Accept': 'application/json' }
}).then(r => {
  if (r.ok) { contactForm.style.display='none'; formSuccess.classList.add('show'); }
  else { alert('Something went wrong. Please try again.'); }
});
```

The same approach works for the **Apply Now** form in `js/jobs.js`.

---

## 🎨 CUSTOMIZING COLOURS & FONTS

Open `css/style.css` — at the very top you'll find the CSS variables:

```css
:root {
  --bg:      #0a0a0b;   /* Main background (near black) */
  --bg2:     #111114;   /* Slightly lighter background */
  --bg3:     #16161a;   /* Card backgrounds */
  --bg4:     #1c1c22;   /* Hover states */
  --accent:  #c8a84b;   /* Gold accent colour */
  --accent2: #e8c86a;   /* Lighter gold (hover states) */
  --text:    #f0ede8;   /* Main text colour */
  --muted:   #7a7875;   /* Muted/secondary text */
}
```

Change `--accent` and `--accent2` to use a different brand colour.
Change `--bg` for a different dark tone (or switch to light mode with `#ffffff`).

**Fonts** are loaded from Google Fonts in each HTML `<head>`:
- Headings: `Bebas Neue`
- Body: `Outfit`

To change fonts, update the Google Fonts `<link>` and the `font-family` in `:root`.

---

## 📱 MOBILE / RESPONSIVE

The site is fully responsive:
- **Desktop** (1180px+): Full layout, 3-column grids
- **Tablet** (640–900px): 2-column grids
- **Mobile** (<640px): Single column, hamburger menu, touch-swipe on sliders

---

## 🔒 ADMIN SECURITY NOTE

The admin panel password is stored in plain text in `js/jobs.js`.
This is fine for a simple site, but note:
- Anyone who downloads/views your JS source files can see the password
- For a more secure setup, use a backend login system (Node.js, PHP, etc.)
- At minimum, use a strong unique password and don't reuse it elsewhere

---

## 🚧 GOING FURTHER (Optional Upgrades)

| Feature | Tool |
|---------|------|
| Real contact form emails | Formspree (free) or EmailJS |
| Jobs stored in database (cross-device) | Supabase (free tier) + a few lines of JS |
| Custom domain | Namecheap / Google Domains + GitHub Pages custom domain |
| Analytics | Google Analytics or Plausible |
| CMS for non-technical editing | Netlify CMS or Tina CMS (both free) |
| Faster hosting | Netlify or Vercel (both have free tiers, faster than GitHub Pages) |

---

## 💬 QUICK REFERENCE

| Task | Where |
|------|-------|
| Change admin password | `js/jobs.js` line 8 |
| Edit project writeups & images | `projects.html` → `var PROJECTS` array |
| Edit contact info | `contact.html` → `.contact-info` section |
| Change brand colours | `css/style.css` → `:root` block |
| Add/remove nav links | Every `.html` file → `<ul class="nav-links">` |
| Post a job | Go to `admin.html` on your live site |
| Change job status | Admin panel → status dropdown on each job |

---

Built with ♥ for O&M Professionals.
