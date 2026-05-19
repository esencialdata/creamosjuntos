---
name: carrusel-cj
description: >
  Skill de PRODUCCIÓN DE CARRUSELES para Creamos Juntos. Usar SIEMPRE que el
  usuario solicite crear, modificar o previsualizar un carrusel de tema semanal.
  Define la estructura exacta de data.js, los campos de cada tipo de slide
  según WeeklyTheme.jsx, el mantenimiento de getCurrentWeekId(), y el formato
  del HTML de preview. NO es opcional — leer antes de tocar cualquier carrusel.
---

# Skill de Carrusel — Creamos Juntos

## CÓMO FUNCIONA EL CARRUSEL EN LA APP

El carrusel es renderizado por `src/components/WeeklyTheme.jsx` usando **Swiper**.

- `slidesPerView: 1.1` — muestra un slide completo con un peek del siguiente
- `centeredSlides: true` — el slide activo siempre centrado
- `grabCursor: true` — cursor de agarre en desktop
- `pagination: { clickable: true, dynamicBullets: true }` — puntos de paginación
- Cada slide es una card con `aspectRatio: '3/5'`, `maxHeight: '75vh'`, `padding: '2rem'`
- El contenido interno tiene scroll si desborda (scrollbar oculto)

---

## ESTRUCTURA EN `src/config/data.js`

Los temas van en `CONFIG.themes[]`, **más reciente primero** (al inicio del array).

```js
{
    id: 35,                               // Entero único, secuencial
    weekId: 22,                           // Número de semana ISO
    availableFrom: "2026-04-29T00:00:00", // Fecha/hora de publicación
    title: "LA BUENA TIERRA",
    description: "Subtítulo corto.",
    themeStyles: { /* ver abajo */ },
    slides: [ /* array de slides */ ]
}
```

### themeStyles — todos los campos que usa WeeklyTheme.jsx

```js
themeStyles: {
    bg: '#F9F6F1',                    // Fondo de la card
    textPrimary: '#2C2218',           // Color de títulos y cuerpo
    textSecondary: '#7A6E62',         // Color de texto secundario y citas
    accent: '#8B6914',                // Color de énfasis, etiquetas, blockquotes
    fontSerif: '"Playfair Display", Georgia, serif',
    fontSans: 'Inter, sans-serif',
    cardBorder: '1px solid #E8E0D4',
    cardShadow: '0 8px 32px -4px rgba(44, 34, 24, 0.10)',
    backgroundImage: 'radial-gradient(...)', // O 'none'
    backgroundSize: 'cover',          // Opcional, default 'cover'
}
```

---

## TIPOS DE SLIDE — CAMPOS EXACTOS (según WeeklyTheme.jsx)

### `cover` — Portada (siempre slide 1)

```js
{
    type: 'cover',
    title: 'TÍTULO\nEN VARIAS LÍNEAS.',   // \n para saltos
    subtitle: 'Frase de gancho.',
    videoUrl: '/video.mp4',               // Prioridad 1: video de fondo
    imageUrl: '/portada-slug.jpg',        // Prioridad 2: imagen (200px alto, objectFit cover)
    visual: '🌱',                         // Prioridad 3: emoji (fallback si no hay imagen)
    citation: 'Texto del versículo...',
    reference: 'Libro Cap:Ver (RV1909)',
    footerText: 'Creamos Juntos · Semana N',
}
```

**Nota:** `videoUrl`, `imageUrl` y `visual` son mutuamente excluyentes en prioridad. Si hay `imageUrl`, el visual no se muestra.

### `diagnostic` — Slide de contenido (el más usado)

