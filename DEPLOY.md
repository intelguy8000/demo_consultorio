# 🚀 Guía de Despliegue en Vercel

## ✅ Pre-requisitos Completados

- ✅ Schema actualizado a PostgreSQL
- ✅ Dependencias de Vercel Postgres instaladas
- ✅ Scripts de build configurados
- ✅ Archivos de configuración creados

---

## 📋 Pasos para Desplegar

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Login en Vercel

```bash
vercel login
```

### 3. Link del Proyecto

```bash
vercel link
```

Responde las preguntas:
- **Set up and deploy?** → Y
- **Which scope?** → Tu cuenta personal
- **Link to existing project?** → N
- **What's your project's name?** → cr-dental-studio
- **In which directory is your code located?** → ./

### 4. Crear Base de Datos Postgres

```bash
vercel postgres create
```

Responde:
- **Database name?** → cr-dental-studio-db
- **Region?** → Elige la más cercana (iad1 para US East)

Vercel automáticamente configurará las variables de entorno:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### 5. Configurar Variables de Entorno Adicionales

```bash
# Generar secreto aleatorio para NextAuth
openssl rand -base64 32
```

En el dashboard de Vercel (https://vercel.com), ve a tu proyecto → Settings → Environment Variables:

Agrega:
- **NEXTAUTH_SECRET** = `[el secreto generado arriba]`
- **NEXTAUTH_URL** = `https://cr-dental-studio.vercel.app` (o tu dominio personalizado)

### 6. Ejecutar Migraciones en la Base de Datos

```bash
# Conectarse a la base de datos de Vercel
vercel env pull .env.production

# Ejecutar migraciones (esto creará las tablas)
npx prisma migrate deploy --preview-feature

# O ejecutar directamente con db push
npx prisma db push
```

### 7. Poblar Base de Datos (Seed)

```bash
# Ejecutar seed
npm run seed
```

### 8. Desplegar

```bash
vercel --prod
```

---

## 🔄 Alternativa: Despliegue desde GitHub

### 1. Crear Repositorio en GitHub

```bash
git init
git add .
git commit -m "feat: CR Dental Studio completo"
git branch -M main
git remote add origin https://github.com/tu-usuario/cr-dental-studio.git
git push -u origin main
```

### 2. Importar en Vercel

1. Ve a https://vercel.com/new
2. Selecciona tu repositorio de GitHub
3. **Framework Preset**: Next.js
4. **Root Directory**: ./
5. Click **Deploy**

### 3. Configurar Base de Datos

En el dashboard del proyecto:
1. **Storage** → **Create Database** → **Postgres**
2. Nombre: `cr-dental-studio-db`
3. Vercel automáticamente agrega las variables de entorno

### 4. Agregar Variables de Entorno

Settings → Environment Variables:
- **NEXTAUTH_SECRET** = `[secreto generado]`
- **NEXTAUTH_URL** = `https://tu-dominio.vercel.app`

### 5. Redeploy

Haz un nuevo commit o click en **Redeploy** en el dashboard.

### 6. Ejecutar Seed

En tu terminal local:
```bash
# Pull de variables de producción
vercel env pull .env.production

# Ejecutar seed
npm run seed
```

---

## ✅ Verificar Despliegue

1. **Abrir URL**: `https://cr-dental-studio.vercel.app`
2. **Login con credenciales del seed**:
   - Admin: `dra.catalina@crdentalstudio.com` / `Admin123!`
   - Asistente: `maria@crdentalstudio.com` / `Asistente123!`
   - Readonly: `juan@crdentalstudio.com` / `Lectura123!`

---

## 🔧 Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs

# Ver variables de entorno
vercel env ls

# Pull de variables de entorno
vercel env pull

# Abrir dashboard de Vercel
vercel

# Eliminar despliegue
vercel remove cr-dental-studio
```

---

## 🐛 Troubleshooting

### Error: "Prisma Client not found"
```bash
# Regenerar cliente de Prisma
npx prisma generate
vercel --prod
```

### Error: "Database connection failed"
```bash
# Verificar que las variables de entorno estén configuradas
vercel env ls

# Verificar conexión
npx prisma db pull
```

### Error: "Migration failed"
```bash
# Resetear base de datos (CUIDADO: Borra todo)
npx prisma migrate reset

# O ejecutar manualmente
npx prisma db push --accept-data-loss
```

---

## 📊 Monitoreo Post-Despliegue

1. **Performance**: Vercel Analytics (automático)
2. **Errors**: Vercel Logs
3. **Database**: Vercel Postgres Dashboard → Insights

---

## 🎯 Siguiente Pasos (Opcionales)

- [ ] Configurar dominio personalizado
- [ ] Configurar OpenAI API para chat real
- [ ] Configurar integración real con Alegra
- [ ] Configurar emails transaccionales
- [ ] Configurar backups automáticos de DB

---

¡Listo! Tu aplicación debería estar funcionando en producción 🎉
