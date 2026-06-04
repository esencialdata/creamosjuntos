# Claude.md - Creamos Juntos

## 0. REGLAS OBLIGATORIAS — LEER ANTES DE CUALQUIER TAREA

> ⛔ STOP. Antes de escribir UNA SOLA LÍNEA de código o contenido, lee los skills correspondientes.
> Ignorar esta regla ha causado errores graves y pérdida de tiempo. No hay excepciones.

### Para CUALQUIER carrusel, slide, HTML visual o componente:

**LEE ESTOS TRES ARCHIVOS EN ESTE ORDEN — SIN EXCEPCIÓN:**

1. `Creamos Juntos/skills/redaccion-idi/SKILL.md` → contenido teológico, RV1909, estructura
2. `Creamos Juntos/skills/design-cj/SKILL.md` → paleta, tipografía, espaciado, sombras
3. `Creamos Juntos/skills/carrusel-cj/SKILL.md` → estructura exacta de slides, themeStyles, HTML preview

**No leer estos archivos primero = error garantizado.**

### Tipografía — resumen no negociable:
- Títulos / Display / Subtítulos de contenido → **Playfair Display o Lora** (serif). NUNCA Inter.
- Labels, metadatos, contadores, botones → **Inter** (sans-serif)
- Texto principal → `#2C2218` (Deep Brown). NUNCA `#000000` ni `#111111`
- Fondo de cards → `#F9F6F1` (Cream). NUNCA gris frío.

### Antes de escribir el HTML de preview:
- Leer el archivo canónico: `Creamos Juntos/carrusel-la-buena-tierra.html`
- Copiar su estructura CSS base exacta, adaptando solo colores temáticos
- El preview debe verse idéntico al carrusel más reciente antes de publicar

---

## 1. Visión General del Proyecto

**Creamos Juntos** es una aplicación web espiritual basada en fe cristiana (Iglesia de Dios Israelita) que funciona como plataforma de enseñanza, desarrollo de hábitos y recursos bíblicos. Es una **PWA (Progressive Web App)** diseñada para ser instalable en dispositivos móviles y escritorio, con una arquitectura moderna en **React 19 + Vite**.

### Propósito Principal
Crear un ecosistema digital que combine:
- **Enseñanza teológica estructurada** (Temas semanales, Citas Bíblicas)
- **Contenido de audio ministerial** (Series de audio, episodios, cápsulas)
- **Desarrollo de hábitos espirituales** (Hábitos semanales, seguimiento de progreso)
- **Comunidad e interacción** (Predicaciones en vivo, favoritos, compartir)

### Arquitectura Técnica
- **Frontend**: React 19 + React Router 7 + Vite 7
- **Backend**: Firebase (Firestore, Firebase Auth, FCM - Firebase Cloud Messaging)
- **Hosting**: Vercel
- **Estado Global**: Context API (GlobalPlayerContext para reproductor de audio)
- **PWA**: vite-plugin-pwa, Capacitor para notificaciones push
- **Analytics**: Vercel Analytics
- **APIs Externas**: Google APIs (para integración de calendario)

---

## 2. Estructura del Proyecto

### Directorios Principales

