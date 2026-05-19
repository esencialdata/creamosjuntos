# Design System Inspired by Creamos Juntos

## 1. Visual Theme & Atmosphere

The Creamos Juntos design system embodies a warm, contemplative spirituality grounded in earth tones and natural textures. This faith-driven platform presents a serene, accessible interface that prioritizes clarity and reverence through generous whitespace, refined typography, and a deliberately restrained color palette. The aesthetic draws from organic materials—terracotta, natural linen, and warm wood—creating an atmosphere of trust and invitation. The design philosophy centers on creating a sanctuary for spiritual reflection and community connection, where content breathes and every element serves purpose. The visual language is inclusive and welcoming, avoiding unnecessary decoration while maintaining sophistication through thoughtful spacing and hierarchical clarity.

**Key Characteristics**
- Warm, natural earth-tone palette dominated by browns, tans, and golds
- Generous, contemplative whitespace supporting spiritual reflection
- Serif and sans-serif typography hierarchy balancing authority with accessibility
- Soft shadows and subtle elevation creating depth without visual noise
- Cream and off-white backgrounds evoking natural, wholesome materials
- Hand-crafted, organic aesthetic suggesting community and authenticity

## 2. Color Palette & Roles

### Primary
- **Deep Brown** (`#2C2218`): Primary text, headings, and primary brand elements—most frequently used color establishing authority and warmth
- **Warm Taupe** (`#7A6E62`): Secondary text, supporting information, and tonal hierarchy
- **Gold Accent** (`#8B6914`): Emphasis and highlight accents for spiritual significance or call-to-action support

### Accent Colors
- **Bright Blue** (`#2563EB`): Interactive primary actions, links requiring strong visibility
- **Sky Blue** (`#007AFF`): Secondary interactive states and alternative accent

### Interactive
- **Slate Blue** (`#2563EB`): Primary buttons and interactive focus states
- **Slate Gray** (`#475569`): Secondary button and form states

### Neutral Scale
- **Charcoal Black** (`#2C2C2A`): Core text color and highest contrast elements
- **Muted Gray** (`#6B6B65`): Secondary text, disabled states, and subtle UI elements
- **True Black** (`#000000`): Maximum contrast for critical text
- **Light Gray** (`#9CA3AF`): Placeholder text, hints, and lowest-emphasis text
- **Warm Stone** (`#8E8B82`): Border and divider color suggesting natural texture

### Surface & Borders
- **Cream** (`#F9F6F1`): Primary card and container backgrounds—warm, inviting surface
- **Light Cream** (`#E8E0D4`): Secondary surface and hover states
- **Warm Beige** (`#E6E4DD`): Subtle borders and dividers
- **Pure White** (`#FFFFFF`): Maximum contrast surfaces and overlay backgrounds
- **Slate Dark** (`#1F2937`): Alternative dark surface for contrast

## 3. Typography Rules

### Font Family
- **Primary Display**: Playfair Display (serif) — elegant, authoritative headings and quotes
  - Fallback stack: `'Playfair Display', Georgia, 'Times New Roman', serif`
- **Secondary Display & Accent**: Lora (serif) — refined body and link hierarchy
  - Fallback stack: `Lora, Georgia, serif`
- **Primary Body & UI**: Inter (sans-serif) — clean, accessible body copy and interface text
  - Fallback stack: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Button & Control**: Arial (sans-serif) — utilitarian, clear interaction text
  - Fallback stack: `Arial, Helvetica, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|-----------------|-------|
| Display/H1 | Playfair Display | 35px | 700 | 39px | normal | Page titles, major headings; warm, authoritative presence |
| Heading/H2 | Inter | 14px | 400 | 22px | normal | Section labels, category titles; subtle hierarchy support |
| Subheading/H3 | Lora | 20px | 700 | 32px | normal | Feature titles, emphasis links; refined emphasis |
| Subheading/H4 | Inter | 16px | 600 | 26px | normal | Card titles, component labels; clear visual emphasis |
| Body | Lora | 24px | 400 | 36px | normal | Primary narrative text, spiritual content; generous breathing room |
| Body Small | Inter | 16px | 400 | 26px | normal | Standard UI text, list items; readable and accessible |
| Body Extra Small | Inter | 13px | 400 | 21px | normal | Secondary text, captions, metadata |
| Label/Button | Arial | 14px | 400 | normal | normal | Buttons, form labels, small controls; utilitarian clarity |
| Label Tiny | Inter | 10px | 700 | 17px | normal | Tags, badges, UI hints; micro-hierarchy |
| Caption | Inter | 13px | 400 | 21px | normal | Timestamps, source attribution; de-emphasized information |

### Principles
- **Serif for Content**: Lora and Playfair Display establish reverence and credibility for spiritual content
- **Sans-serif for Interface**: Inter provides clarity and accessibility for navigation and controls
- **Generous Line Height**: 1.5x–1.6x base font size supports contemplative reading and accessibility
- **Semantic Weight**: 400 for body, 600–700 for emphasis; no intermediate weights to maintain clarity
- **All Caps Sparingly**: Reserved for labels and micro-hierarchy (10–14px only)

## 4. Component Stylings

### Buttons

**Primary Button (Large)**
- Background: `#2563EB`
- Text Color: `#FFFFFF`
- Font Family: `Arial`
- Font Size: `14px`
- Font Weight: `400`
- Padding: `12px 24px`
- Border Radius: `20px`
- Border: `none`
- Box Shadow: `rgba(37, 99, 235, 0.2) 0px 4px 6px 0px`
- Line Height: `normal`
- Hover State: Background `#1D4ED8`, shadow intensifies
- Active State: Background `#1E40AF`, shadow reduces
- Disabled State: Background `#D1D5DB`, Text `#9CA3AF`, no shadow

