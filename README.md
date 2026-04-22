# www.mongols.app

A small studio's landing page. Next.js 15 (App Router) + TypeScript + Tailwind CSS.

## Design system

| Concern        | Decision                                                                         |
| -------------- | -------------------------------------------------------------------------------- |
| Headings       | **Geist Sans** via `geist/font/sans` — `--font-geist-sans`                       |
| Technical tags | **JetBrains Mono** via `next/font/google` — `--font-jetbrains-mono`              |
| Surfaces       | Glassmorphism: `backdrop-blur(14px)`, semi-transparent border, inset highlight   |
| Background     | Three layered radial gradients (blue / indigo / sky) over `#05060f` ink canvas   |
| Soyombo brand  | SVG with `linearGradient` (gold→orange) + `.soyombo-glow` (20px outer drop-shadow) |
| Spacing        | Strict scale: `section-y`, `section-x`, `card-p`, `stack-{sm,md,lg}` (8px base)  |
| Icons          | Lucide via `<Icon icon={...} />` wrapper — pinned `strokeWidth={1.5}`            |

## Run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Structure

```
src/
  app/
    layout.tsx         # next/font wiring, html shell
    page.tsx           # landing composition
    globals.css        # tokens, radial bg, .glass + .soyombo-glow utilities
  components/
    SoyomboSymbol.tsx  # gold-gradient SVG mark
    ProjectCard.tsx    # glass card
    Icon.tsx           # Lucide wrapper enforcing stroke=1.5
```
