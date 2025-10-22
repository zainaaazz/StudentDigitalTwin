# Visual language template

## 1. Brand tokens

Define once, use everywhere.

- Primary #6C5CE7
- Primary strong #5A49E0
- Accent #FFB020
- Success #2ECC71
- Info #3AA3FF
- Danger #FF4D4F
- Text main #1F2430
- Text muted #6B7280
- Surface white #FFFFFF
- Surface subtle #F6F7FB
- Border soft #ECEEF3
- Focus ring rgba(108, 92, 231, 0.35)

Create CSS variables named for intent, not place, for example
`--color-primary`, `--color-surface`, `--radius-card`, `--shadow-card`.

## 2. Spacing scale

Use one scale everywhere.

- Base unit 8
- XS 4, S 8, M 12, L 16, XL 24, XXL 32, XXXL 48

Apply it to padding, gaps, grid gutters, and section spacing. No custom one-off values.

## 3. Typography

- Family Inter or Poppins
- Page title 22 to 24, weight 600
- Section heading 16 to 18, weight 600
- Body 14, weight 400
- Caption 12, weight 400
- Line height 1.4 to 1.6
- Always use Text main for titles and Text muted for helper lines

## 4. Layout grid

- Max page width 1440
- Page padding 24
- Grid gap 20
- Sidebar fixed 260
- Cards align to a 12 column grid on desktop and a single column stack on mobile

## 5. Cards

- Background Surface white
- Border 1px Border soft
- Radius 14
- Shadow 0 6px 14 rgba(31, 36, 48, 0.06)
- Inner padding 16 to 20
- Card header uses Section heading style plus a muted subline if needed
- Do not nest shadows inside shadows

## 6. Controls

- Primary button

  - Fill Primary, text white, radius 12, padding 10 x 16
  - Hover Primary strong
  - Focus ring colour as above

- Secondary button

  - Border 1px Primary, text Primary, background white
  - Hover background rgba Primary 0.06

- Icon button

  - Size 40, border 1px Border soft, background white

## 7. Navigation

- Left sidebar with icon plus label
- Active item background rgba Primary 0.08 and text Primary
- Section labels in Text muted
- Top bar height 64 with a pill search input

## 8. Data viz

- Chart background transparent on Surface white card
- Palette in order

  1. Primary
  2. Accent
  3. Info
  4. Success
  5. Danger

- Gridlines Border soft
- Axes Text muted
- Tooltips white with soft shadow
- Bars radius 6, stroke transparent
- Use the same colour for the same metric across pages

## 9. Status and chips

- Neutral pill background Surface subtle, text Text muted
- Success pill background rgba Success 0.12, text Success
- Warning pill background rgba Accent 0.14, text Accent
- Danger pill background rgba Danger 0.14, text Danger
- Radius 999, padding 4 x 10, size 12

## 10. Motion

- Standard easing cubic-bezier(0.22, 1, 0.36, 1)
- Duration 160 for hovers, 240 for pop or expand
- Translate 2 to 4 on hover for small accents only

## 11. Accessibility

- Minimum contrast 4.5 for text on background
- Focus states always visible
- Hit areas minimum 40 x 40
- Do not encode meaning by colour only, add icons or labels

## 12. Light to dark switch (if needed)

- Keep tokens, only map surfaces and text

  - Surface white to #111318
  - Text main to #F3F4F6
  - Text muted to #A3A9B6
  - Border soft to rgba(255,255,255,0.08)

- Keep Primary and Accent unchanged
- Reduce shadow and rely on subtle borders in dark

## 13. Page composition pattern

Use the same skeleton for all dashboards.

1. Page title row

   - Title, date filter, right aligned actions

2. KPI row

   - Three to four stat cards with an icon, value, delta chip

3. Main chart area

   - One large chart card two thirds width
   - One metric card one third width

4. Secondary row

   - Table or list card left
   - Activity or distribution chart right

## 14. Do and do not

- Do keep lots of white space and short labels
- Do reuse tokens for every component
- Do keep Primary for actions and highlights only
- Do not introduce new colours without updating tokens
- Do not stack more than two shadows
- Do not place gradients on large surfaces

## 15. Starter CSS variables

Drop this at the root to begin.

```css
:root {
  --color-primary: #6c5ce7;
  --color-primary-strong: #5a49e0;
  --color-accent: #ffb020;
  --color-success: #2ecc71;
  --color-info: #3aa3ff;
  --color-danger: #ff4d4f;

  --color-text: #1f2430;
  --color-text-muted: #6b7280;
  --color-surface: #ffffff;
  --color-surface-subtle: #f6f7fb;
  --color-border: #eceef3;
  --focus: rgba(108, 92, 231, 0.35);

  --radius-card: 14px;
  --shadow-card: 0 6px 14px rgba(31, 36, 48, 0.06);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
}
```

## 16. Implementation checklist

- Add tokens to your global CSS or Tailwind config
- Wrap every page in the same app shell and grid
- Convert all cards to the Card spec
- Update buttons to Primary and Secondary patterns
- Standardise charts to the palette above
- Add a design audit list that flags any hard coded styles not using tokens

That sidebar gradient moves from a bright magenta-purple at the top to a deep royal blue at the bottom. The approximate colour stops are:

- **Start (top):** `#9B51E0` — a vivid magenta-violet
- **Midpoint:** `#6C5CE7` — medium purple
- **End (bottom):** `#2D9CDB` — bright royal blue with a slight cyan tint

CSS gradient example:

```css
background: linear-gradient(180deg, #9b51e0 0%, #6c5ce7 40%, #2d9cdb 100%);
```

This gives the same smooth transition you see in the sample. You can tweak the middle stop slightly (e.g. 35–45%) to match your preferred purple-blue balance.