**Secondary Button**
- Background: `#F9F6F1`
- Text Color: `#2C2218`
- Font Family: `Arial`
- Font Size: `14px`
- Font Weight: `400`
- Padding: `12px 24px`
- Border Radius: `20px`
- Border: `1px solid #E8E0D4`
- Box Shadow: `none`
- Line Height: `normal`
- Hover State: Background `#E8E0D4`, border `#8E8B82`
- Active State: Background `#E6E4DD`, border `#6B6B65`

**Ghost Button**
- Background: `transparent`
- Text Color: `#6B6B65`
- Font Family: `Arial`
- Font Size: `14px`
- Font Weight: `400`
- Padding: `4px 10px`
- Border Radius: `0px`
- Border: `none`
- Box Shadow: `none`
- Line Height: `normal`
- Height: `30px`
- Hover State: Text Color `#2C2218`, background `rgba(232, 224, 212, 0.5)`
- Active State: Text Color `#2C2C2A`

**Icon Button**
- Background: `transparent`
- Text Color: `#6B6B65`
- Font Family: `Arial`
- Font Size: `13px`
- Font Weight: `400`
- Padding: `8px`
- Border Radius: `0px`
- Border: `none`
- Box Shadow: `none`
- Height: `36px`
- Width: `38px`
- Hover State: Text Color `#2C2218`, background `rgba(44, 44, 42, 0.05)`
- Active State: Text Color `#2C2C2A`

### Cards & Containers

**Standard Card**
- Background: `#F9F6F1`
- Text Color: `#2C2218`
- Font Family: `Inter`
- Font Size: `16px`
- Font Weight: `400`
- Padding: `32px`
- Border Radius: `16px`
- Border: `1px solid #E8E0D4`
- Box Shadow: `rgba(44, 34, 24, 0.1) 0px 8px 32px -4px`
- Line Height: `26px`
- Hover State: Background `#F0EDE6`, shadow `rgba(44, 34, 24, 0.15) 0px 12px 40px -4px`

**Minimal Card (Transparent)**
- Background: `transparent`
- Text Color: `#2C2218`
- Font Family: `Inter`
- Font Size: `16px`
- Font Weight: `400`
- Padding: `0px 4px 0px 0px`
- Border Radius: `0px`
- Border: `none`
- Box Shadow: `none`
- Line Height: `26px`

**Quote/Feature Container**
- Background: `#F9F6F1`
- Text Color: `#2C2218`
- Font Family: `Lora`
- Font Size: `24px`
- Font Weight: `400`
- Padding: `40px 32px`
- Border Radius: `16px`
- Border: `1px solid #E8E0D4`
- Box Shadow: `rgba(44, 34, 24, 0.1) 0px 8px 32px -4px`
- Line Height: `36px`
- Font Style: `italic` (optional for quotes)

### Inputs & Forms

**Text Input**
- Background: `#FFFFFF`
- Text Color: `#2C2218`
- Border: `1px solid #E8E0D4`
- Border Radius: `8px`
- Padding: `12px 16px`
- Font Family: `Inter`
- Font Size: `16px`
- Font Weight: `400`
- Line Height: `26px`
- Placeholder Color: `#9CA3AF`
- Focus State: Border `#2563EB`, box shadow `0px 0px 0px 3px rgba(37, 99, 235, 0.1)`
- Error State: Border `#DC2626`, box shadow `0px 0px 0px 3px rgba(220, 38, 38, 0.1)`