```
/src
├── pages/                 # Páginas principales de la aplicación
│   ├── Home.jsx          # Página de inicio con contenido destacado
│   ├── Library.jsx       # Biblioteca central (Temas, Citas, Audios)
│   ├── Habits.jsx        # Gestión y visualización de hábitos
│   ├── Favorites.jsx     # Contenido guardado/marcado como favorito
│   ├── Backstage.jsx     # Página de servicio (admin/configuración)
│   └── AnalyticsPage.jsx # Dashboard de analytics
│
├── components/           # Componentes reutilizables
│   ├── Layout.jsx                    # Contenedor principal con header/footer
│   ├── Header.jsx                    # Navegación superior
│   ├── Footer.jsx                    # Pie de página con navegación
│   ├── StickyBottomPlayer.jsx        # Reproductor de audio fijo
│   ├── WeeklyTheme.jsx               # Tarjeta de tema semanal
│   ├── DailyVerse.jsx                # Verso del día
│   ├── HabitCard.jsx                 # Tarjeta individual de hábito
│   ├── WeeklyHabit.jsx               # Hábito semanal destacado
│   ├── AudioModuleCard.jsx           # Tarjeta de módulo de audio
│   ├── AudioModuleDetail.jsx         # Detalle expandido de módulo
│   ├── AudioCapsuleCard.jsx          # Tarjeta de cápsula de audio
│   ├── EpisodeCard.jsx               # Tarjeta de episodio individual
│   ├── EpisodeDetail.jsx             # Reproductor y detalles de episodio
│   ├── DesignOriginalCard.jsx        # Tarjeta de entrada a DISEÑO ORIGINAL
│   ├── DesignOriginalManifesto.jsx   # Modal con manifiesto completo
│   ├── SermonList.jsx                # Lista de predicaciones programadas
│   ├── TempleGrowth.jsx              # Indicador de progreso del templo
│   ├── CreationDays.jsx              # Contador de días de creación
│   ├── NotificationBanner.jsx        # Banner de permisos de notificaciones
│   ├── PWAInstallBanner.jsx          # Banner de instalación como app
│   ├── AutoRefresh.jsx               # Auto-refresh de datos
│   ├── AnalyticsDashboard.jsx        # Dashboard de analytics
│   └── [Estilos CSS]                 # WeeklyTheme.css, PWAInstallBanner.css
│
├── context/              # Context API para estado global
│   └── GlobalPlayerContext.jsx       # Control de reproductor de audio compartido
│
├── hooks/                # Hooks personalizados
│   ├── useNotifications.jsx          # Gestión de permisos de notificaciones push
│   ├── useBookmarks.jsx              # Gestión de favoritos/guardados
│   ├── usePWAInstall.jsx             # Detección y control de instalación PWA
│   └── [otros hooks]
│
├── services/             # Servicios de comunicación
│   ├── firestoreService.js           # Interacción con Firestore
│   └── [otros servicios]
│
├── config/               # Configuración centralizada
│   └── data.js                       # CONFIG: temas, audios, hábitos, citas
│
├── resources/            # Datos estáticos integrados
│   └── citas_biblicas.js             # Historial de citas bíblicas
│
├── utils/                # Funciones utilitarias
│   ├── dateUtils.js                  # Manejo de fechas (getLocalTodayDate)
│   ├── storage.js                    # LocalStorage helpers
│   ├── share.js                      # Web Share API wrapper
│   └── [otros utilitarios]
│
├── assets/               # Imágenes y recursos estáticos
│
├── App.jsx              # Componente raíz, enrutamiento
├── main.jsx             # Entrada de React
├── index.css            # Estilos globales y variables CSS
└── firebase.js          # Configuración de Firebase

```

### Archivos de Configuración

- **`package.json`**: Node v22.x, scripts (dev, build, lint), dependencias
- **`vite.config.js`**: Configuración de Vite + vite-plugin-react + vite-plugin-pwa
- **`vercel.json`**: Configuración de deployment en Vercel
- **`.env.local`**: Variables de entorno (Firebase keys, API keys)
- **`DESIGN.md`**: Sistema de diseño completo (colores, tipografía, componentes)
- **`CAPACITOR_PLAN.md`**: Plan de implementación de notificaciones push con Capacitor
- **`eslint.config.js`**: Reglas de linting

---

## 3. Configuración de Datos (CONFIG)

Ubicada en `/src/config/data.js`, contiene toda la información editorial de la aplicación:

### Estructura de CONFIG

