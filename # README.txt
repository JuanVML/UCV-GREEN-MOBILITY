1. Requisitos previos
Node.js v18 o superior / npm v9 o superior  : https://nodejs.org/es 
Git : https://git-scm.com/

2. Instalación rápida
# 1️⃣ Clona el repositorio desde GitHub
git clone https://github.com/JuanVML/UCV-GREEN-MOBILITY.git

Despues de esto si es la PC personal cambiar a tu rama para que no se afecte main que es el principal !!

EJEMPLO : git checkout JUANMUÑOZLOPEZ

# 2️⃣ Entra al proyecto
cd UCV-GREEN-MOBILITY

# 3️⃣ Instala todas las dependencias principales
npm install
npx expo install

3. Instalación de dependencias necesarias

🔹 3.1 Dependencias de Expo

npx expo install expo expo-font expo-status-bar expo-image-picker expo-linear-gradient expo-location @expo/vector-icons lottie-react-native @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack @react-navigation/stack react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens react-native-maps

🔹 3.2 Dependencias de npm

npm install @expo-google-fonts/poppins @mapbox/polyline polyline react-native-image-picker react-native-vector-icons

🔹 3.3 Dependencias de desarrollo (TypeScript + Tipos)

npm install --save-dev @types/react @types/react-native typescript

4. Ejecución en modo desarrollo : 

# Limpia la caché y ejecuta el servidor de desarrollo (Metro Bundler)

npx expo start -c (CON ESTE CODIGO SE TIENE QUE EJECUTAR EL PROYECTO)

---->>Opciones:

                Escanea el código QR con Expo Go


5. PARA CUANDO QUERAMOS YA TENER LA APP EN SI Y NO EMULARLO EN EXPO :

Generar e instalar el APK (sin usar Expo Go)

npx expo build:android -t apk

# O con el nuevo comando:

npx expo export --platform android

-------------------------------------------------------------------------------------------

ESTA PARTE SOLO ES PARA PROGRAMAR A MAIN NO TOCAR Y NO EJECUTAR ESTOS CODIGOS:
Cambia a la rama principal : git checkout main

Actualiza la rama main con lo último del repositorio remoto : git pull origin main

Fusiona tu rama con main : git merge JUANMUÑOZLOPEZ

Sube la rama main actualizada al remoto : git push origin main

------------------------------------------------------------------------------------------
PARA CUANDO QUIERAS GUARDAR LOS CAMBIOS EN TU RAMA RESPECTIVA :

1. FIJATE QUE ESTAS EN LA RAMA : git checkout (TU RAMA)

2 Guarda tus últimos cambios

git add .
git commit -m "Mis últimos cambios "

-----------------------------------------------------------------------------------------------

EN CASO TENGAS QUE CREAR UNA NUEVA RAMA DE EMERGENCIA POR ERRORES PERO EN TU PC CORRE :

Si deseas crear una nueva rama para tus pruebas o desarrollo:
EJEMPLO : 

git checkout -b AlbertLopez

git push origin AlbertLopez

    Luego puedes trabajar normalmente en esa rama, hacer tus commits y subirlos con:
    git add .
    git commit -m "Cambios desde la rama AlbertLopez"
    git push origin AlbertLopez


--------------------------------------------------------------------------------------------------------
en caso las pc de los laboratorios no dejen instalar ni npm:

y salga : “El archivo no se puede cargar porque la ejecución de scripts está deshabilitada en este sistema.”

Permitir ejecución de scripts - SOLUCION 

ejecuta PowerShell como administrador y ejecuta : Set-ExecutionPolicy RemoteSigned

Luego presiona:

S  (y Enter)

Reinicia tu terminal y ejecuta:

npm install -g expo-cli
 
Que son los pasos iniciales .....



👨‍💻 Autor : Juan Vicente Muñoz López

Proyecto: UCV-GREEN-MOBILITY
Desarrollador principal: Juan Vicente Muñoz López
Colaborador: Albert López / Brian Tolentino
Documentacion : Rony Huanachin