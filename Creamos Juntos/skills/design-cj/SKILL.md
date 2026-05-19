---
name: design-cj
description: >
  Skill de DISEÑO VISUAL para Creamos Juntos. Usar SIEMPRE que el usuario
  solicite crear, modificar o revisar cualquier elemento visual del proyecto:
  carruseles, slides, componentes HTML/JSX, paletas de color, layouts, cards,
  botones, tipografía, o cualquier output visual. También activar cuando el
  usuario mencione: "diseña", "estilo", "color", "fuente", "carrusel visual",
  "slide", "themeStyles", "HTML", "componente", "portada", "layout".
  NO usar solo si el usuario pide consulta factual sin producción visual.
---

# Skill de Diseño — Creamos Juntos Design System

## PROPÓSITO

Este skill define las reglas visuales que gobiernan **todo output de diseño** del
proyecto Creamos Juntos. Cualquier componente, carrusel, slide, HTML o interfaz
producida debe adherirse estrictamente a este sistema. El incumplimiento de estas
reglas rompe la coherencia visual de la plataforma.

---

## PALETA DE COLORES — NO NEGOCIABLE

### Colores base

| Rol | Color | Hex |
|-----|-------|-----|
| Texto primario / Headings | Deep Brown | `#2C2218` |
| Texto secundario | Warm Taupe | `#7A6E62` |
| Acento / Énfasis espiritual | Gold | `#8B6914` |
| Fondo de cards y containers | Cream | `#F9F6F1` |
| Borde sutil | Light Cream | `#E8E0D4` |
| Divisores | Warm Beige | `#E6E4DD` |
| CTA / Botón primario / Links activos | Bright Blue | `#2563EB` |
| Fondo global (página) | Off-white | `#FFFFFF` o `#F9F6F1` |

### Reglas de color

- **Texto primario siempre** `#2C2218` o `#2C2C2A`. Nunca negro puro para texto corrido.
- **Texto secundario / deshabilitado** → `#6B6B65` o `#7A6E62`. Nunca gris frío.
- **Acento de énfasis** → `#8B6914` (gold). Solo para highlights, citas, labels, footers temáticos.
- **Azul** (`#2563EB`) → exclusivo para CTAs, botones primarios, links interactivos, estados activos. Nunca para texto de contenido.
- **No mezclar tonos cálidos y fríos** fuera de sus roles. El azul no va en texto corrido. El gold no va en botones de acción.
- **Fondo de cards** → siempre `#F9F6F1`. El blanco puro (`#FFFFFF`) solo para inputs y overlays.

---

## TIPOGRAFÍA

### Familias

