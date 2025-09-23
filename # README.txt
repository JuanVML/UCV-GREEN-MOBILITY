# UCV-GREEN-MOBILITY - Guía de Instalación y Uso

---

## 1. Requisitos previos

- [Node.js](https://nodejs.org/) **v18 o superior**
- [npm](https://www.npmjs.com/) **v9 o superior**
- [Git](https://git-scm.com/)
- **NO necesitas instalar Expo CLI globalmente** (usa siempre `npx expo ...`)

---

## 2. Instalación rápida (para clonar en cualquier PC)

```sh
# 1. Clona el repositorio
git clone 
cd UCV-GREEN-MOBILITY

# 2. Instala las dependencias principales
npm install
```

---

## 3. Dependencias necesarias

1️⃣ Instala dependencias de Expo
npx expo install expo expo-font expo-status-bar expo-image-picker expo-linear-gradient expo-location @expo/vector-icons lottie-react-native @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack @react-navigation/stack react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens react-native-maps

2️⃣ Instala dependencias con npm

npm install @expo-google-fonts/poppins @mapbox/polyline polyline react-native-image-picker react-native-vector-icons


3️⃣ Dependencias de desarrollo (TypeScript + tipos)

npm install --save-dev @types/react @types/react-native typescript



## 4. Cómo emular la app en modo desarrollo

# Limpia el caché y arranca el servidor de desarrollo (Metro Bundler)
npx expo start -c

- Escanea el QR con **Expo Go** solo si NO usas módulos nativos extra.
- Si usas mapas u otros módulos nativos, sigue el siguiente apartado.

---

## 5. Cómo generar e instalar el APK en tu celular (sin usar Expo Go)


# 1. Genera un build nativo de desarrollo e instala en tu dispositivo Android conectado por USB:
npx expo run:android

# 2. Si quieres generar un APK para instalar manualmente:
npx expo build:android -t apk
# O con el nuevo CLI:
npx expo export --platform android
# El APK estará en la carpeta 'dist' o te dará un enlace de descarga.
```
> **Nota:** Para builds de producción, debes tener una cuenta en Expo y seguir las instrucciones que te da el comando.

---

## 6. Notas importantes

- **No uses Expo Go** si tu app usa mapas u otros módulos nativos extra.
- Si tienes errores de dependencias, ejecuta `npm install` y luego `npx expo install` para asegurarte de que todo esté alineado.
- Si cambias de PC o clonas el proyecto, solo necesitas `npm install` y luego seguir los pasos de arriba.

---