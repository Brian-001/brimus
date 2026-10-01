# Brimus Consultancy Ltd - Website

> A production-ready, ultra-modern website for Brimus Consultancy Ltd – a leading Kenyan consulting firm.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** v4
- **Framer Motion** (animations & page transitions)
- **shadcn/ui** + Radix UI primitives
- **Lucide React** icons
- **Inter** font via next/font
- **next-themes** (dark/light mode)
- **React Hook Form + Zod** (form validation)

## Features

- 🎨 Ultra-modern, premium design with deep navy (#0A2540) color scheme
- 🌗 Full dark/light mode with smooth transitions via next-themes
- 📱 Fully responsive (mobile-first) with glassmorphism header
- ♿ WCAG AA accessible
- ✨ Framer Motion animations (fade, slide, stagger reveals)
- 📝 Working inquiry form with Zod + React Hook Form validation
- 🔍 SEO-ready metadata & Open Graph
- ⚡ Optimized for Lighthouse 95+
- 🧩 shadcn/ui components (Button, Card, Input, Select, Textarea, Tabs, Accordion)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home / Landing Page (hero, services, stats, why Brimus, experience, team, CTA) |
| `/about` | About Us (heritage, vision/mission, values, strengths, team) |
| `/services` | Services (4 categories with detailed descriptions + tabs) |
| `/experience` | Experience & Team (engagements, team members, credentials) |
| `/contact` | Contact / Inquiry (form, contact info, map placeholder) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── page.tsx            # Landing page (home)
│   ├── about/page.tsx      # About Us
│   ├── services/page.tsx   # Services
│   ├── experience/page.tsx # Experience & Team
│   ├── contact/page.tsx    # Contact / Inquiry
│   ├── api/inquiry/route.ts # Form submission endpoint
│   ├── layout.tsx          # Root layout (theme + page wrapper)
│   └── globals.css         # Tailwind v4 + design system
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── form.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   ├── sheet.tsx
│   │   ├── checkbox.tsx
│   │   └── submit-button.tsx
│   ├── sections/           # Shared page sections
│   │   ├── header.tsx      # Sticky glassmorphism nav + dark mode toggle
│   │   ├── footer.tsx
│   │   ├── service-card.tsx
│   │   ├── stat-section.tsx # Section header + stat cards
│   │   └── toast.tsx       # Animated notifications
│   └── page-wrapper.tsx    # Framer Motion page transitions
├── lib/
│   ├── utils.ts            # cn() utility
│   ├── constants.ts        # Site configuration (name, contacts, nav)
│   └── data.ts             # Services, team, experience data + icon map
├── types/
│   └── index.ts            # Shared TypeScript types
└── hooks/
    └── use-scroll-position.ts
```

## Form

The inquiry form on `/contact` includes:
- Full Name, Email, Phone, Company, Service (select), Message
- Client-side Zod validation with real-time error messages
- Loading state during submission
- Success/error toast notifications
- POST to `/api/inquiry` (logs to console; extend with email/DB as needed)

## Design System

### Colors
Defined in `src/app/globals.css` via CSS custom properties and Tailwind v4 `@theme inline`:
- **Primary**: `#0A2540` (deep navy)
- **Accent**: `#0F5132` (dark green for CTAs)
- **Secondary**: `#F1F5F9` (soft grey backgrounds)
- Full light/dark mode support via `.dark` class

### Typography
- **Font**: Inter (loaded via `next/font/google`)
- Clean hierarchy with 3xl/4xl/5xl/6xl heading sizes

## Customization

### Colors
Edit CSS custom properties in `src/app/globals.css` (`:root` for light, `.dark` for dark).

### Content
Update data in `src/lib/data.ts` (services, team, experiences) and `src/lib/constants.ts`.

### Fonts
Currently using Inter. Change the import in `src/app/layout.tsx`.

## License

© 2026 Brimus Consultancy Ltd. All rights reserved.