| Rol | Familia | Stack completo |
|-----|---------|----------------|
| Títulos / Display / Citas destacadas | Playfair Display (serif) | `'Playfair Display', Georgia, 'Times New Roman', serif` |
| Contenido espiritual / Narrativa / Body largo | Lora (serif) | `Lora, Georgia, serif` |
| UI / Interfaz / Labels / Botones | Inter (sans-serif) | `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| Botones y controles utilitarios | Arial | `Arial, Helvetica, sans-serif` |

### Jerarquía tipográfica

| Rol | Fuente | Tamaño | Peso | Line-height |
|-----|--------|--------|------|-------------|
| H1 / Display | Playfair Display | 35px | 700 | 39px |
| H2 / Label sección | Inter | 14px | 400 | 22px |
| H3 / Feature title | Lora | 20px | 700 | 32px |
| H4 / Card title | Inter | 16px | 600 | 26px |
| Body principal | Lora | 24px | 400 | 36px |
| Body UI | Inter | 16px | 400 | 26px |
| Caption / Meta | Inter | 13px | 400 | 21px |
| Label / Badge | Inter | 10–12px | 700 | 17px |

### Reglas tipográficas

- **Serif (Playfair / Lora)** → contenido espiritual, citas, títulos de peso. Nunca para UI o labels.
- **Sans-serif (Inter)** → navegación, labels, metadatos, botones, todo lo funcional.
- **Line-height mínimo 1.5x** el tamaño de fuente. Nunca menos.
- **All-caps** solo en labels de 10–14px. Nunca en body ni headings grandes.
- **Pesos disponibles**: 400 (body) y 600–700 (énfasis). Sin intermedios para mantener claridad.

---

## COMPONENTES

### Cards y Containers

```
Background:    #F9F6F1
Border:        1px solid #E8E0D4
Border-radius: 16px
Padding:       32px
Box-shadow:    rgba(44, 34, 24, 0.1) 0px 8px 32px -4px
Font:          Inter, 16px/26px
Hover:         background #F0EDE6, shadow más intensa
```

**La card es el componente más sagrado del sistema.** No reducir padding, no cambiar
el border-radius, no omitir la sombra. Estas propiedades definen la identidad visual.

### Botón Primario

```
Background:    #2563EB
Text:          #FFFFFF
Font:          Arial, 14px
Padding:       12px 24px
Border-radius: 20px
Border:        none
Shadow:        rgba(37, 99, 235, 0.2) 0px 4px 6px 0px
Min-height:    44px (accesibilidad)
Hover:         background #1D4ED8
```

### Botón Secundario

```
Background:    #F9F6F1
Text:          #2C2218
Font:          Arial, 14px
Padding:       12px 24px
Border-radius: 20px
Border:        1px solid #E8E0D4
Hover:         background #E8E0D4
```

### Inputs

```
Background:    #FFFFFF
Border:        1px solid #E8E0D4
Border-radius: 8px
Padding:       12px 16px
Font:          Inter, 16px
Placeholder:   #9CA3AF
Focus:         border #2563EB + shadow 0px 0px 0px 3px rgba(37,99,235,0.1)
Min-height:    44px
```

### Badges / Tags

```
Primary:   bg #2563EB, text #FFFFFF, 12px/600, padding 4px 12px, radius 12px
Secondary: bg #E8E0D4, text #2C2218, mismas proporciones
Accent:    bg #8B6914, text #FFFFFF, mismas proporciones
```

---

## ELEVACIÓN Y SOMBRAS

| Nivel | Shadow | Uso |
|-------|--------|-----|
| Flat | `none` | Nav, links, texto, estados deshabilitados |
| Surface | `rgba(44, 34, 24, 0.1) 0px 8px 32px -4px` | Cards, containers |
| Raised | `rgba(37, 99, 235, 0.2) 0px 4px 6px 0px` | Botones primarios, focus |
| Overlay | `rgba(0, 0, 0, 0.1) 0px 2px 4px 0px` | Modals, dropdowns |

- **Solo una sombra por elemento.** Nunca apilar sombras.
- **No animar sombras.** Solo transiciones de color/opacidad.
- Las sombras usan el tono cálido (`rgba(44, 34, 24, ...)`) — nunca negro frío.

---

## ESPACIADO

**Unidad base: 4px.** Todo espaciado en múltiplos de 4.

| Valor | Uso típico |
|-------|-----------|
| 4px | Micro (padding de icono, gap mínimo) |
| 8px | Compacto (gap entre elementos pequeños) |
| 12px | Estándar (márgenes de label, listas) |
| 16px | Cómodo (padding de card en mobile, márgenes de componente) |
| 24px | Generoso (padding interno, separación de secciones menores) |
| 32px | Mayor (padding de card desktop, separación de secciones) |
| 56px | Grande (entre bloques de contenido principales) |
| 64px | Extra (hero a contenido, secciones mayores en desktop) |

**Nunca valores arbitrarios** (ej. 15px, 22px, 37px). Si no está en la escala, redondea.

---

## BORDER-RADIUS

| Valor | Uso |
|-------|-----|
| 0px | Links de nav, inputs mínimos |
| 8px | Inputs, containers pequeños |
| 12px | Badges, cards secundarias |
| 16px | Cards primarias, feature boxes |
| 20px | Botones de acción |
| 50% | Elementos circulares, avatares, icon-buttons |

---

## LAYOUT Y RESPONSIVE

| Breakpoint | Ancho | Grid | Padding | Body |
|------------|-------|------|---------|------|
| Mobile | 320–640px | 1 columna | 16px | 16px |
| Tablet | 641–1024px | 2 columnas | 24px | 18px |
| Desktop | 1025px+ | 3 columnas | 32–64px | 24px |
| Large | 1201px+ | 3 col, max 1200px | centrado | 24px |

- **Touch targets mínimos**: 44×44px en cualquier elemento interactivo.
- **Gap entre cards**: 32px desktop, 24px tablet, 16px mobile.
- **Whitespace es intencional.** No comprimir secciones. El espacio en blanco es parte del diseño.

---

## CARRUSELES / SLIDES (themeStyles en data.js)

Cuando produzcas un objeto `themeStyles` para un carrusel del app, sigue este patrón base
y adáptalo al tema visual del contenido:

```js
themeStyles: {
    bg: '#F9F6F1',                    // Cream — o variante temática
    textPrimary: '#2C2218',           // Deep Brown
    textSecondary: '#7A6E62',         // Warm Taupe
    accent: '#8B6914',                // Gold — o acento temático
    fontSerif: '"Playfair Display", Georgia, serif',
    fontSans: 'Inter, sans-serif',
    cardBorder: '1px solid #E8E0D4',
    cardShadow: '0 8px 32px -4px rgba(44, 34, 24, 0.10)',
    backgroundImage: 'radial-gradient(ellipse at top, rgba(139,105,20,0.05) 0%, transparent 70%)',
}
```

**Variaciones temáticas aceptadas:**
- Puedes ajustar `bg`, `textPrimary`, `textSecondary` y `accent` para crear paletas
  temáticas (oscuras, vibrantes, neutras), pero **siempre mantén la calidez tonal**.
- No uses azules o verdes arbitrarios sin anclarlos al contenido (ej. verde para tema
  de siembra/tierra es válido; verde para un tema doctrinal sin relación, no).
- `fontSerif` y `fontSans` son fijos — no cambiar las familias tipográficas.
- `cardBorder` y `cardShadow` mantienen la fórmula de elevación del sistema.

---

## PROHIBICIONES ABSOLUTAS

- ❌ No usar negro puro (`#000000`) para texto corrido.
- ❌ No usar fuentes fuera del stack (Playfair Display, Lora, Inter, Arial).
- ❌ No usar colores fríos (azul, verde, morado) como texto principal o fondo base.
- ❌ No apilar múltiples sombras en un mismo elemento.
- ❌ No usar espaciados fuera de la escala de 4px.
- ❌ No reducir line-height por debajo de 1.5x el tamaño de fuente.
- ❌ No usar all-caps en texto de más de 14px.
- ❌ No omitir el padding de 32px en cards primarias sin justificación explícita.
- ❌ No usar bordes decorativos — solo bordes funcionales (cards, inputs).
- ❌ No animar sombras (solo color y opacidad en transiciones).