```javascript
export const CONFIG = {
  // Meta
  currentWeek: number,          // Semana actual del plan
  
  // Contenido
  dailyVerse: {                 // Verso destacado del día
    text: string,
    reference: string,
    comment?: string
  },
  
  themes: [                      // Temas semanales
    {
      id: string,
      weekId: number,
      title: string,
      description: string,
      content: string,           // HTML/Markdown
      backgroundColor?: string,
      availableFrom?: string,    // ISO date para release progresivo
      supplementaryContent?: {...}
    }
  ],
  
  weeklyHabit: {                // Hábito de la semana actual
    id: number,
    name: string,
    description: string,
    category: string
  },
  
  habits: [                      // Todos los hábitos históricos
    { id, name, description, category, ... }
  ],
  
  audioCapsules: [               // Cápsulas de audio cortas
    {
      id: string,
      title: string,
      description: string,
      duration: number,          // segundos
      audioUrl: string,
      thumbnail?: string
    }
  ],
  
  audioModules: [                // Series de audio estructuradas
    {
      id: string,
      title: string,
      description: string,
      layer: 'entrada' | 'eje' | undefined,  // Capa estructural
      eje?: 'cuerpo' | 'alma' | 'espiritu',  // Eje temático (si layer=eje)
      seriesTag?: string,                      // Tag único (ej: 'DISEÑO ORIGINAL')
      coverImageUrl?: string,
      episodes: [
        {
          id: string,
          title: string,
          description: string,
          audioUrl: string,
          duration: number,
          releaseDate?: string,  // ISO date para release progresivo
          transcript?: string,
          resources?: [...]
        }
      ]
    }
  ]
}
```

### Datos Derivados

En `/src/resources/citas_biblicas.js`:
```javascript
export const CURRENT_MONTH_VERSES = [...]      // Citas del mes actual
export const VERSES_POOL = [...]               // Pool de citas disponibles
export const CURRENT_MONTH_LABEL = "Mes 2026"  // Label dinámico
export const CITAS_HISTORIAL = {...}           // Historial de citas pasadas
```

---

## 4. Routing y Navegación

**Router**: HashRouter de React Router v7 (para mejor compatibilidad con Vercel + SPA)

### Rutas Principales

| Ruta | Componente | Propósito |
|------|-----------|----------|
| `/` | `Home.jsx` | Página de inicio con contenido destacado |
| `/habitos` | `Habits.jsx` | Gestión y visualización de hábitos |
| `/recursos` | `Library.jsx` | Biblioteca central (Temas, Citas, Audios) |
| `/favoritos` | `Favorites.jsx` | Contenido guardado/marcado |
| `/servicio` | `Backstage.jsx` | Panel de servicio (admin features) |

### Parámetros y Anchors

- **Scroll a secciones**: `?anchor=<id>` (usado en Home y Library para enlazar dentro de la página)
- **Abrir episodio**: `?openEpisode=<episodeId>` (abre episodio específico en Library)
- **Abrir módulo**: `openModule=<moduleId>` (vía state)

---

## 5. Gestión de Estado

### Context API: GlobalPlayerContext

Proporciona control global del reproductor de audio (evita múltiples reproductores simultáneos).

```javascript
// En GlobalPlayerProvider se expone:
{
  currentAudio: { title, url, duration, ... },
  isPlaying: boolean,
  currentTime: number,
  play: (audio) => void,
  pause: () => void,
  seek: (time) => void,
  setVolume: (vol) => void
}
```

### LocalStorage

```javascript
// completedHabits (en App.jsx)
[
  { id: habitId, date: 'YYYY-MM-DD' },  // historial de hábitos completados
  ...
]

// bookmarks (en hooks/useBookmarks.jsx)
[
  { itemID, itemType, contentPreview, ... }  // favoritos/guardados
]

// notif_dismissed (sessionStorage)
'1'  // marca que el usuario descartó el banner de notificaciones en esta sesión
```

### Firebase Firestore

- **Collection `schedule`**: Predicaciones programadas
  ```javascript
  {
    id: string,
    title: string,
    description: string,
    scheduledDate: Timestamp,
    speaker: string,
    liveLink?: string
  }
  ```

---

## 6. Componentes Clave

### Home.jsx
**Props**: `toggleHabit`, `isHabitCompletedToday`, `brickCount`

**Renderiza**:
- Verso del día (DailyVerse)
- Sección "Lo Último" (tema + audio más recientes)
- Temas anteriores de la semana actual
- Tarjeta "DISEÑO ORIGINAL" (entrada a series de audio)
- Hábito de la semana (WeeklyHabit)
- Lista de predicaciones (SermonList)
- Indicador de progreso (TempleGrowth)
- Banner de instalación PWA (condicional)
- Banner de notificaciones (condicional)

