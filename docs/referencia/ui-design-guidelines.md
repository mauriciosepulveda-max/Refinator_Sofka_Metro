---
title: "UI/UX Design Guidelines"
version: "1.0.0"
status: "source-of-truth"
last_updated: "2026-04-04"
---

# UI/UX Design Guidelines

> **CARDINAL RULE:** Este documento es la única fuente de verdad para el diseño visual y estructural del **Requirement Refinator**. Todo componente generado DEBE derivarse de estas especificaciones.

---

## 1. Visual Identity

El sistema de diseño se fundamenta en proporciones de **Naranja, Negro y Blanco** con alto contraste y claridad visual.

### Principles
- **Naranja** sobre **negro** para energía y contraste
- **Blanco** como fondo base para limpieza y legibilidad
- **Gris cálido** (`#FAF8F6`) para contenedores de segundo nivel
- Tipografía **Clash Grotesk** (Display/Headings) + **Inter** (Body)

---

## 2. Color Palette (Design Tokens)

```css
:root {
  /* ── PRIMARY ─────────────────────────────────────────── */
  --color-primary:        #FF7E08;   /* Botones, acentos, hovers */
  --color-primary-hover:  #E06A00;   /* Estado hover */
  --color-primary-light:  rgba(255,126,8,0.10); /* Fondo translúcido */
  --color-primary-border: rgba(255,126,8,0.30); /* Borde suave */
  --color-dark:          #000000;   /* Fondos oscuros — header, footer */
  --color-white:         #FFFFFF;   /* Fondo principal */

  /* ── SURFACES ───────────────────────────────────── */
  --color-bg:          #FAF8F6;   /* Fondo base de la página */
  --color-surface:     #FFFFFF;   /* Tarjetas y panels */
  --color-surface-2:   #F5F2EF;   /* Superficies secundarias */
  --color-border:      #E8E2DA;   /* Bordes suaves */
  --color-border-2:    #D4CBBf;   /* Bordes enfatizados */

  /* ── TEXT ─────────────────────────────────────────── */
  --color-text:        #111110;   /* Texto principal */
  --color-text-muted:  #6B6560;   /* Texto secundario */
  --color-text-faint:  #A09890;   /* Texto terciario */

  /* ── SEMANTIC (RAG) ──────────────────────────────── */
  --color-success:     #16A34A;
  --color-success-bg:  #DCFCE7;
  --color-success-border: #86EFAC;
  --color-warning:     #D97706;
  --color-warning-bg:  #FEF3C7;
  --color-warning-border: #FCD34D;
  --color-error:       #DC2626;
  --color-error-bg:    #FEE2E2;
  --color-error-border: #FCA5A5;
}
```

### Quick Reference Table

| Role | Variable | HEX | Purpose |
|------|----------|-----|---------|
| **Primary** | `--color-primary` | `#FF7E08` | Acentos, hover, CTA |
| **Background** | `--color-white` | `#FFFFFF` | Fondo principal |
| **Dark** | `--color-dark` | `#000000` | Header, footer |
| **Gray** | `--color-bg` | `#FAF8F6` | Tarjetas, contenedores |
| **Text** | `--color-text` | `#111110` | Texto del cuerpo |
| **Error** | `--color-error` | `#DC2626` | Errores, bloqueos |

---

## 3. Typography

Dual typographic system: **Clash Grotesk** (Fontshare) + **Inter** (Google Fonts).

### Font Import

```html
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@400,500,600,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```

### Font Tokens

```css
--font-display: 'Clash Grotesk', 'Inter', system-ui, sans-serif;
--font-heading: 'Clash Grotesk', 'Inter', system-ui, sans-serif;
--font-body:    'Inter', system-ui, -apple-system, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;
```

### Typographic Scale

| Level | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| Display | 2rem (32px) | 700 | Clash Grotesk | Dashboard title |
| H1 | 1.5rem (24px) | 700 | Clash Grotesk | Section title |
| H2 | 1.25rem (20px) | 600 | Clash Grotesk | Card/panel title |
| H3 | 1rem (16px) | 600 | Inter | Subtitle |
| Body | 1rem (16px) | 400 | Inter | Base text |
| Small | 0.875rem (14px) | 400 | Inter | Metadata |
| XSmall | 0.75rem (12px) | 500 | Inter | Badges, labels |

---

## 4. Layout, Spacing & Utilities

### Grid and Containers

```css
--max-width: 1100px;
```

- **Layout:** Flexbox y CSS Grid for adaptability
- **Container:** `max-width: var(--max-width); margin: 0 auto; padding: 0 var(--space-6)`

