# MovilShare - Compartir Viajes en Bicicleta

## Descripción

MovilShare es una pantalla que permite a los usuarios encontrar y conectarse con otros ciclistas para compartir rutas y viajes. La implementación actual muestra una interfaz que replica el diseño propuesto con datos mock que serán reemplazados por el backend.

## Estructura de Archivos

### Pantallas
- `src/screens/MoviShare.tsx` - Pantalla principal de MovilShare

### Componentes Reutilizables
- `src/components/MovilShareHeader.tsx` - Header personalizado con navegación y avatar
- `src/components/UserShareCard.tsx` - Tarjeta de usuario con información de viaje

### Hooks
- `src/hooks/useMovilShare.ts` - Hook personalizado para manejar lógica de datos

### Tipos
- `src/types/movilshare.ts` - Interfaces TypeScript para tipado

## Funcionalidades Implementadas

### ✅ Completas
- [x] Interfaz visual que replica el diseño propuesto
- [x] Header con flecha de regreso y avatar del usuario
- [x] Lista de usuarios con información de viaje
- [x] Cards interactivas con datos de usuario
- [x] Botón "Crear punto" en la parte inferior
- [x] Estados de carga y error
- [x] Componentes reutilizables
- [x] Tipado TypeScript
- [x] Consistencia con el theme del proyecto

### ⏳ Pendientes (Backend)
- [ ] Integración con API real de usuarios
- [ ] Sistema de autenticación
- [ ] Funcionalidad de "Crear punto de encuentro"
- [ ] Sistema de matching de rutas
- [ ] Chat entre usuarios
- [ ] Notificaciones push
- [ ] Geolocalización en tiempo real
- [ ] Sistema de calificaciones

## Datos Mock

Actualmente se usan datos estáticos en `useMovilShare.ts`:

```typescript
const mockUsers = [
  {
    id: '1',
    name: 'Fabrizzio Medina',
    location: 'Puerta Principal', 
    time: '7:30 am',
    avatar: require('../../assets/images/user1.png')
  },
  // ... más usuarios
];
```

## Arquitectura del Backend Requerida

### APIs Necesarias

1. **GET /api/movilshare/users**
   - Obtener lista de usuarios disponibles para compartir viaje
   - Filtros por ubicación y horario
   
2. **POST /api/movilshare/meeting-point**
   - Crear nuevo punto de encuentro
   - Incluir ubicación, horario, capacidad
   
3. **POST /api/movilshare/join/{userId}**
   - Unirse a un usuario para compartir viaje
   - Crear chat/conversación
   
4. **GET /api/movilshare/my-connections**
   - Obtener conexiones activas del usuario

### Base de Datos

```sql
-- Tabla de puntos de encuentro
CREATE TABLE meeting_points (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  location VARCHAR(255),
  time TIMESTAMP,
  max_participants INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de participantes en puntos de encuentro  
CREATE TABLE meeting_participants (
  id UUID PRIMARY KEY,
  meeting_point_id UUID REFERENCES meeting_points(id),
  user_id UUID REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT NOW()
);
```

## Uso de Componentes

### MovilShareHeader
```tsx
<MovilShareHeader 
  title="MovilShare"
  onGoBack={handleGoBack}
  onAvatarPress={handleAvatarPress}
/>
```

### UserShareCard
```tsx
<UserShareCard
  id={user.id}
  name={user.name}
  location={user.location}
  time={user.time}
  avatar={user.avatar}
  onPress={handleUserPress}
/>
```

### Hook useMovilShare
```tsx
const { 
  users, 
  isLoading, 
  error, 
  joinUser, 
  createMeetingPoint 
} = useMovilShare();
```

## Próximos Pasos

1. **Implementar Backend API**
   - Crear endpoints para gestión de usuarios y puntos de encuentro
   - Implementar sistema de autenticación
   - Agregar base de datos

2. **Funcionalidades Avanzadas**
   - Sistema de chat integrado
   - Geolocalización en tiempo real  
   - Algoritmo de matching por rutas similares
   - Sistema de notificaciones

3. **Mejoras de UX/UI**
   - Animaciones de transición
   - Pull-to-refresh
   - Filtros de búsqueda
   - Modal para crear punto de encuentro

## Tecnologías Utilizadas

- **React Native** - Framework de desarrollo móvil
- **TypeScript** - Tipado estático
- **Expo Vector Icons** - Iconografía
- **React Navigation** - Navegación entre pantallas
- **Custom Hooks** - Lógica reutilizable
- **Theme System** - Consistencia visual

## Notas para el Desarrollador

- Todos los TODOs están marcados en el código para facilitar la implementación del backend
- La estructura está preparada para recibir datos reales sin cambios mayores en la UI
- Los componentes son completamente reutilizables y pueden usarse en otras partes de la app
- El hook personalizado centraliza la lógica de datos para facilitar la migración al backend