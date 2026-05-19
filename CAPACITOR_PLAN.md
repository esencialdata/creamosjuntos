# Plan de integración Capacitor — Creamos Juntos

Este archivo es un plan de ejecución para Claude Code.
Los archivos marcados con ✅ ya fueron modificados previamente.

---

## Contexto

App: React + Vite + Firebase (Firestore + FCM)
Deploy web: Vercel
Objetivo: empaquetar la misma app como nativa en iOS y Android usando Capacitor,
manteniendo el deploy web funcionando en paralelo.

---

## Paso 1 — Instalar dependencias de Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npm install @capacitor/preferences
npm install @capacitor-firebase/messaging
```

---

## Paso 2 — Inicializar Capacitor

```bash
npx cap init "Creamos Juntos" "mx.plasmar.creamosjuntos" --web-dir dist
```

Esto genera `capacitor.config.ts` (o `.json`) en la raíz. Verificar que quede así:

```json
{
  "appId": "mx.plasmar.creamosjuntos",
  "appName": "Creamos Juntos",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  }
}
```

---

## Paso 3 — Build web y agregar plataformas

```bash
npm run build
npx cap add ios
npx cap add android
```

Esto crea las carpetas `ios/` y `android/` en la raíz del proyecto.

---

## Paso 4 — Configurar Firebase en iOS

1. Descargar `GoogleService-Info.plist` desde Firebase Console
   (proyecto `campo-david` → Configuración → iOS → Bundle ID: `mx.plasmar.creamosjuntos`)
2. Copiar el archivo a `ios/App/App/GoogleService-Info.plist`
3. En Xcode, arrastrarlo al target `App` para que quede referenciado en el proyecto

---

## Paso 5 — Configurar Firebase en Android

1. Descargar `google-services.json` desde Firebase Console
   (proyecto `campo-david` → Configuración → Android → Package: `mx.plasmar.creamosjuntos`)
2. Copiar el archivo a `android/app/google-services.json`
3. Verificar que `android/build.gradle` tenga:
   ```gradle
   classpath 'com.google.gms:google-services:4.4.0'
   ```
4. Verificar que `android/app/build.gradle` tenga al final:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

---

## Paso 6 — Registrar el plugin de FCM en iOS (AppDelegate)

Abrir `ios/App/App/AppDelegate.swift` y agregar el import y el registro:

```swift
import UIKit
import Capacitor
import FirebaseCore          // ← agregar
import CapacitorFirebaseMessaging  // ← agregar

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()  // ← agregar
        return true
    }
    ...
}
```

---

## Paso 7 — Generar íconos y splash screen

Instalar la herramienta de assets:
```bash
npm install @capacitor/assets --save-dev
```

Preparar dos archivos en `resources/`:
- `icon.png` — 1024×1024 px, sin transparencia, logo sobre fondo sólido
- `splash.png` — 2732×2732 px, logo centrado con fondo del color de la app (#ffffff)

Generar todos los tamaños:
```bash
npx capacitor-assets generate
```

---

## Paso 8 — Verificar llamadas async a storage.js ✅

El archivo `src/utils/storage.js` fue migrado a async (@capacitor/preferences).
Hay que buscar todos los lugares donde se llama `getStreak()` o `updateStreak()`
y asegurarse de que usen `await`:

```bash
grep -rn "getStreak\|updateStreak" src/
```

Corregir cada llamador para que sea async/await o use .then().

---

## Paso 9 — Sincronizar y abrir en IDEs

```bash
npm run build
npx cap sync
npx cap open ios      # abre Xcode
npx cap open android  # abre Android Studio
```

---

## Paso 10 — Configurar Push Notifications en Xcode

En Xcode:
1. Seleccionar el target `App`
2. Ir a `Signing & Capabilities`
3. Agregar capability: `Push Notifications`
4. Agregar capability: `Background Modes` → marcar `Remote notifications`

---

## Paso 11 — Subir APNs key a Firebase

En Firebase Console → Cloud Messaging → Configuración de la app iOS:
- Subir la clave APNs (.p8) generada en Apple Developer → Certificates, Identifiers & Profiles → Keys

---

## Paso 12 — Build y prueba en dispositivo físico

iOS:
- Conectar iPhone, seleccionarlo en Xcode como destino, ▶ Run
- Las notificaciones push NO funcionan en simulador, requieren dispositivo real

Android:
- Conectar Android con depuración USB activada, Run desde Android Studio
- Las notificaciones sí funcionan en emulador con Google Play Services

---

## Archivos ya modificados (no tocar)

- ✅ `src/hooks/useNotifications.js` — detecta Capacitor automáticamente, usa `@capacitor-firebase/messaging` en nativo y la Web Push API en web
- ✅ `src/utils/storage.js` — usa `@capacitor/preferences` en nativo, `localStorage` en web (ahora async)
- ✅ `src/components/PWAInstallBanner.jsx` — devuelve null en contexto nativo automáticamente

## Archivos que NO necesitan cambios

- `src/firebase.js` — Firestore funciona igual en WebView
- `src/context/GlobalPlayerContext.jsx` — el reproductor no cambia
- `src/App.jsx` — no requiere cambios para Capacitor (solo verificar los await de storage)
- Todo el contenido de `public/` (audio, video, imágenes)

---

## Notas finales

- La build web (`npm run build` → Vercel) sigue funcionando exactamente igual
- Capacitor solo envuelve el `dist/` en un WebView nativo
- El `firebase-messaging-sw.js` solo se usa en web; en nativo es ignorado
- Para actualizaciones de la app: `npm run build && npx cap sync` antes de subir a tiendas