```js
{
    type: 'diagnostic',
    label: 'ETIQUETA · Subtexto',         // Aparece arriba en accent color
    title: 'Título del slide.',            // H2, serif, 1.6rem
    subtitle: 'Texto secundario.',         // Opcional, accent, italic
    body: 'Cuerpo.\nSoporta saltos.',      // whiteSpace: pre-line
    question: '¿Pregunta reflexiva?',      // Opcional
    options: ['Opción A', 'Opción B'],     // Array de strings, lista sin viñetas
    citation: 'Versículo...',              // Un solo versículo
    reference: 'Libro Cap:Ver (RV1909)',
    citations: [                           // Múltiples versículos (si hay varios)
        { text: 'Versículo 1...', reference: 'Ref 1' },
        { text: 'Versículo 2...', reference: 'Ref 2' },
    ],
}
```

**Nota:** Si usas `citations` (plural, array), no uses `citation`. Si solo hay uno, usa `citation` + `reference`.

### `concept` — Slide de concepto con advertencia

```js
{
    type: 'concept',
    tag: 'ETIQUETA',                      // Badge de acento
    subTag: 'subtexto italic',            // Texto junto al badge
    concept: 'Definición del concepto.',
    dangerTitle: 'EL PELIGRO',            // Título en rojo (#DC2626)
    dangerText: 'Explicación del riesgo.',
    citation: 'Versículo...',
    reference: 'Libro Cap:Ver (RV1909)',
}
```

### `action` — Slide de pasos de aplicación

```js
{
    type: 'action',
    title: 'Título de acción.',
    subtitle: 'Subtítulo de acción.',
    steps: [
        'Examina: descripción del paso',    // String con formato "Label: texto"
        { label: 'Alinea:', text: 'texto' }, // O objeto {label, text}
    ],
    citation: 'Versículo...',
    reference: 'Libro Cap:Ver (RV1909)',
    footer: 'Texto de pie de slide.',
}
```

### `video` — Slide de video

```js
{
    type: 'video',
    videoUrl: '/video.mp4',
    controls: false,                       // Mostrar controles del video
    caption: 'Texto debajo del video.',
}
```

### Tipos legacy (no usar en temas nuevos)

- `title`: `{ type, sub, content }` — título centrado
- `verse`: `{ type, content, citation }` — versículo centrado
- `challenge`: `{ type, content }` — reto con emoji 🔥

---

## `getCurrentWeekId()` — MANTENIMIENTO OBLIGATORIO

**Cada vez que se agrega un tema con un `weekId` nuevo, hay que actualizar esta función en `data.js`.**

### Cómo funciona

```js
const getCurrentWeekId = () => {
    const now = new Date();
    const weekNStart = new Date(2026, mes-1, dia); // mes en base 0
    // ...
    if (now >= weekNStart) return N;   // ← Orden: más reciente primero
    if (now >= weekN1Start) return N-1;
    // ...
};
```

### Reglas

1. Agregar `const weekNStart = new Date(año, mes-1, día)` junto a las demás.
2. Agregar `if (now >= weekNStart) return N;` **ANTES** del return de la semana anterior.
3. El mes es base 0: enero=0, febrero=1, marzo=2, abril=3, mayo=4, etc.
4. Si no se actualiza esta función, el carrusel nuevo NO aparece en la app aunque esté en `data.js`.

### Ejemplo — agregar semana 23 (Mayo 6, 2026)

```js
const week22Start = new Date(2026, 3, 29); // Apr 29 ← ya existe
const week23Start = new Date(2026, 4, 6);  // May 6  ← agregar

if (now >= week23Start) return 23;  // ← agregar ANTES del 22
if (now >= week22Start) return 22;
```

---

## FILTRO DE HOME.JSX — CÓMO SE SELECCIONA EL TEMA

```js
CONFIG.themes
    .filter(t =>
        t.weekId === CONFIG.currentWeek &&
        (!t.availableFrom || new Date() >= new Date(t.availableFrom))
    )
```

- Solo aparece si `weekId === currentWeek` (devuelto por `getCurrentWeekId()`).
- Si tiene `availableFrom`, solo aparece cuando ya pasó esa fecha/hora.
- Si hay múltiples temas de la misma semana, todos aparecen como slides adicionales.

---

