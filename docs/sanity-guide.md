# Content Editor Guide (Sanity CMS)

This guide is for Purdue IEEE officers and members who need to update the website's content without touching the code. We use **Sanity.io**, a flexible Headless CMS, to manage our data.

## 🔑 Accessing the Studio

You can access the administrative interface at:
**[https://purdue-ieee-website.sanity.studio/](https://purdue-ieee-website.sanity.studio/)**

*Note: You will need to be added to the project by a Webmaster or the Branch President using your email address.*

---

## 🏗️ Managing Committees

The Technical Committees are the heart of our website. Each committee has its own dedicated page (`/committee/<slug>`).

### 1. Updating Basic Info
- Select **Committee** from the sidebar.
- Choose the committee you wish to edit.
- **Tagline:** A short, punchy sentence appearing in the hero section.
- **Description:** The short paragraph shown on the main list page.
- **Long Description:** The detailed "About" text on the individual committee page. Supports **Markdown** for bolding and lists.
- **Chair (Officer):** **Reference Field.** Choose the chair directly from the dropdown of existing **Officer** documents. Their contact details will automatically propagate to the frontend.

### 2. Custom Sections (Dynamic Layout)
We use a block system for committee pages. You can add, remove, and reorder these sections:
- **Text Sections:** Standard paragraphs with optional images. Use this for "Subteams", "Mission", or "History" statements.
- **Project Sections:** A grid of cards for specific projects. Each item needs a name, description, and optional image. Mark flagship projects with `flagship: true`.
- **FAQ Sections:** A list of questions and answers.
- **Gallery Sections:** A collection of photos from the committee's history.

---

## 👥 Managing Officers

The Officers page is split into functional categories based on our Constitution.

### 1. Adding/Editing an Officer
- Select **Officer** from the sidebar.
- **Full Name & Role:** Ensure the role matches the official title (e.g., "President", "Treasurer", "ROV Chair").
- **Category:** **CRITICAL.** Select the functional area (Executive, Technical, Operations, or Member Involvement). This determines where they appear on the page.
- **Officer Image:** Use a high-quality headshot. Sanity will automatically handle cropping and optimization.

### 2. Changing the Display Order
We use a drag-and-drop system for ordering:
- Select **Officers Configuration** from the sidebar.
- This document contains four lists (one for each category).
- To change the order, simply **drag and drop** the officer names within their respective list.
- Click **Publish** to save the new order.

---

## 🤝 Corporate Partners & Sponsors

Manage all corporate sponsors and industry partners in one centralized place.

### 1. Adding/Editing a Partner
- Select **Partner** from the sidebar.
- **Name:** Official company name (e.g., "Texas Instruments", "Qualcomm").
- **Domain:** Company domain without protocols (e.g., `ti.com`). Used for automatic logo fetching and fallback links.
- **Website URL:** Full URL (e.g., `https://www.ti.com/`).
- **Tier:** Select `Gold`, `Silver`, or `Bronze`.
- **Logo:** Upload a high-resolution transparent PNG/SVG logo.
- **Order:** Integer defining display priority.

> [!NOTE]
> Partners published here automatically sync across both the **Home page TechMarquee** and the **Partners page** (`/partners`).

---

## ⚙️ Global Site Settings

Site-wide parameters are configured under **Global Site Settings** in the Sanity Studio sidebar.

### 1. 📅 Calendar & Events
- **Google Calendar ID:** The public Google Calendar address:
  ```text
  7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1@group.calendar.google.com
  ```
  *(Used to generate direct subscribe links and sync live events on the Home and Calendar pages).*
- **Google Calendar Embed URL:** The full embed URL:
  ```text
  https://calendar.google.com/calendar/embed?src=7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1%40group.calendar.google.com&ctz=America%2FIndiana%2FIndianapolis
  ```

### 2. 💼 Partners Page Configuration
- **Show Corporate Tiers Section:** Boolean toggle (`true` / `false`). When `false` (default), the Partners page displays a clean, unified sponsor directory grid. When `true`, it breaks sponsors down into Gold, Silver, and Bronze tier sections.
- **Partners Prospectus PDF:** Upload the current annual Industrial Relations sponsorship prospectus PDF to enable the download button on `/partners`.
- **Hero Title & Subtitle:** Customizable header copy for the Partners page.

### 3. 📜 Legal & Governance
- **Branch Constitution:** Upload the current Purdue IEEE Constitution PDF and description.
- **Committee Bylaws:** Upload individual Technical Committee bylaws PDFs.

### 4. 💳 General & Dues
- **Discord Invite URL:** Official community invite link.
- **TooCool Payment URL:** Link for online membership dues payment.
- **Dues Options & Benefits:** Customizable membership price points and benefit bullet points shown on the Join page (`/join`).

---

## 🚀 Publishing Changes

1. Make your edits in any document.
2. Observe the status in the bottom right corner (e.g., "Draft", "Edited").
3. Click the big green **Publish** button.
4. Your changes will be live on the website within seconds!

## 💡 Pro-Tips
- **Markdown Support:** Many text fields support Markdown. Use `**text**` for bold and `*text*` for italics.
- **Image Focal Points:** Click "Edit" on an image to set a focal point. This ensures the important part of the photo isn't cropped out on mobile.
- **Keyboard Shortcuts:** `Ctrl + S` (or `Cmd + S`) will save a draft immediately.