**Funcionalidades**:
- Scroll automático a elementos via anchor (`?anchor=id`)
- Highlight temporal de elementos enlazados
- Seguimiento de streak (racha de días)

### Library.jsx
**Tabs principales**:
1. **Temas**: Grid de temas semanales con modal de detalle
2. **Citas Bíblicas**: 
   - Mes actual (reveladas progresivamente por día)
   - Historial de meses anteriores
   - Botones: Compartir, Guardar, Copiar
3. **Audios**:
   - Estructura por capas: "Para comenzar" → Ejes (Cuerpo/Alma/Espíritu)
   - Módulos expandibles a detalle (AudioModuleDetail)
   - Episodios reproducibles (EpisodeDetail)
   - Modal con manifiesto de DISEÑO ORIGINAL

**Funcionalidades**:
- Scroll a secciones vía anchor
- Apertura directa de episodios vía parámetro
- Integración con Web Share API
- Gestión de bookmarks

### Habits.jsx
**Renderi za**:
- Grid de todos los hábitos
- Para cada uno: nombre, descripción, contador de completados esta semana
- Checkbox para completar el hábito del día

**Funcionalidades**:
- Cálculo de racha
- Persistencia en localStorage
- Visual feedback de completado

### AudioModuleDetail.jsx
**Props**: `module`, `onBack`, `onEpisodeClick` (opcional)

**Renderiza**:
- Imagen de portada del módulo
- Título, descripción
- Lista de episodios (si es DISEÑO ORIGINAL, clickeable; si no, read-only)
- Metadatos (duración total, disponibilidad)

### EpisodeDetail.jsx
**Props**: `episode`, `module`, `onBack`, `onSelectEpisode`

**Renderiza**:
- Reproductor de audio (integrado con GlobalPlayerContext)
- Información del episodio
- Transcript (si disponible)
- Recursos/enlaces
- Navegación entre episodios del módulo

### StickyBottomPlayer.jsx
Reproductor de audio mini, siempre visible en la parte inferior de la pantalla. Conectado a GlobalPlayerContext. Permite reproducir, pausar, buscar sin navegar lejos del contenido actual.

---

## 7. Hábitos y Seguimiento de Progreso

### Lógica de Hábitos

En `App.jsx`:
```javascript
// Obtiene la fecha local sin zona horaria (YYYY-MM-DD)
const today = getLocalTodayDate();

// Toggle de hábito
toggleHabit(habitId) {
  // Si ya completado hoy, lo quita
  // Si no completado, lo añade
}

// Verificación
isHabitCompletedToday(habitId) {
  // Retorna boolean
}

// Contador (para TempleGrowth)
getBrickCount() {
  return completedHabits.length  // Total histórico
}
```

### Persistencia
- **LocalStorage**: `completedHabits` (JSON)
- **Firebase**: Opcional (para sincronización entre dispositivos)

### Visualización de Progreso

**TempleGrowth.jsx**:
- Muestra semana actual (`currentWeek`)
- Cuenta de hábitos definidos
- Racha actual (dias consecutivos con al menos 1 hábito)
- "Bricks" visuales (completados)
- Metáfora del "Templo" en construcción

---

## 8. Sistema de Audio

### Estructura

1. **Cápsulas de Audio** (`audioCapsules`)
   - Contenido corto, standalone
   - No tienen episodios ni metadata compleja

2. **Módulos de Audio** (`audioModules`)
   - Series estructuradas
   - Contienen episodios
   - Pueden tener "layers" (entrada, eje)

3. **Episodios** (dentro de módulos)
   - Unidad reproducible
   - Release progresivo vía `releaseDate`
   - Contienen transcript y recursos

### Reproductor Global

**GlobalPlayerContext**:
- Un único contexto para toda la app
- Evita múltiples reproductores simultáneos
- Integrado en `StickyBottomPlayer.jsx`
- Sincroniza estado con URL (para compartir posición de reproducción)

### Release Progresivo

