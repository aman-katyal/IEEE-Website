# Purdue IEEE — Content Editor Guide (Sanity CMS)

This guide is for Purdue IEEE officers, committee chairs, and webmasters who need to update website content without writing code. We use **Sanity.io**, a flexible headless CMS, to power all dynamic content across the site.

---

## 🔑 Accessing the Studio

Access the live Sanity Studio in your web browser:
👉 **[https://purdue-ieee-website.sanity.studio/](https://purdue-ieee-website.sanity.studio/)**

*Note: You must be granted access with your Purdue Google or GitHub account by the Webmaster or Branch President.*

---

## 🏠 1. Home Page (`Home Page`)

In the sidebar, click **Home Page**. Content is grouped into 3 clean tabs:

### 🌟 Hero Section (`Hero Section` Tab)
- **Hero Title & Subtitle:** The main mission statement and tagline rendered in the hero bento block.
- **Hero Image:** High-resolution photo displayed alongside the hero text. Hotspot cropping is enabled.
- **Where Our Engineers Go (Companies / Employers):**
  - Add, reorder, or remove destination company cards.
  - **Company Name:** (e.g. `SpaceX`, `Apple`, `Tesla`, `Texas Instruments`).
  - **Domain:** Clean domain name for automatic logo lookup (e.g. `spacex.com`, `apple.com`).
  - **Focus / Industry:** (e.g. `Aerospace`, `Silicon & HW`, `Semiconductors`).
  - **Careers URL:** Direct link to the company's job or university recruiting portal.
- **Alumni Card Tagline:** The descriptive badge text (e.g. *"Top Tech, Aerospace & Semiconductor Destinations"*).

### ℹ️ About Section (`About Section` Tab)
- **About Title:** The headline in the bottom-right "Who We Are" bento tile (e.g. *"Student Organization of the Year"*).
- **About Content:** Paragraph describing Purdue IEEE's mission, community, and scope.

### 📊 Statistics (`Statistics` Tab)
- Add or edit stat counter cards shown in the cycling stat tile (e.g. `10+ Committees`, `400+ Members`, `$80K+ Hardware Budget`).

---

## 📖 2. About Page (`About Page`)

In the sidebar, click **About Page**:

- **Heritage Quote:**
  - **Quote Text:** Quotation from history or leadership.
  - **Quote Author:** Author name (e.g. Thomas Edison, historic branch founder).
  - **Author Title:** Context/title for author.
- **Historical Lineage & Milestones (`Timeline`):**
  - **Year / Period:** e.g. `1903`, `1963`, `2024`.
  - **Milestone Title:** e.g. `Branch Founding`, `First Autonomous Aerial Vehicle`.
  - **Category Tag:** e.g. `Founding`, `Milestone`, `National Award`.
  - **Description:** Story or paragraph explaining the milestone.
  - **Gold Accent Highlight:** Checkbox to emphasize banner moments with gold cyber-styling.
- **Page Sections:**
  - Structured alternating content blocks with custom layouts, themes, and image focal points.

---

## 🛠️ 3. Technical Committees (`Committees`)

In the sidebar, click **Committees**:

### General Info
- **ID (URL Slug):** Lowercase unique slug (e.g. `rov`, `aerial-robotics`, `racing`, `software-saturdays`). Determines `/committee/<slug>`.
- **Full Name:** e.g. `Remotely Operated Vehicles`.
- **Short Name:** e.g. `ROV`.
- **Tagline:** Punchy 1-sentence summary for hero badges.
- **Short Description:** Concise description for directory cards.
- **Long Description:** In-depth technical overview (supports Markdown formatting).
- **Meeting Schedule:** Day of week, time (e.g. `6:30 PM - 7:30 PM`), location (e.g. `EE 129`), frequency, and notes.

### Media & Content
- **Hero Image:** Committee hero workspace/competition photo.
- **Key Metrics:** Fast stats on team scale, hardware, or achievements.
- **Tags:** Technical skill keywords (e.g. `Computer Vision`, `PCB Design`, `ROS 2`, `Carbon Fiber`).
- **Join Configuration:** Custom call-to-action button (links to `/join`, custom Google Form, or modal message).

### Dynamic Page Sections
Committees support modular block layouts:
- **Text Content:** Subteams, curriculum, or technical specs.
- **Projects Grid:** Project showcase cards with photos, summaries, and deep write-up modals.
- **FAQ Accordion:** Frequently asked questions.
- **Image Gallery:** Team and competition photo galleries.

### Contact & Social
- **Chair (Officer):** Direct reference dropdown to the committee chair's **Officer** profile.
- **Contact Email:** Committee email address.
- **Social Links:** GitHub, Instagram, Discord, LinkedIn, YouTube links.

---

## 🧩 4. Cornerstone Committees (`Cornerstone Committees`)

Manages operational & specialized committees (e.g. *Learning Community*, *Social Committee*):
- **Name & Slug**
- **Description**
- **Committee Leads:** Direct references to officer profiles or custom lead names and bios.

---

## 👥 5. Officers & Hierarchy (`Officers` & `Officers Config`)

### Adding / Editing an Officer (`Officers`)
- **Full Name & Role:** e.g. `Jane Doe`, `President`.
- **Category:** **CRITICAL.** Select functional tier:
  - `Executive Committee`
  - `Technical Committee Chairs`
  - `Operational Leads`
  - `Member Involvement`
- **Officer Image:** High-resolution headshot.
- **Email:** Purdue or IEEE email address.
- **Committees:** (Optional) Comma-separated list of affiliated committees.

### Reordering Officers on the Page (`Officers Config`)
- Open **Officers Config** in the sidebar.
- Simply **drag and drop** names within each category to change the display order on `/officers`.
- Click **Publish** to instantly apply the new order.

---

## ⏰ 6. Officer Office Hours (`Officer Office Hours`)

Manage weekly officer office hours displayed on `/officers`:
- **Officer Name & Role**
- **Day of the Week** (Monday – Friday)
- **Start Time & End Time** (e.g. `2:00 PM` – `4:00 PM`)
- **Location** (e.g. `BHEE 014 (IEEE Office)`)
- **Contact Email & Notes**

---

## 🤝 7. Corporate Partners (`Partners`)

When onboarding sponsors for the academic year:
- **Company Name:** e.g. `Texas Instruments`.
- **Domain:** e.g. `ti.com` (used for automated high-res Clearbit logo resolution).
- **Website URL:** Official homepage or university relations page.
- **Tier:** `Gold`, `Silver`, or `Bronze`.
- **Logo Override:** Optional manual PNG/SVG logo upload.
- **Sort Order:** Numerical priority within tier.

---

## ⚙️ 8. Global Site Settings (`Site Settings`)

Click **Site Settings** in the sidebar:

### 💼 Partners Settings (`Partners` Tab)
- **Hide Partners Directory (Production / Pre-Season):** Master toggle. When ON (default), hides partner logos across the website during pre-season when active sponsorships are being renewed.
- **Industrial Relations Contact Email:** The direct IR email (e.g. `industry@purdueieee.org` or `ir@purdueieee.org`) used for all *"Become a Partner"* and *"Contact IR"* buttons.
- **Show Corporate Tiers Breakdown:** Toggle between a unified directory grid vs. tiered Gold/Silver/Bronze breakdown.
- **Partners Prospectus PDF:** Upload the annual corporate partnership prospectus PDF.
- **Partners Hero Title & Subtitle:** Customizable header copy.

### 📅 Calendar Settings (`Calendar` Tab)
- **Google Calendar ID:** Public calendar ID for event subscriptions:
  `7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1@group.calendar.google.com`
- **Google Calendar Embed URL:** Full iframe embed URL for the calendar view.

### 📜 Legal & Governance (`Legal & Governance` Tab)
- **Branch Constitution:** Upload the official Branch Constitution PDF.
- **Committee Bylaws:** Upload individual technical committee bylaws.

### 💳 General & Dues (`General & Dues` Tab)
- **Discord URL:** Purdue IEEE Discord server invite link.
- **Payment URL:** Purdue TooCOOL / BOSOP membership dues payment portal.
- **Dues Description, Options & Benefits:** Membership cost options and perks rendered on `/join`.

### 🌐 Social Links & Homepage CTA
- **Social Links:** Global footer and header social media channels.
- **Homepage CTA Benefits:** Bullet points rendered in the *"Ready to Build Something Real?"* section on the homepage.

---

## 🚀 Publishing Workflow

1. Make edits to any document in Sanity Studio.
2. Review the live preview or field indicators.
3. Click the green **Publish** button at the bottom right.
4. Updates propagate instantly across the live website!
