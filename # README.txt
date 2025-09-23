# README

## Requisitos previos

- [Node.js](https://nodejs.org/) (recomendado v18 o superior)
- [npm](https://www.npmjs.com/) (v9 o superior) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (global)

Instala Expo CLI globalmente si no lo tienes:
```sh
npm install -g expo-cli
```

## Instalación del proyecto

1. **Clona el repositorio y entra en la carpeta del proyecto:**
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd UCV-GREEN-MOBILITY
   ```

2. **Instala las dependencias del proyecto principal:**
   ```sh
   npm install
   ```
   o si prefieres usar yarn:
   ```sh
   yarn install
   ```

3. **(Opcional) Si vas a trabajar con el backend/functions en TypeScript, instala dependencias ahí también:**
   ```sh
   cd backend/functions
   npm install
   cd ../../
   ```

## Dependencias principales

Estas se instalan automáticamente con `npm install`, pero si necesitas instalarlas manualmente:

```sh
npm install @expo/vector-icons @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack @react-navigation/stack expo expo-font expo-status-bar lottie-react-native react react-native react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
```

### Dependencias de desarrollo

```sh
npm install --save-dev @types/react typescript
```

## Fuentes personalizadas

Las fuentes están en `frontend/assets/fonts/`. Expo las carga automáticamente si sigues el ejemplo de [`frontend/App.tsx`](frontend/App.tsx).

## Scripts útiles

- Iniciar el proyecto en modo desarrollo:
  ```sh
  npm start
  ```
- Ejecutar en Android:
  ```sh
  npm run android
  ```
- Ejecutar en iOS:
  ```sh
  npm run ios
  ```
- Ejecutar en web:
  ```sh
  npm run web
  ```

## Notas

- El archivo [`frontend/app.json`](frontend/app.json) y [`frontend/assets`](frontend/assets) ya están configurados para Expo.
- Si usas el backend/functions, asegúrate de tener configurado Firebase Functions y Node.js compatible.

---

## Resumen de comandos

```sh
# Instalar Expo CLI globalmente (si no lo tienes)
npm install -g expo-cli

# Instalar dependencias del proyecto
npm install

# (Opcional) Instalar dependencias en backend/functions
cd backend/functions
npm install
cd ../../

# Iniciar el proyecto
npm start
```

---

npm install expo-image-picker


¡Listo! Con esto tu proyecto debería funcionar correctamente.