```javascript
// En Library.jsx y Home.jsx
const now = new Date();
const isAvailable = !releaseDate || new Date(releaseDate + 'T00:00:00') <= now;
```

Permite schedulear contenido para liberarse en fechas específicas.

---

## 9. Sistema de Favoritos

**Hook**: `useBookmarks()`

```javascript
const { toggleBookmark, isBookmarked } = useBookmarks();

// Guardar/quitar favorito
toggleBookmark({
  itemID: string,        // ID único
  itemType: 'quote' | 'theme' | 'episode' | ...,
  contentPreview: string // Resumen para mostrar
  // + otros campos según tipo
});

// Verificar si está guardado
isBookmarked(itemID) // boolean
```

**Persistencia**: localStorage (`bookmarks` JSON)

**UI**: Corazón (❤️ guardado / 🤍 no guardado)

---

## 10. Notificaciones Push

### Setup Actual

**Capacitor + FCM**:
```javascript
// En useNotifications.js
import { PushNotifications } from '@capacitor-firebase/messaging';

// Flujo:
1. requestPermission() → Pide permiso al usuario
2. onRegistrationError/Success → Maneja tokens
3. setPushNotificationHandler() → Escucha mensajes
```

**Banner**: `NotificationBanner.jsx`
- Aparece si `permission === 'default'` (no decidido)
- Botones: "Aceptar" o "Descartar"
- Marca dismissal en sessionStorage (no volver a preguntar esta sesión)

### Backend (Vercel/Cloud Functions)
- Envía notificaciones vía Firebase Cloud Messaging
- Tipicamente desde `/api` (Cloud Functions)

---

## 11. PWA y Instalación

### Setup: vite-plugin-pwa

En `vite.config.js`:
```javascript
import PWA from 'vite-plugin-pwa'

PWA({
  manifest: {
    name: 'Creamos Juntos',
    short_name: 'Creamos',
    icons: [...],
    theme_color: '#2563EB',
    background_color: '#F9F6F1'
  },
  workbox: {...}
})
```

### Hook de Instalación

**usePWAInstall()**:
```javascript
const { isInstallable, install } = usePWAInstall();
// isInstallable: boolean (true si browser soporta + app no instalada)
// install(): void (muestra prompt de instalación)
```

### Banners

- **PWAInstallBanner.jsx**: Propone instalar app
- **NotificationBanner.jsx**: Propone permitir notificaciones

---

## 12. Diseño y Temas

### Paleta de Colores

**Primarios**:
- Deep Brown (`#2C2218`): Texto principal, headings
- Bright Blue (`#2563EB`): CTAs, links activos
- Gold (`#8B6914`): Énfasis, espiritual

**Neutrales**:
- Cream (`#F9F6F1`): Fondo de cards
- Warm Stone (`#8E8B82`): Bordes, dividers
- Muted Gray (`#6B6B65`): Texto secundario

**Completa**: Ver `DESIGN.md`

### Tipografía

- **Playfair Display** (serif): H1, títulos mayores
- **Lora** (serif): Contenido narrativo/espiritual
- **Inter** (sans-serif): UI, navegación
- **Arial** (sans-serif): Botones, labels

### Espaciado

Base: 4px
- `--spacing-sm`: 12px
- `--spacing-md`: 16px
- `--spacing-lg`: 32px

### Variables CSS

En `index.css`:
```css
:root {
  --color-primary: #2563EB;
  --color-text: #2C2218;
  --color-surface: #F9F6F1;
  --color-border: #E8E0D4;
  --spacing-md: 16px;
  --radius-md: 16px;
  /* ... más variables */
}
```

---

## 13. Datos Bíblicos y Contenido

### Citas del Mes (Daily Verses)

En `config/data.js`:
```javascript
export const CURRENT_MONTH_VERSES = [
  { text: '...', reference: 'Gén 1:1', comment?: '...' },  // Día 1
  { text: '...', reference: 'Gén 1:3', comment?: '...' },  // Día 2
  // ... 30 citas para 30 días
]
```

**Revelación progresiva**: En Library, muestra solo hasta el día actual.

### Historial de Citas