### Border Radius

```css
--radius-sm:   0.375rem;  /* 6px */
--radius-md:   0.75rem;   /* 12px */
--radius-lg:   1rem;      /* 16px */
--radius-xl:   1.25rem;   /* 20px */
--radius-full: 9999px;    /* badges, chips */
```

### Shadows

```css
--shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04);
```

### Micro-interactions

```css
--t-fast:   150ms ease;
--t-normal: 200ms ease;
--t-slow:   350ms ease;
```

Elements on hover: `transform: translateY(-2px)` + shadow variation.

---

## 5. Component Specifications

### 5.1 Header / Navigation Bar

```css
.header {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 60%, #2d2d2d 100%);
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 18px rgba(0,0,0,0.30);
}
.logo {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  border-radius: 10px;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.2rem;
  color: #fff;
}
```

**Header text:** color `#FFFFFF`, font Clash Grotesk, size 1.1rem.

### 5.2 Cards

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
}
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  transition: var(--t-normal);
}
```

### 5.3 Buttons

| Type | Background | Usage |
|------|-----------|-------|
| **Primary CTA** | `linear-gradient(135deg, #FF7E08, #FF9A00)` | Main action |
| **Approve** | `linear-gradient(135deg, #16A34A, #22C55E)` | Approve |
| **Reject** | `linear-gradient(135deg, #DC2626, #EF4444)` | Reject |
| **Ghost** | `rgba(255,255,255,0.15)` + white border | Dark header |
| **Secondary** | `var(--color-surface-2)` + border | Secondary |

### 5.4 Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font: 600 0.72rem var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.badge-success { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success-border); }
.badge-warning { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning-border); }
.badge-error { background: var(--color-error-bg); color: var(--color-error); border: 1px solid var(--color-error-border); }
.badge-primary { background: var(--color-primary-light); color: var(--color-primary); border: 1px solid var(--color-primary-border); }
```

### 5.5 Tables

```css
.tbl { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.tbl th {
  background: var(--color-surface-2);
  padding: 10px 12px;
  font-weight: 600;
  border-bottom: 2px solid var(--color-border);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: var(--color-text-muted);
}
.tbl td { padding: 10px 12px; border-bottom: 1px solid var(--color-border); vertical-align: top; }
.tbl tr:hover { background: var(--color-surface-2); }
```

### 5.6 Callouts / Alerts

```css
.callout {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}
.callout-warning { background: var(--color-warning-bg); border-color: var(--color-warning); }
.callout-error { background: var(--color-error-bg); border-color: var(--color-error); }
.callout-success { background: var(--color-success-bg); border-color: var(--color-success); }
.callout-primary { background: var(--color-primary-light); border-color: var(--color-primary); }
```

### 5.7 Footer

```css
.footer {
  background: var(--color-dark);
  color: rgba(255,255,255,0.50);
  text-align: center;
  padding: var(--space-6) var(--space-4);
  font-size: 0.8rem;
  margin-top: var(--space-8);
}
```

---

## 6. ISO Quality Score Visualization

| Range | Color | Variable | Indicator | Status |
|-------|-------|----------|-----------|--------|
| 4.5–5.0 | `#16A34A` green | `--color-success` | ●●●●● | Ready for development |
| 3.5–4.4 | `#FF7E08` orange | `--color-primary` | ●●●●○ | Minor adjustments |
| 2.5–3.4 | `#D97706` amber | `--color-warning` | ●●●○○ | Review required |
| 1.5–2.4 | `#DC2626` red | `--color-error` | ●●○○○ | Rewrite needed |
| 0.0–1.4 | `#7F1D1D` dark red | — | ●○○○○ | BLOCKED |

---

## 7. Accessibility (WCAG AA)

- Focus visible: `outline: 2px solid var(--color-primary); outline-offset: 2px`
- Minimum contrast: WCAG AA (4.5:1 normal text, 3:1 large text)
- ARIA labels on interactive buttons and textareas
- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`
- Skip link for screen readers: `.skip-link`

---

## 8. Offline Font Fallback

Dashboards are opened locally (file://). Google/Fontshare fonts require connection.
For graceful degradation:

```css
--font-heading: 'Clash Grotesk', 'Inter', system-ui, sans-serif;
--font-body:    'Inter', system-ui, -apple-system, sans-serif;
```

If Clash Grotesk fails to load → Inter provides elegant fallback (same body, similar visual weight).

---

*Design Guidelines v1.0 — Requirement Refinator*
*Last updated: 2026-04-04*