**Textarea**
- Background: `#FFFFFF`
- Text Color: `#2C2218`
- Border: `1px solid #E8E0D4`
- Border Radius: `8px`
- Padding: `12px 16px`
- Font Family: `Inter`
- Font Size: `16px`
- Font Weight: `400`
- Line Height: `26px`
- Min Height: `120px`
- Placeholder Color: `#9CA3AF`
- Focus State: Border `#2563EB`, box shadow `0px 0px 0px 3px rgba(37, 99, 235, 0.1)`

### Navigation

**Primary Navigation**
- Background: `transparent`
- Text Color: `#2C2218`
- Font Family: `Inter`
- Font Size: `16px`
- Font Weight: `400`
- Line Height: `26px`
- Padding: `0px 16px`
- Border Radius: `0px`
- Border: `none`
- Box Shadow: `none`
- Active State: Text Color `#2563EB`, border-bottom `2px solid #2563EB`
- Hover State: Text Color `#6B6B65`

**Breadcrumb Navigation**
- Text Color: `#6B6B65`
- Font Family: `Inter`
- Font Size: `14px`
- Font Weight: `400`
- Separator Color: `#E6E4DD`
- Active Link: Text Color `#2C2218`, weight `500`
- Hover State: Text Color `#2C2218`

**Tab Navigation**
- Background: `transparent`
- Text Color: `#6B6B65`
- Font Family: `Inter`
- Font Size: `14px`
- Font Weight: `400`
- Padding: `12px 16px`
- Border: `none`
- Border-Bottom: `2px solid transparent`
- Active State: Text Color `#2563EB`, border-bottom `2px solid #2563EB`
- Hover State: Text Color `#2C2218`, background `rgba(232, 224, 212, 0.3)`

### Links

**Standard Link (Body)**
- Text Color: `#2C2218`
- Font Family: `Lora`
- Font Size: `20px`
- Font Weight: `700`
- Line Height: `32px`
- Text Decoration: `none`
- Padding: `0px`
- Border: `none`
- Hover State: Text Color `#8B6914`, text-decoration `underline`
- Active State: Text Color `#6B6B65`
- Visited State: Text Color `#7A6E62`

**Navigation Link**
- Text Color: `#2C2218`
- Font Family: `Inter`
- Font Size: `16px`
- Font Weight: `400`
- Line Height: `26px`
- Text Decoration: `none`
- Hover State: Text Color `#2563EB`, text-decoration `underline`
- Active State: Text Color `#2563EB`, font-weight `500`

### Badges & Tags

**Primary Badge**
- Background: `#2563EB`
- Text Color: `#FFFFFF`
- Font Family: `Inter`
- Font Size: `12px`
- Font Weight: `600`
- Padding: `4px 12px`
- Border Radius: `12px`
- Line Height: `17px`

**Secondary Badge**
- Background: `#E8E0D4`
- Text Color: `#2C2218`
- Font Family: `Inter`
- Font Size: `12px`
- Font Weight: `600`
- Padding: `4px 12px`
- Border Radius: `12px`
- Line Height: `17px`

**Status Badge (Accent)**
- Background: `#8B6914`
- Text Color: `#FFFFFF`
- Font Family: `Inter`
- Font Size: `12px`
- Font Weight: `600`
- Padding: `4px 12px`
- Border Radius: `12px`
- Line Height: `17px`

### Audio Player

**Play Button (Primary)**
- Background: `#2C2218`
- Text/Icon Color: `#FFFFFF`
- Width: `56px`
- Height: `56px`
- Border Radius: `50%`
- Font Size: `24px`
- Box Shadow: `rgba(44, 34, 24, 0.15) 0px 4px 12px 0px`
- Hover State: Background `#1A1410`, box shadow scales

**Audio Waveform**
- Bar Color: `#2C2218`
- Background: `transparent`
- Height: `24px`
- Spacing Between Bars: `2px`

## 5. Layout Principles

### Spacing System

**Base Unit**: `4px`

**Scale & Usage**:
- `4px`: Micro-spacing (icon padding, tight component gaps)
- `8px`: Compact spacing (button padding, small component gaps)
- `12px`: Standard spacing (form label margins, small section gaps)
- `16px`: Comfortable spacing (card padding, component margins)
- `20px`: Breathing room (section margins, feature spacing)
- `24px`: Generous spacing (card padding, content padding)
- `32px`: Major spacing (section separation, card containers)
- `56px`: Large section breaks (between major content blocks)
- `64px`: Extra-large spacing (hero to content, major layout sections)