En `resources/citas_biblicas.js`:
```javascript
export const CITAS_HISTORIAL = {
  'enero-abril 2026': [...],
  'diciembre 2025': [...],
  // ... historial por período
}
```

---

## 14. Flujos de Usuario Principales

### Flujo 1: Exploración Inicial
1. Usuario abre Home
2. Lee verso del día
3. Ve tema semanal y último episodio de audio
4. Banner de instalación/notificaciones (opcional)
5. Ve progreso del templo (hábitos)

### Flujo 2: Gestión de Hábitos
1. Home → Toggle hábito semanal
2. Navega a `/habitos`
3. Ve todos los hábitos con checkboxes
4. Completa hábitos, ve progreso actualizado
5. TempleGrowth muestra racha

### Flujo 3: Exploración de Audios
1. Home → Click en "DISEÑO ORIGINAL"
2. Navega a `/recursos?anchor=audios-tab`
3. Ve módulos organizados por capas/ejes
4. Click en módulo abre AudioModuleDetail
5. Click en episodio abre EpisodeDetail y reproductor
6. StickyBottomPlayer sigue disponible

### Flujo 4: Lectura de Citas y Recursos
1. Home (contenido destacado)
2. `/recursos` → Tab "Citas Bíblicas"
3. Scrollea hacia cita del día actual
4. Acciones: Compartir, Guardar, Copiar
5. `/favoritos` → Ve todas las guardadas

---

## 15. Integración Firebase

### Inicialización

En `firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ...
});
```

### Firestore: Schedule de Predicaciones

En `firestoreService.js`:
```javascript
export const subscribeToSchedule = (callback) => {
  // Real-time listener a collection 'schedule'
  // Retorna unsubscribe function
}

export const initializeDefaultData = () => {
  // Crea datos por defecto si no existen
}
```

### Cloud Messaging

Tokens y listeners en `useNotifications.js` (Capacitor SDK).

---

## 16. Deploy y CI/CD

### Vercel

**`vercel.json`**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "REACT_APP_FIREBASE_*": "@firebase_*"
  }
}
```

**Automático**: Cada push a rama principal dispara build y deploy.

### Variables de Entorno

En `.env.local` (gitignored):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 17. Patrones y Best Practices

### Prop Drilling vs Context

- **Props**: Componentes simples (Card, Button)
- **Context**: Audio global (GlobalPlayerContext)
- **LocalStorage**: Hábitos, bookmarks (simples, persistencia offline)
- **Firestore**: Datos editables en tiempo real (schedule, admin)

### Conditional Rendering

```javascript
// Mejor: guard clauses
if (!items?.length) return null;

// Mejor: ternarios claros
condition ? <Component /> : null

