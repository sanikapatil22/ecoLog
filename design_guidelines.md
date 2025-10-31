# EcoLog Design Guidelines

## Design Approach

**Selected Framework:** Hybrid Reference-Based Approach  
Drawing inspiration from:
- **Duolingo**: Gamification, progress tracking, streak mechanics, achievement badges
- **Strava**: Activity feeds, leaderboards, personal bests, community challenges
- **Linear**: Clean data visualization, modern dashboard aesthetics, minimal chrome
- **Notion**: Organized information hierarchy, card-based layouts, flexible views

**Core Principles:**
1. **Celebration of Progress** - Every action feels rewarding and impactful
2. **Data Transparency** - Environmental metrics are prominent, understandable, and inspiring
3. **Dual Personality** - Playful for individuals, professional for corporates
4. **Eco-Modern Aesthetic** - Clean, organic shapes with contemporary digital polish

---

## Typography System

**Font Families:**
- Primary: 'Inter' (Google Fonts) - All UI, dashboards, navigation
- Display/Headers: 'Poppins' (Google Fonts) - Hero text, impact numbers, section titles

**Hierarchy:**
- Hero Headlines: Poppins Bold, text-6xl (desktop), text-4xl (mobile)
- Section Titles: Poppins SemiBold, text-4xl (desktop), text-3xl (mobile)
- Impact Metrics (Large Numbers): Poppins Bold, text-5xl
- Card Headers: Inter SemiBold, text-xl
- Body Text: Inter Regular, text-base (16px)
- Labels/Meta: Inter Medium, text-sm
- Captions: Inter Regular, text-xs

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Tight spacing: p-2, gap-2 (compact metrics, badges)
- Standard spacing: p-4, gap-4 (cards, form fields)
- Section padding: py-12 md:py-20 (vertical rhythm)
- Component gaps: gap-6 to gap-8 (card grids)
- Hero sections: py-20 md:py-32

**Grid Patterns:**
- Dashboard Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6
- Impact Metrics: grid-cols-2 md:grid-cols-4 (stat display)
- Action Feed: Single column max-w-3xl with full-width on mobile
- Corporate Team View: grid-cols-1 lg:grid-cols-2 xl:grid-cols-3

**Container Strategy:**
- Full-width sections: w-full with px-4 md:px-8
- Content containers: max-w-7xl mx-auto
- Dashboard main: max-w-6xl mx-auto
- Forms/Details: max-w-2xl mx-auto

---

## Component Library

### Navigation
**Individual App:**
- Sticky top navigation with logo, main nav links, EcoPoints badge (pill-shaped with points count), profile avatar
- Mobile: Hamburger menu with slide-in drawer
- Bottom navigation on mobile for quick actions (Log Action, Dashboard, Leaderboard, Profile)

**Corporate Dashboard:**
- Sidebar navigation (fixed left, ~240px wide) with company logo, team stats summary, main sections
- Top bar with search, notifications, admin controls
- Collapsible sidebar on tablet/mobile

### Hero Section (Landing Page)
**Layout:**
- Two-column split: 60% left (content), 40% right (hero image)
- Left: Large headline about sustainability impact, supporting text, dual CTA buttons (primary "Start Logging" + secondary "For Corporates")
- Right: High-quality hero image showing diverse people engaged in eco-activities
- Background: Subtle organic blob shapes or abstract leaf patterns (SVG illustrations)

### Dashboard Cards

**Impact Metrics Cards:**
- Prominent number display (Poppins Bold, large)
- Icon representing metric type (CO₂, water drop, recycling symbol)
- Subtitle with time period and trend arrow
- Micro chart (sparkline) showing progress over time
- Rounded corners (rounded-xl), subtle elevation

**Action Log Cards:**
- Left: Category icon in colored circle
- Center: Action title, timestamp, verification status badge
- Right: EcoPoints earned (pill badge)
- Expandable accordion for details/proof image

**Leaderboard Cards:**
- Rank badge (special styling for top 3 with medal icons)
- User/company name with avatar
- Progress bars showing relative impact
- Key metrics as small chips

### Forms & Inputs

**Action Logging Form:**
- Large, icon-driven action type selector (grid of cards with icons)
- Multi-step wizard flow with progress indicator
- Image upload dropzone with preview
- Quantity/duration inputs with increment/decrement buttons
- Success celebration modal upon submission