**Context**:
- Headings to body text: `24px`
- Between cards in grid: `32px`
- Between sections: `56px–64px`
- Form field vertical spacing: `16px`
- List item spacing: `12px`

### Grid & Container

**Max Width**: `1200px` for primary content containers

**Column Strategy**: 
- Desktop: 3-column grid for card layouts (405px wide cards with 32px gaps)
- Tablet: 2-column grid
- Mobile: Single-column (full width with 16px margins)

**Section Patterns**:
- Hero/Featured Content: Full-width container with centered max-width text overlay
- Card Grid: 3 columns with 32px gap, centered within max-width container
- Two-Column Layout: 60/40 or 50/50 split with 32px gutter
- Sidebar Pattern: Main content (70%) + sidebar (30%) with 32px gap

**Container Margins**: `32px` horizontal padding on mobile, `64px` on desktop

### Whitespace Philosophy

Whitespace in Creamos Juntos is intentional and sacred—it provides contemplative breathing room and prevents cognitive overload. Generous margins and padding create visual sanctuary around content, inviting focused engagement. Whitespace is never merely empty; it creates hierarchy through visual isolation and emphasizes importance through space rather than decoration.

### Border Radius Scale

- `0px`: Navigation links, buttons in minimal contexts, form inputs (sharp, utilitarian)
- `8px`: Form inputs, small modals, minor containers
- `12px`: Badges, small cards, secondary containers
- `16px`: Primary cards, major containers, feature boxes
- `20px`: Buttons (large, primary actions)
- `50%`: Icon buttons, circular elements, avatar placeholders

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | No shadow, `box-shadow: none` | Navigation, links, body text, disabled states |
| Surface (sm) | `rgba(44, 34, 24, 0.1) 0px 8px 32px -4px` | Cards, containers, lifted elements in quiet contexts |
| Raised (md) | `rgba(37, 99, 235, 0.2) 0px 4px 6px 0px` | Buttons, form focus states, interactive elevation |
| Overlay (lg) | `rgba(0, 0, 0, 0.1) 0px 2px 4px 0px` | Modals, dropdowns, floating elements above content |

**Shadow Philosophy**: Shadows in this system are subtle and warm, rooted in the primary earth-tone palette (`rgba(44, 34, 24, ...)`). Rather than harsh black shadows suggesting artificial light, they use the deep brown to create warmth and organic depth. Elevation is reserved for interactive and featured content; most UI elements remain grounded on a flat plane to avoid visual noise. Shadows increase on hover/active states to provide tactile feedback without breaking the contemplative aesthetic.

## 7. Do's and Don'ts

### Do
- **Do use warm earth tones** (`#2C2218`, `#7A6E62`, `#8B6914`) as primary text and UI accents; they establish brand warmth and spiritual authority
- **Do respect generous whitespace**; aim for 1.5x–2x line heights and use 32px+ spacing between major sections
- **Do pair Lora serif for spiritual/content text** and Inter sans-serif for UI; this creates hierarchy and improves accessibility
- **Do use the cream background** (`#F9F6F1`) for featured content and cards; it signals importance and welcomes engagement
- **Do apply subtle shadows** only to cards and interactive elements; flat UI for supporting navigation and text maintains visual calm
- **Do test blue accent links** (`#2563EB`) for sufficient contrast against cream backgrounds (minimum 4.5:1)
- **Do center align spiritual quotes and featured content** to evoke sacred typography traditions
- **Do use `#2563EB` (bright blue) as the only vibrant accent** for calls-to-action; this creates clear, scannable hierarchy

### Don't
- **Don't use all-caps text** except in tiny labels (10–14px) and section headers; maintain elegance through case and weight variation
- **Don't exceed 2–3 font families** on a single page; the prescribed system (Playfair Display, Lora, Inter, Arial) is intentionally limited for cohesion
- **Don't apply multiple shadows** to a single element; one shadow per elevation level maintains visual clarity
- **Don't mix warm and cool tones** arbitrarily; reserve cool blues strictly for interactive elements, never for primary text
- **Don't reduce line height below 1.5x** font size; accessibility and contemplative reading demand generous vertical rhythm
- **Don't override the card padding** (32px) without explicit design rationale; this padding is sacred to the brand's breathing-room philosophy
- **Don't use colored text** on colored backgrounds without testing 4.5:1 WCAG contrast; maintain accessibility rigorously
- **Don't animate shadows**; keep depth transitions subtle (opacity and background color only) to preserve the calm aesthetic
- **Don't use decorative borders**; only functional borders (form inputs, cards) are permitted; whitespace replaces ornament

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|------------|
| Mobile | 320px–640px | Single-column layout, 16px padding, 24px section spacing, 14px base text, stacked navigation |
| Tablet | 641px–1024px | 2-column grid (cards), 24px padding, 32px section spacing, 16px base text, horizontal navigation with wrapping |
| Desktop | 1025px+ | 3-column grid (cards), 32–64px padding, 56px section spacing, 24px body text, full horizontal navigation |
| Large | 1201px+ | Max-width containers (1200px), centered layout, increased outer spacing |

