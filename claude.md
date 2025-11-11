# Auto-revisión antes de presentar:

1. ✅ `npm run build` - sin errores
2. ✅ No usar `any` types
3. ✅ Código sigue SOLID
4. ✅ Commits descriptivos

## Principios de Desarrollo

- **SOLID**: Cada componente debe tener una única responsabilidad
- **DRY**: No repetir código, crear componentes reutilizables
- **KISS**: Mantener las soluciones simples y directas
- **TypeScript estricto**: Evitar el uso de `any`, tipar correctamente

## Stack Tecnológico

- Next.js 14 con App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- SQLite
- NextAuth.js v5

## Estructura del Proyecto

```
cr-dental-studio/
├── app/                    # App Router de Next.js
│   ├── (dashboard)/       # Rutas protegidas del dashboard
│   ├── api/               # API routes
│   └── login/             # Página de login
├── components/            # Componentes reutilizables
│   ├── layouts/          # Layouts (Sidebar, Header)
│   └── ui/               # Componentes de shadcn/ui
├── lib/                   # Utilidades y configuraciones
├── prisma/               # Schema y migraciones de Prisma
└── types/                # Definiciones de tipos TypeScript
```