## PORTADA — CONVENCIONES

- La imagen se guarda en `/public/portada-[slug].jpg` (sin tildes, sin espacios).
- Se genera con Pixa. **Modelo: Nano Banana 2** para estilo cinematográfico/hiperrealista.
- Se referencia en el slide `cover` como `imageUrl: '/portada-[slug].jpg'`.
- El usuario descarga la imagen desde Pixa y la coloca en `/public/` manualmente.
- Tamaño recomendado: proporción 4:5 o 3:5.

### Estilo visual de portada

- **Sí:** Cinematográfico, hiperrealista, macro, luz dramática, volumétrica o de hora dorada.
  Naturaleza, objetos cotidianos, texturas, elementos abstractos que evoquen el tema.
- **No:** Imágenes religiosas de ningún tipo.
- **No:** Estética cristiana — cruces, palomas, rayos de luz sobre biblias, manos orando,
  iglesias, vitrales, siluetas arrodilladas, coronas de espinas, o cualquier iconografía
  asociada al catolicismo, evangelismo o protestantismo.
- **No:** Estética de Testigos de Jehová — ilustraciones planas de personas sonrientes en
  entornos bucólicos, familias multiculturales posando, personas leyendo la Biblia juntas.
- **No:** Texto incrustado en la imagen.
- **No:** Personas reconocibles o rostros protagónicos.

---

## HTML DE PREVIEW — FORMATO OBLIGATORIO

El archivo `Creamos Juntos/carrusel-[slug].html` simula la experiencia móvil.

**Archivo de referencia canónico:** `Creamos Juntos/carrusel-la-buena-tierra.html`

### Estructura

```
body (fondo oscuro temático, centrado)
  └── .phone (375×667px, border-radius 40px, overflow hidden)
       └── .track (flex horizontal, transition translateX)
            └── .slide × N (flex: 0 0 375px, height 100%)
  └── .dots (indicadores de posición)
```

### JavaScript obligatorio

```js
// goTo(n) — mueve track y actualiza dots
// Navegación táctil: touchstart + touchend (dx > 40px)
// Navegación mouse: mousedown + mouseup (dx > 40px)
// Navegación teclado: ArrowLeft / ArrowRight
```

### Reglas

- `slidesPerView` en la app es 1.1 (peek del siguiente), pero en el preview usamos
  el phone frame completo — no es necesario simular el peek.
- NO usar grids ni mostrar múltiples slides a la vez.
- El fondo del body es oscuro (color temático).
- Los dots: 5px, el activo escala 1.5x.

---

## FLUJO COMPLETO PARA UN CARRUSEL NUEVO

```
1. Leer redaccion-idi/SKILL.md   → estructurar contenido teológico
2. Leer design-cj/SKILL.md       → definir themeStyles y paleta
3. Leer carrusel-cj/SKILL.md     → este archivo
4. Agregar tema a CONFIG.themes[] en data.js (al inicio del array)
5. Actualizar getCurrentWeekId() con la nueva semana
6. Crear carrusel-[slug].html con phone frame + JS de navegación
7. Generar portada en Pixa (Nano Banana 2, 4:5)
8. El usuario guarda como /public/portada-[slug].jpg
9. Agregar imageUrl al slide cover en data.js
10. Commit + push → Vercel auto-despliega
```

---

## PROHIBICIONES ABSOLUTAS

- ❌ No mostrar slides en cuadrícula en el HTML de preview.
- ❌ No omitir la actualización de `getCurrentWeekId()` — sin esto el carrusel no aparece.
- ❌ No usar `citations` (array) y `citation` (string) al mismo tiempo en un slide.
- ❌ No poner imágenes de portada fuera de `/public/`.
- ❌ No usar nombres de archivo con tildes o espacios en `/public/`.
- ❌ No agregar el tema al final de `CONFIG.themes[]` — siempre al inicio.
- ❌ No inventar campos de slide que no existan en WeeklyTheme.jsx.