// Evitar: lógica compleja en JSX
{items?.map((item, idx) => (
  <div key={idx}>
    {item.available && item.released && !item.archived && <Content />}
  </div>
))}
```

### Performance

- **Lazy loading**: `React.lazy()` para rutas (si necesario)
- **Memoization**: `useMemo` para cálculos costosos
- **Code splitting**: Vite lo maneja automáticamente
- **Images**: Optimizar con `next/image` equivalente o WebP

### Accesibilidad

- Alt text en imágenes
- Semantic HTML (`<button>`, `<header>`, `<section>`)
- ARIA labels en iconos
- Contraste mínimo 4.5:1 (per WCAG AA)
- Focus management en modales

---

## 18. Carpeta `/claude` y Skills

La carpeta `/claude/skills` contiene skills personalizados para Cowork/Claude Code:

```
/claude/skills/
├── [Ej: idi-teologico/]
│   └── SKILL.md         # Instrucciones para asistente bíblico-teológico
```

Estos skills se cargan en sesiones Cowork para proporcionar contexto especializado (ej: generación de contenido teológico).

---

## 19. Archivo CAPACITOR_PLAN.md

Documenta el plan de implementación de:
- Notificaciones push con Capacitor + FCM
- Integración con Firebase Cloud Messaging
- Configuración de permisos en iOS/Android
- Testing y debugging

---

## 20. Flujo de Cambios Típico

### Para Agregar un Nuevo Tema

1. **Editar `/src/config/data.js`**:
   ```javascript
   themes: [
     ...existing,
     { id: '...', weekId: 4, title: '...', content: '...' }
   ]
   ```

2. **Cambiar `currentWeek`** si es semana nueva

3. **Commit y push** → Vercel auto-deploy

4. **En vivo**: Home muestra tema automáticamente

### Para Agregar un Episodio

1. **Editar `/src/config/data.js`** → `audioModules[].episodes`
2. **Añadir `releaseDate`** si es release programado
3. **Incluir `audioUrl`** válido
4. **Commit** → Deploy automático

### Para Editar Citas Bíblicas

1. **Editar `/src/config/data.js`** → `CURRENT_MONTH_VERSES`
2. **O** `/src/resources/citas_biblicas.js` (historial)
3. **Commit** → Live

---

## 21. Troubleshooting Común

### Audio no Funciona
- Verificar `audioUrl` es válido y accesible (CORS)
- Revisar GlobalPlayerContext está envolviendo App
- Inspeccionar browser console para errores

### Hábitos no Persisten
- Revisar localStorage en browser devtools
- Comprobar `completedHabits` formato correcto
- Limpiar localStorage si está corrupto

### Notificaciones no Aparecen
- Verificar permiso fue concedido (browser notifications)
- Revisar FCM token en Firestore
- Comprobar Cloud Function envía mensajes correctamente

### Scroll a Anchor no Funciona
- Verificar elemento tiene `id` correcto
- Chequear el parámetro `?anchor=id` en URL
- Revisar timing (puede necesitar delay)

---

## 22. Stack Técnico Completo

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 19.2.0 |
| Routing | React Router | 7.10.1 |
| Build | Vite | 7.2.4 |
| Styling | CSS + Variables | Native CSS3 |
| State | Context API | (React built-in) |
| Async | Firebase SDK | 12.6.0 |
| Backend | Firebase (BaaS) | Cloud Firestore, Auth, FCM |
| Hosting | Vercel | (auto) |
| PWA | vite-plugin-pwa | 1.2.0 |
| Mobile | Capacitor | (Firebase Messaging) |
| Analytics | Vercel Analytics | 1.6.1 |
| Notifications | Capacitor FCM | 8.2.0 |
| Google APIs | googleapis | 171.4.0 |
| Utils | uuid | 13.0.0 |
| Carousel | Swiper | 12.0.3 |

---

## 23. Notas Importantes para Claude

### Cuando Generes Contenido Teológico
1. **Usa el skill `idi-teologico`** para enseñanzas alineadas con la Iglesia de Dios Israelita
2. **Respeta los 39 Puntos de Fe**
3. **Usa Reina-Valera 1909 o RVA** como versión bíblica base
4. **Mantén tono reverente pero accesible**

### Cuando Agregues Features
1. **Sigue DESIGN.md** para colores, espacios, tipografía
2. **Mantén el tema espiritual tranquilo** (no bright, no busy)
3. **Prioriza accesibilidad**: WCAG AA mínimo
4. **Test en mobile first**: responsivo es crítico

### Cuando Edites `config/data.js`
1. **Preserva la estructura JSON**
2. **Usa IDs únicos para elementos**
3. **Incluye `releaseDate` para release progresivo**
4. **Valida URLs de audio existan**

### Commits
1. **Mensajes descriptivos**: `feat: add theme week 5` vs `update`
2. **Pequeños commits**: Un cambio = un commit
3. **Test antes de push** si es posible

---

## 24. Referencias Externas

- **Firebase Docs**: https://firebase.google.com/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **PWA Guide**: https://web.dev/progressive-web-apps/
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

## 25. Contacto / Propietario

**Proyecto**: Creamos Juntos
**Owner**: Aaron Espinosa (aaron@plasmar.mx)
**Enfoque**: Ministerio de la Iglesia de Dios Israelita
**Estado**: En desarrollo activo

---

**Última actualización**: 2026-05-23
**Versión de app**: 0.1.9
**Node**: 22.x
**Responsable de documentación**: Claude AI (vía claude.md)