---

## FLUJO DE TRABAJO

```
Usuario solicita output visual
        ↓
Identificar tipo: carrusel / componente HTML / slide / UI
        ↓
Aplicar paleta de colores según rol de cada elemento
        ↓
Asignar tipografía: serif para contenido, sans para interfaz
        ↓
Respetar espaciado en múltiplos de 4px
        ↓
Verificar sombras, border-radius y elevación
        ↓
Confirmar touch targets ≥ 44px en elementos interactivos
        ↓
Entregar output con themeStyles o estilos inline correctos
```

---

## REFERENCIA RÁPIDA PARA AGENTE

```
Texto principal:    #2C2218  (Deep Brown)
Texto secundario:   #7A6E62  (Warm Taupe)
Acento / Gold:      #8B6914
CTA / Azul:         #2563EB
Fondo card:         #F9F6F1  (Cream)
Borde card:         #E8E0D4
Fondo página:       #FFFFFF o #F9F6F1

Serif (contenido):  Playfair Display / Lora
Sans (UI):          Inter / Arial

Card: bg #F9F6F1 · border 1px solid #E8E0D4 · radius 16px · padding 32px
      shadow: rgba(44,34,24,0.1) 0px 8px 32px -4px

Botón primario: bg #2563EB · text white · radius 20px · min-height 44px
Espaciado: 4 · 8 · 12 · 16 · 24 · 32 · 56 · 64 (solo estos valores)
```