### Touch Targets
- **Minimum size**: `44px × 44px` for all interactive elements (buttons, links, form inputs)
- **Button padding**: `12px 24px` minimum (38–44px height)
- **Icon buttons**: `36px × 36px` minimum with 8px internal padding
- **Spacing between interactive elements**: `8px` minimum to avoid accidental taps
- **Form input height**: `44px` with `12px` vertical padding
- **Link underline thickness**: `2px` for improved visibility on touch devices

### Collapsing Strategy

**Navigation**: 
- Desktop: Horizontal tabs in fixed header
- Tablet: Horizontal tabs with scroll if overflow
- Mobile: Hamburger menu (fixed) with slide-out panel

**Grid Layouts**:
- Desktop: `3 columns` with `32px` gap
- Tablet: `2 columns` with `24px` gap
- Mobile: `1 column` full-width with `16px` margins

**Card Padding**:
- Desktop: `32px` padding
- Tablet: `24px` padding
- Mobile: `20px` padding

**Typography**:
- Desktop H1: `35px`
- Tablet H1: `28px`
- Mobile H1: `24px`
- Desktop body (Lora): `24px`
- Tablet body: `18px`
- Mobile body: `16px`

**Section Spacing**:
- Desktop: `64px` between major sections
- Tablet: `48px` between major sections
- Mobile: `32px` between major sections

**Images & Media**:
- Desktop: Full width within container max-width
- Tablet: 90% of container width with auto margins
- Mobile: 100% of container width (full bleed with 16px margins)

**Sidebar Layouts** (if present):
- Desktop: 2-column (70/30 split) with 32px gap
- Tablet: Stacked (sidebar below main, full width each)
- Mobile: Stacked (sidebar last)

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA**: Bright Blue (`#2563EB`) — primary buttons and active navigation states
- **Primary Text**: Deep Brown (`#2C2C2A`) — body copy and main headings
- **Secondary Text**: Muted Gray (`#6B6B65`) — supporting text, disabled states, hints
- **Card Background**: Cream (`#F9F6F1`) — featured content and lifted containers
- **Accent/Emphasis**: Gold (`#8B6914`) — secondary emphasis and spiritual highlights
- **Border/Divider**: Warm Beige (`#E6E4DD`) — subtle card borders and dividers
- **Headings**: Deep Brown (`#2C2218`) — Playfair Display for majors, Inter for secondaries
- **Focus State**: Bright Blue (`#2563EB`) — form field focus and active navigation

### Iteration Guide

1. **Always apply `#2C2218` or `#2C2C2A`** to primary text; use `#6B6B65` only for secondary/disabled text
2. **Card styling is non-negotiable**: `#F9F6F1` background, `16px` border radius, `1px solid #E8E0D4` border, `32px` padding, `rgba(44, 34, 24, 0.1) 0px 8px 32px -4px` shadow
3. **Use Lora 24px/36px for spiritual/narrative content** and `Inter 16px/26px` for UI text; never reverse these
4. **All buttons must be 44px minimum height** (`12px 24px` padding) for accessibility; primary buttons use `#2563EB` background
5. **Spacing in multiples of 4px**: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `56px`, `64px` — no arbitrary values
6. **Form focus ring**: Add `0px 0px 0px 3px rgba(37, 99, 235, 0.1)` on focus for all inputs
7. **Hover states**: Shift text color 1 shade darker or add `rgba(44, 44, 42, 0.05)` background; never add brightness
8. **Line height minimum 1.5x font size**: 24px font = 36px line height; 16px font = 26px line height (accessibility first)
9. **Navigation active state**: Use `#2563EB` text + `2px solid #2563EB` bottom border; no background color
10. **Elevation is rare**: Only cards and buttons get shadows; navigation, text, and secondary UI remain flat (`box-shadow: none`)
11. **Test all blue text** on `#F9F6F1` background for WCAG 4.5:1 contrast; use `#2563EB` links on cream only if tested
12. **Breadcrumb and caption text**: Use `#6B6B65` at `14px` weight `400`; never bold unless active/current page