**Search & Filters:**
- Prominent search bar with icon
- Filter chips for categories, date ranges, verification status
- Quick filter buttons for common views

### Data Visualization

**Charts (using Recharts):**
- Area charts for cumulative impact over time
- Bar charts for monthly/weekly comparisons
- Donut charts for category breakdowns
- Line charts with gradient fills for trend visualization
- Tooltips with detailed breakdowns

**Progress Indicators:**
- Circular progress for goals/targets
- Linear progress bars with percentage labels
- Streak calendars (Duolingo-style)

### Gamification Elements

**EcoPoints Display:**
- Large wallet/balance component with points total
- Recent transactions list
- Redemption catalog (grid of partner offers with discount badges)

**Achievements/Badges:**
- Modal showcase when earned
- Badge gallery in profile
- Progress toward next badge with completion percentage

**Leaderboards:**
- Tabbed interface (Daily/Weekly/Monthly/All-Time)
- Podium visualization for top 3
- Animated transitions when rankings update
- Personal position highlighted

### Corporate Features

**Team Management:**
- Data table with sortable columns
- Inline action buttons (edit, view details)
- Bulk action controls
- Export to CSV button

**Sustainability Reports:**
- PDF preview with download button
- Metric summary cards
- Comparison charts (period-over-period)
- Share/export options

### Modals & Overlays
- Centered modals with backdrop blur
- Action confirmation dialogs
- Full-screen overlays for image viewing
- Toast notifications for real-time updates (points earned, action verified)
- Celebration animations (confetti, checkmark pulse)

---

## Images

**Required Images:**

1. **Hero Image (Landing):**
   - Description: Diverse group of people (mixed ages, ethnicities) engaged in eco-activities: planting, recycling sorting, biking, holding reusable containers
   - Placement: Right side of hero section, 40% width on desktop
   - Treatment: Rounded corners (rounded-2xl), subtle shadow

2. **Dashboard Empty States:**
   - Description: Friendly illustrations of people starting eco-journeys, planting seedlings
   - Placement: Center of empty action logs, before first entry
   - Style: Simple, optimistic line art

3. **Corporate Dashboard Hero:**
   - Description: Modern office space with sustainability elements (plants, natural light, recycling stations)
   - Placement: Top banner of corporate dashboard, full-width but contained height
   - Treatment: Subtle overlay to ensure text readability

4. **Partner Brand Logos:**
   - Description: Placeholder logos for sustainable brands in rewards section
   - Placement: Redemption catalog, arranged in grid
   - Treatment: Grayscale with hover transition to full color

5. **Achievement Badge Graphics:**
   - Description: Custom badge designs for milestones (First Action, Streak Master, Team Leader, etc.)
   - Placement: Achievement modals, profile gallery
   - Style: Flat design with eco-themed iconography

---

## Icon Strategy

**Icon Library:** Heroicons (via CDN)  
**Usage Pattern:**
- Navigation items: outline style
- Action buttons: solid style
- Metric indicators: custom SVG for CO₂ cloud, water droplet, recycling symbol, leaf
- Status badges: check, clock, x icons
- Consistent sizing: w-5 h-5 for inline, w-6 h-6 for larger contexts, w-8 h-8 for feature cards

---

## Animation Principles

**Minimal, Purposeful Motion:**
- Data updates: Smooth number counting animations (use counting library)
- Card entrance: Stagger fade-in when dashboard loads (50ms delay between items)
- Success states: Single pulse/scale animation on submission
- Chart transitions: Smooth data point interpolation
- Page transitions: Simple fade (no page flips or slides)
- Hover states: Subtle lift (translate-y-1) with shadow increase on cards
- NO autoplay carousels, NO parallax scrolling, NO continuous animations

---

## Accessibility Standards

- All interactive elements minimum 44x44px touch target
- Form inputs with visible labels and focus states (ring-2 ring-offset-2)
- Color contrast ratio minimum 4.5:1 for body text
- Skip navigation links for keyboard users
- ARIA labels on icon-only buttons
- Screen reader announcements for point gains and leaderboard updates
- Loading states with skeleton screens
- Error messages clearly associated with form fields

---

This design creates an engaging, data-rich experience that celebrates environmental impact while maintaining professional credibility for corporate users. The balance of playful gamification and serious metrics tracking positions EcoLog as both motivating and trustworthy.