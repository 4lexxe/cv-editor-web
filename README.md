# 📄 CV Builder

> **Plataforma para crear, gestionar y compartir currículums vitae de manera fácil y elegante.**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![tRPC](https://img.shields.io/badge/tRPC-10.0+-blue?style=flat-square&logo=trpc)](https://trpc.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Características

### 🎨 **Diseño Profesional**
- **Diseño responsive** optimizado para todos los dispositivos
- **Tema elegante** con tipografía profesional
- **Optimizado para impresión** con formato A4 perfecto
- **Interfaz intuitiva** y fácil de usar

### 🔗 **Enlaces Compartibles**
- **Genera enlaces únicos** para compartir tu CV
- **URLs personalizables** con IDs cortos y memorables
- **Control de expiración** configurable
- **Contador de visualizaciones** automático
- **SEO optimizado** para redes sociales

### 💾 **Gestión de Datos**
- **Almacenamiento local** con Zustand para edición rápida
- **Sincronización con MongoDB** para enlaces compartidos
- **Backup automático** de tus datos
- **Exportación** en múltiples formatos

### 🛠️ **Panel de Administración**
- **Editor visual** con vista previa en tiempo real
- **Secciones modulares**: Personal, Contacto, Experiencia, Educación, Habilidades, Proyectos
- **Carga de imágenes** para avatar y proyectos
- **Datos de ejemplo** para comenzar rápidamente

## 🚀 Instalación y Ejecución

### 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.0 o superior → [Descargar](https://nodejs.org/)
- **pnpm** 8.0 o superior → [Instalar pnpm](https://pnpm.io/installation)
- **MongoDB** (local o Atlas) → [MongoDB Community](https://www.mongodb.com/try/download/community) o [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** → [Descargar Git](https://git-scm.com/)

### 🔧 Instalación Paso a Paso

#### **1. Clonar el Repositorio**
```bash
# Clonar desde GitHub
git clone https://github.com/tu-usuario/cv-builder.git

# Entrar al directorio
cd cv-builder

# Verificar que estás en la rama correcta
git branch
```

#### **2. Instalar Dependencias**
```bash
# Instalar todas las dependencias del monorepo
pnpm install

# Verificar que se instalaron correctamente
pnpm list --depth=0
```

#### **3. Configurar Variables de Entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tu editor favorito
# Windows:
notepad .env

# macOS/Linux:
nano .env
# o
code .env
```

#### **4. Configurar MongoDB**

**Opción A: MongoDB Local**
```bash
# Instalar MongoDB Community Server
# Windows: Descargar desde https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Iniciar MongoDB
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod

# Verificar que MongoDB está corriendo
# Debería conectarse sin errores
mongosh
```

**Opción B: MongoDB Atlas (Recomendado)**
```bash
# 1. Crear cuenta en https://www.mongodb.com/atlas
# 2. Crear un cluster gratuito
# 3. Obtener la connection string
# 4. Agregar tu IP a la whitelist
# 5. Crear un usuario de base de datos
```

#### **5. Configurar el Archivo .env**
```bash
# Editar .env con tus configuraciones:

# Para MongoDB Local:
MONGODB_URI=mongodb://localhost:27017/cv-database

# Para MongoDB Atlas:
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cv-database?retryWrites=true&w=majority

# URL de la aplicación
NEXT_PUBLIC_URL=http://localhost:3000

# Opcional: Telegram (para notificaciones)
TELEGRAM_BOT=tu_bot_token_aqui
TELEGRAM_CHAT=tu_chat_id_aqui
```

### 🚀 Ejecutar la Aplicación

#### **Modo Desarrollo**
```bash
# Iniciar el servidor de desarrollo
pnpm web:dev

# La aplicación estará disponible en:
# http://localhost:3000
```

#### **Verificar que Todo Funciona**
```bash
# 1. Abrir navegador en http://localhost:3000
# 2. Deberías ver la página principal del CV
# 3. Ir a http://localhost:3000/admin para el panel de administración
# 4. Completar tu información personal
# 5. Ir a la pestaña "🔗 Generar Enlace" para probar la funcionalidad
```

### 🔍 Solución de Problemas Comunes

#### **Error: "Cannot connect to MongoDB"**
```bash
# Verificar que MongoDB está corriendo
# Local:
mongosh

# Atlas: Verificar connection string y whitelist de IP
# Ir a MongoDB Atlas → Network Access → Add IP Address
```

#### **Error: "pnpm command not found"**
```bash
# Instalar pnpm globalmente
npm install -g pnpm

# O usar npx
npx pnpm install
```

#### **Error: "Port 3000 is already in use"**
```bash
# Usar un puerto diferente
PORT=3001 pnpm web:dev

# O matar el proceso que usa el puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

#### **Error: "Module not found"**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# O limpiar cache de Next.js
rm -rf .next
pnpm web:dev
```

### 🏗️ Comandos de Desarrollo

```bash
# Desarrollo
pnpm web:dev              # Servidor de desarrollo
pnpm web:build            # Build de producción
pnpm web:start            # Servidor de producción

# Calidad de código
pnpm lint                 # Verificar código con ESLint
pnpm lint:fix             # Arreglar errores automáticamente
pnpm type                 # Verificar tipos TypeScript
pnpm format               # Formatear con Prettier

# Monorepo
pnpm build                # Build de todos los packages
pnpm clean                # Limpiar builds y cache
pnpm dev                  # Desarrollo de todos los packages
```

### 📱 Acceder a la Aplicación

Una vez que el servidor esté corriendo:

```bash
# Página principal (CV público)
http://localhost:3000

# Panel de administración
http://localhost:3000/admin

# Página de login (si implementas autenticación)
http://localhost:3000/login

# Ejemplo de CV compartido
http://localhost:3000/share/abc123def456
```

### Variables de Entorno

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/cv-database
# o para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cv-database

# Next.js
NEXT_PUBLIC_URL=http://localhost:3000

# Opcional: Telegram Bot (para notificaciones)
TELEGRAM_BOT=tu_bot_token
TELEGRAM_CHAT=tu_chat_id
```

## 📖 Uso

### 1. **Crear tu CV**
```bash
# Ir al panel de administración
http://localhost:3000/admin

# Completar las secciones:
# - Información Personal
# - Contacto  
# - Acerca de Mí
# - Experiencia Laboral
# - Educación
# - Habilidades
# - Proyectos
```

### 2. **Generar Enlace Compartible**
```bash
# En el panel de admin, ir a "🔗 Generar Enlace"
# Configurar título, descripción y expiración
# Obtener enlace único: https://tu-dominio.com/share/abc123
```

### 3. **Compartir tu CV**
```bash
# El enlace se puede compartir en:
# - LinkedIn (sección de contacto)
# - Email (firma profesional)  
# - Redes sociales (bio)
# - Aplicaciones de trabajo
# - Tarjetas de presentación (QR)
```

## 🏗️ Arquitectura

### **Monorepo con Turbo**
```
cv-builder/
├── apps/
│   └── web/                 # Aplicación Next.js principal
├── packages/
│   ├── config/             # Configuraciones compartidas
│   ├── lib/                # Utilidades compartidas
│   ├── mongodb/            # Modelos y conexión a DB
│   ├── trpc/               # API con tRPC
│   ├── types/              # Tipos TypeScript
│   └── tsconfig/           # Configuraciones TS
```

### **Stack Tecnológico**

#### **Frontend**
- **Next.js 15** - Framework React con SSR
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Zustand** - Gestión de estado
- **React Hook Form** - Manejo de formularios

#### **Backend**
- **tRPC** - API type-safe
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Zod** - Validación de esquemas

#### **DevOps**
- **Turbo** - Monorepo y build system
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Husky** - Git hooks

## 📁 Estructura del Proyecto

### **Aplicación Web (`apps/web/`)**
```
apps/web/
├── components/
│   ├── atoms/              # Componentes básicos
│   ├── molecules/          # Componentes compuestos
│   └── organism/           # Componentes complejos
├── pages/
│   ├── admin.tsx           # Panel de administración
│   ├── share/[shareId].tsx # Visualización de CVs compartidos
│   └── index.tsx           # Página principal
├── store/                  # Estado global con Zustand
├── types/                  # Tipos específicos de la app
└── utils/                  # Utilidades y helpers
```

### **Packages**
```
packages/
├── mongodb/
│   ├── models/             # Modelos de Mongoose
│   └── dbConnect.ts        # Conexión a MongoDB
├── trpc/
│   ├── server/             # Configuración del servidor
│   └── react/              # Cliente React
└── types/                  # Tipos compartidos
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm web:dev              # Iniciar app en desarrollo
pnpm web:build            # Build de producción
pnpm web:start            # Iniciar app en producción

# Calidad de código
pnpm lint                 # Ejecutar ESLint
pnpm type                 # Verificar tipos TypeScript
pnpm format               # Formatear código con Prettier

# Base de datos
pnpm db:seed              # Poblar DB con datos de ejemplo
pnpm db:reset             # Resetear base de datos
```

## 🌐 Despliegue

### **Vercel (Recomendado)**
```bash
# Conectar con Vercel
vercel

# Configurar variables de entorno en Vercel dashboard
# Desplegar
vercel --prod
```

### **Docker**
```bash
# Build de la imagen
docker build -t cv-builder .

# Ejecutar contenedor
docker run -p 3000:3000 cv-builder
```

### **Variables de Entorno en Producción**
```bash
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_URL=https://tu-dominio.com
NODE_ENV=production
```

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

### **Guías de Contribución**
- Seguir las convenciones de código existentes
- Agregar tests para nuevas funcionalidades
- Actualizar documentación cuando sea necesario
- Usar commits descriptivos

## 📝 Roadmap

### **v1.1 - Próximas Funcionalidades**
- [ ] **Temas personalizables** para CVs
- [ ] **Exportación a PDF** nativa
- [ ] **Múltiples idiomas** de interfaz
- [ ] **Dashboard de analytics** detallado
- [ ] **API pública** para integraciones

### **v1.2 - Funcionalidades Avanzadas**
- [ ] **Colaboración en tiempo real**
- [ ] **Templates prediseñados**
- [ ] **Integración con LinkedIn**
- [ ] **Sistema de comentarios**
- [ ] **Versioning de CVs**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Next.js** por el excelente framework
- **Vercel** por el hosting gratuito
- **MongoDB** por la base de datos
- **Tailwind CSS** por los estilos
- **tRPC** por la API type-safe

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

[🌐 Demo en Vivo](https://tu-dominio.com) • [📖 Documentación](./BACKEND.md) • [🐛 Reportar Bug](https://github.com/tu-usuario/cv-builder/issues)

</div>