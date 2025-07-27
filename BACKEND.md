# CV Editor - Documentación

Este proyecto es un editor de CV simple y directo que funciona con tRPC y MongoDB, sin sistema de autenticación.

## Características

- ✅ **Editor directo**: No requiere login ni autenticación
- ✅ **Datos locales**: Usa Zustand store para gestión de estado
- ✅ **Backend opcional**: Puede guardar en MongoDB si se desea
- ✅ **Interfaz simple**: Página principal muestra el CV, `/admin` para editar

## Estructura del Backend

### Modelos de Base de Datos

#### CV (`Resume`)
- `firstName`, `lastName`: Nombre y apellido
- `name`, `nick`: Nombre completo y apodo
- `summary`: Resumen profesional
- `avatar`: URL del avatar
- `contact`: Información de contacto
- `experiences`: Array de experiencias laborales
- `educations`: Array de educación
- `skills`: Array de habilidades
- `projects`: Array de proyectos
- `technologies`: Array de tecnologías
- `contributions`: Array de contribuciones
- `about`: Secciones de "Acerca de"
- `locations`: Ubicaciones
- `languages`: Idiomas
- `characteristics`: Características
- `keywords`: Palabras clave
- `userId`: ID del usuario propietario (opcional)
- `isActive`: Si el CV está activo

### Rutas de API (tRPC)

#### CV (`/api/trpc/web.resume`)

**Todas las rutas son públicas - sin autenticación requerida**

- **`getByUserId`**: Obtener CVs de un usuario
- **`getAll`**: Obtener todos los CVs
- **`getById`**: Obtener CV específico
- **`create`**: Crear nuevo CV
- **`update`**: Actualizar CV completo
- **`delete`**: Eliminar CV (soft delete)

##### Actualizaciones Específicas

- **`updatePersonalInfo`**: Actualizar información personal
- **`updateContact`**: Actualizar información de contacto
- **`updateAbout`**: Actualizar sección "Acerca de"
- **`updateExperiences`**: Actualizar experiencias
- **`updateEducations`**: Actualizar educación
- **`updateSkills`**: Actualizar habilidades
- **`updateProjects`**: Actualizar proyectos
- **`updateTechnologies`**: Actualizar tecnologías
- **`updateContributions`**: Actualizar contribuciones

## Configuración

### Variables de Entorno

```bash
# MongoDB (opcional)
MONGODB_URI=mongodb+srv://tu-conexion-mongodb

# Next.js
NEXT_PUBLIC_URL=http://localhost:3000
```

## Uso del Sistema

### Flujo Simple

1. **Ve a `http://localhost:3000`** - Ver el CV
2. **Ve a `/admin`** - Editar el CV
3. **Los cambios se guardan automáticamente** en el store local
4. **Opcionalmente se pueden sincronizar** con MongoDB

### Uso del Store

```typescript
import { useResumeStore } from '../store/resume'

function MyComponent() {
  const { resume, updatePersonalInfo, updateContact } = useResumeStore()
  
  // Actualizar información
  updatePersonalInfo({
    firstName: 'Juan',
    lastName: 'Pérez'
  })
  
  return <div>{resume.name}</div>
}
```

### Uso del Backend (Opcional)

```typescript
import { trpc } from '@cv/trpc/react'

function BackendSync() {
  // Obtener CVs
  const { data: resumes } = trpc.web.resume.getAll.useQuery()
  
  // Crear CV
  const createResume = trpc.web.resume.create.useMutation()
  
  const handleCreate = async () => {
    await createResume.mutateAsync({
      firstName: 'Juan',
      lastName: 'Pérez',
      // ... resto de datos
    })
  }
  
  return <button onClick={handleCreate}>Crear CV</button>
}
```

## Desarrollo

### Comandos Útiles

```bash
# Iniciar desarrollo
pnpm web:dev

# Verificar tipos
pnpm type

# Build
pnpm web:build
```

### Estructura de Archivos

```
apps/web/
├── pages/
│   ├── index.tsx           # Página principal (ver CV)
│   ├── admin.tsx           # Editor de CV
│   └── api/trpc/[trpc].ts  # API de tRPC
├── components/
│   ├── organism/CV.tsx     # Componente principal del CV
│   └── molecules/          # Formularios de edición
├── store/
│   └── resume.ts           # Store de Zustand
└── users/
    └── default/index.ts    # Datos por defecto

packages/
├── trpc/
│   ├── server/router/web/resume.ts  # Rutas del backend
│   └── react/trpc.ts               # Cliente de React
└── mongodb/
    └── models/Resume.ts            # Modelo de MongoDB
```

## Sistema Actual

### ✅ **Funcionalidades Disponibles:**

- **Editor directo**: Sin login, acceso inmediato
- **Página principal**: Muestra el CV usando datos del store
- **Panel de administración**: `/admin` para editar todas las secciones
- **Datos locales**: Todo se guarda en Zustand store
- **Backend opcional**: Rutas tRPC disponibles si se necesita persistencia
- **Sin autenticación**: Sistema completamente abierto y simple

### 🎯 **Flujo de Usuario:**

1. **Usuario llega a la página** → Ve el CV inmediatamente
2. **Quiere editar** → Va a `/admin`
3. **Edita información** → Cambios se guardan automáticamente en el store
4. **Ve el resultado** → Vuelve a `/` para ver el CV actualizado

### 🚀 **Para usar:**

1. **Inicia el servidor**: `pnpm web:dev`
2. **Ve a `http://localhost:3000`**: Ver el CV
3. **Ve a `/admin`**: Editar el CV
4. **¡Listo!**: Sistema completamente funcional sin complicaciones

**El sistema ahora es un editor de CV simple, directo y sin autenticación. Perfecto para uso personal o demostraciones.**