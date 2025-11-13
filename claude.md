# Guía de Desarrollo - CR Dental Studio

> Documentación actualizada: Noviembre 2024

## 📋 Auto-revisión antes de presentar

1. ✅ `npm run build` - sin errores
2. ✅ No usar `any` types (o justificar su uso temporal)
3. ✅ Código sigue principios SOLID
4. ✅ Commits descriptivos siguiendo convenciones
5. ✅ Archivos modificados documentados en commit
6. ✅ Testing manual en desarrollo local (si es posible) o Vercel

---

## 🎯 Principios de Desarrollo

### SOLID
- **S**ingle Responsibility: Cada componente/función tiene UNA responsabilidad
- **O**pen/Closed: Abierto a extensión, cerrado a modificación
- **L**iskov Substitution: Interfaces consistentes
- **I**nterface Segregation: No forzar implementaciones innecesarias
- **D**ependency Inversion: Depender de abstracciones, no de implementaciones concretas

### Otros Principios
- **DRY** (Don't Repeat Yourself): Reutilizar código en componentes/funciones
- **KISS** (Keep It Simple, Stupid): Soluciones simples y directas
- **TypeScript estricto**: Evitar `any`, tipar correctamente
- **Separation of Concerns**: UI, lógica de negocio, y datos separados

---

## 🛠️ Stack Tecnológico

### Framework y Lenguaje
- **Next.js 16.0.1** con App Router y Turbopack
- **TypeScript** en modo estricto
- **Node.js 18+**

### Base de Datos
- **PostgreSQL** (Vercel Postgres en producción)
- **Prisma ORM 6.19.0**
- Migraciones manejadas por Prisma

### Estilos y UI
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes base
- **Lucide React** para iconos
- Diseño responsive (mobile-first)

### Autenticación
- **NextAuth.js v5** (actualmente deshabilitado)
- Auto-login como Dra. Catalina (admin)
- `/login` redirige a `/dashboard`

### Utilidades
- **date-fns** para manejo de fechas (con locale español)
- **Sonner** para notificaciones toast
- **React Hook Form + Zod** para formularios (donde aplique)

---

## 📁 Estructura del Proyecto

```
cr-dental-studio/
├── app/                           # App Router de Next.js
│   ├── (dashboard)/              # Rutas protegidas del dashboard
│   │   ├── layout.tsx           # Layout con Sidebar y Header
│   │   ├── dashboard/           # Página principal con KPIs
│   │   ├── ventas/              # Módulo de ventas
│   │   │   └── nueva/          # Formulario nueva venta
│   │   ├── clientes/           # Gestión de pacientes
│   │   │   └── patients-table.tsx  # Tabla con CRUD inline
│   │   ├── compras/            # Compras y gastos
│   │   │   ├── nueva/         # Formulario nueva compra
│   │   │   └── nuevo-gasto/   # Formulario nuevo gasto
│   │   ├── proveedores/       # CRUD de proveedores
│   │   ├── inventario/        # Control de stock
│   │   ├── cuentas-por-cobrar/ # Planes de pago
│   │   ├── pyg/               # Estado de resultados
│   │   ├── integraciones/     # Alegra, OpenAI
│   │   ├── usuarios/          # Gestión de usuarios
│   │   └── configuracion/     # Config del consultorio
│   ├── api/                      # API Routes
│   │   ├── patients/            # CRUD pacientes
│   │   │   ├── route.ts        # GET, POST
│   │   │   └── [id]/route.ts   # PUT, DELETE
│   │   ├── proveedores/         # CRUD proveedores
│   │   ├── ventas/              # API ventas
│   │   ├── compras/             # API compras
│   │   └── gastos/              # API gastos
│   ├── login/                    # Página de login (redirige)
│   └── page.tsx                  # Root (redirige a dashboard)
├── components/                   # Componentes reutilizables
│   ├── layouts/                 # Sidebar, Header
│   ├── ventas/                  # Componentes de ventas
│   ├── compras/                 # Componentes de compras
│   └── ui/                      # shadcn/ui components
├── lib/                          # Utilidades y configuraciones
│   ├── auth.ts                  # Auto-login simplificado
│   ├── prisma.ts                # Cliente Prisma singleton
│   ├── services/                # Servicios de negocio
│   └── constants/               # Constantes (tratamientos, etc)
├── prisma/                       # Schema y seed
│   ├── schema.prisma            # Modelos de base de datos
│   └── seed.ts                  # Datos iniciales
├── types/                        # Tipos TypeScript
├── proxy.ts                      # Middleware de redirección
├── CLAUDE.md                     # Este archivo
├── CHANGELOG.md                  # Registro de cambios
└── README.md                     # Documentación general
```

---

## 🗄️ Modelos Principales de Base de Datos

### Patient (Clientes/Pacientes)
```prisma
model Patient {
  id           String   @id @default(cuid())
  document     String   @unique
  fullName     String
  gender       String?  // "M" o "F"
  birthDate    DateTime?
  phone        String
  email        String?
  address      String?
  eps          String?
  notes        String?
  sales        Sale[]
  paymentPlans PaymentPlan[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Supplier (Proveedores)
```prisma
model Supplier {
  id        String     @id @default(cuid())
  name      String
  phone     String?
  email     String?
  purchases Purchase[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

### Sale (Ventas)
```prisma
model Sale {
  id              String   @id @default(cuid())
  date            DateTime
  patientId       String
  treatment       String
  amount          Float
  paymentMethod   String   // efectivo, tarjeta, transferencia, nequi
  status          String   // completada, pendiente
  source          String   @default("manual")  // "alegra" o "manual"
  alegraInvoiceId String?  // ID de factura en Alegra
  patient         Patient  @relation(fields: [patientId], references: [id])
  createdAt       DateTime @default(now())
}
```

**Lógica de source:**
- Si `paymentMethod === "efectivo"` → `source = "manual"`
- Si `paymentMethod !== "efectivo"` → `source = "alegra"`

### Purchase (Compras)
```prisma
model Purchase {
  id            String         @id @default(cuid())
  date          DateTime
  supplierId    String
  invoiceNumber String
  category      String         // Puede ser personalizado si seleccionan "Otros"
  totalAmount   Float
  supplier      Supplier       @relation(fields: [supplierId], references: [id])
  items         PurchaseItem[]
  createdAt     DateTime       @default(now())
}

model PurchaseItem {
  id         String   @id @default(cuid())
  purchaseId String
  productName String
  quantity   Int
  unit       String   // unidad, caja, paquete, etc
  unitPrice  Float
  total      Float
  purchase   Purchase @relation(fields: [purchaseId], references: [id], onDelete: Cascade)
}
```

### Expense (Gastos)
```prisma
model Expense {
  id          String   @id @default(cuid())
  date        DateTime
  category    String   // Puede ser personalizado si seleccionan "Otros"
  description String
  amount      Float
  frequency   String   // unico, mensual, anual
  status      String   // pagado, pendiente, vencido
  createdAt   DateTime @default(now())
}
```

---

## 🎨 Patrones de Diseño Establecidos

### 1. Formularios Inline
**Patrón:** Formulario aparece/desaparece en la misma página (no modal)

**Ejemplo:** Proveedores, Clientes

```tsx
const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);

// Botón para mostrar/ocultar
<Button onClick={() => setShowForm(!showForm)}>
  <Plus className="w-4 h-4 mr-2" />
  Agregar
</Button>

// Formulario condicional
{showForm && (
  <Card>
    <CardContent>
      <form onSubmit={handleSubmit}>
        {/* campos */}
      </form>
    </CardContent>
  </Card>
)}
```

### 2. CRUD con Endpoints Dinámicos (Next.js 16)

**IMPORTANTE:** En Next.js 16, `params` es una Promise.

```typescript
// ❌ INCORRECTO (Next.js 15)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.model.update({ where: { id: params.id } });
}

// ✅ CORRECTO (Next.js 16)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.model.update({ where: { id } });
}
```

### 3. Categorías Personalizables

**Patrón:** Lista predefinida + opción "Otros" con campo personalizable

```tsx
const [formData, setFormData] = useState({
  category: "",
  customCategory: "",
});

<select
  value={formData.category}
  onChange={(e) => setFormData({
    ...formData,
    category: e.target.value,
    customCategory: "" // Reset cuando cambia categoría
  })}
>
  <option value="">Seleccionar</option>
  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
</select>

{/* Mostrar input si selecciona "Otros" */}
{formData.category === "Otros" && (
  <Input
    placeholder="Especificar categoría"
    value={formData.customCategory}
    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
    required
  />
)}

// Al guardar:
const finalCategory = formData.category === "Otros"
  ? formData.customCategory
  : formData.category;
```

### 4. Botones de Creación Rápida

**Patrón:** Link que abre en nueva pestaña para crear entidades relacionadas

```tsx
<div className="flex items-center justify-between">
  <Label htmlFor="supplier">Proveedor</Label>
  <Link href="/proveedores" target="_blank">
    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs">
      <Plus className="mr-1 h-3 w-3" />
      Nuevo Proveedor
    </Button>
  </Link>
</div>
```

### 5. Notificaciones Toast

```tsx
import { toast } from "sonner";

// Éxito
toast.success("Registro creado exitosamente");

// Error
toast.error("Error al guardar registro");

// Con callback después de acción
const handleDelete = async (id: string) => {
  if (!confirm("¿Estás seguro?")) return;

  try {
    await fetch(`/api/endpoint/${id}`, { method: "DELETE" });
    toast.success("Eliminado exitosamente");
    fetchData(); // Recargar datos
  } catch (error) {
    toast.error("Error al eliminar");
  }
};
```

### 6. Formateo de Moneda Colombiana

```tsx
// Formatear para display
const formatted = amount.toLocaleString("es-CO");
// Resultado: 1.500.000

// Con símbolo
`$${amount.toLocaleString("es-CO")}`
// Resultado: $1.500.000

// Formateo en input
const formatCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  return new Intl.NumberFormat("es-CO").format(parseInt(numericValue));
};
```

### 7. Fechas con date-fns (Español)

```tsx
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// Formato relativo
formatDistanceToNow(new Date(lastSync), {
  addSuffix: true,
  locale: es,
});
// Resultado: "hace 20 minutos"

// Fecha simple
const today = new Date().toISOString().split("T")[0];
// Formato: YYYY-MM-DD para inputs tipo date
```

---

## 🔑 Decisiones de Diseño Importantes

### 1. Auto-Login vs Sistema de Autenticación
**Decisión:** Auto-login como Dra. Catalina
**Razón:** Uso personal, elimina fricción innecesaria
**Archivos:** `lib/auth.ts`, `proxy.ts`

### 2. Secciones Dedicadas vs Modales
**Decisión:** Secciones dedicadas para entidades que crecerán (Proveedores, Clientes)
**Razón:** "Esto luego crecerá y debemos prepararnos" - escalabilidad
**Ejemplo:** `/proveedores` en lugar de modal en `/compras`

### 3. Ventas Alegra vs Manual
**Decisión:** Campo `source` en ventas con filtros separados
**Razón:** Necesidad de diferenciar ventas formales (facturadas) de informales (efectivo/amigos)
**Impacto:** Reportes más precisos, cumplimiento tributario

### 4. Categorías Flexibles
**Decisión:** Opción "Otros" + campo personalizable en lugar de lista cerrada
**Razón:** Negocio dinámico, nuevas necesidades surgen constantemente
**Implementado en:** Compras, Gastos

---

## 🚨 Problemas Comunes y Soluciones

### Problema: Prisma no conecta a DB local
**Error:** `Can't reach database server at localhost:5432`
**Solución:** No ejecutar migraciones localmente. El proyecto usa PostgreSQL en Vercel. Solo hacer push a GitHub y dejar que Vercel maneje las migraciones.

### Problema: TypeScript error en params de rutas dinámicas
**Error:** `Type 'typeof import("...")' does not satisfy the constraint 'RouteHandler'`
**Solución:** Usar `Promise<{ id: string }>` en lugar de `{ id: string }` (Next.js 16)

### Problema: Campos opcionales en formularios
**Solución:** Enviar `null` en lugar de string vacío
```tsx
const body = {
  requiredField: formData.field,
  optionalField: formData.optional || null,
};
```

### Problema: Fechas en formularios
**Formato:** Inputs `type="date"` usan formato ISO (YYYY-MM-DD)
```tsx
// Para display inicial
const [formData, setFormData] = useState({
  date: new Date().toISOString().split("T")[0],
});

// Al enviar a API
const body = {
  date: new Date(formData.date), // Convierte a DateTime
};
```

---

## 📝 Convenciones de Commits

```bash
# Formato
<tipo>: <descripción corta>

<descripción detallada>
- Punto 1
- Punto 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `refactor`: Refactorización sin cambio funcional
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan código)
- `test`: Agregar o modificar tests

**Ejemplo:**
```
Agregar gestión de proveedores y mejorar formularios

- Crear sección dedicada de Proveedores con CRUD completo
- Agregar botón "+ Nuevo Proveedor" en formulario Nueva Compra
- Implementar campo personalizable "Otros" en categorías
```

---

## 🎯 Flujo de Trabajo Típico

### Para agregar una nueva funcionalidad:

1. **Analizar requerimiento**
   - Entender necesidad del negocio
   - Identificar modelos de datos afectados
   - Verificar si hay patrones existentes

2. **Actualizar Schema (si aplica)**
   ```bash
   # Editar prisma/schema.prisma
   # NO ejecutar migrate localmente
   # Push a GitHub → Vercel migra automáticamente
   ```

3. **Crear/Modificar API Endpoints**
   - Usar patrones establecidos (Promise params)
   - Validar datos de entrada
   - Manejar errores apropiadamente

4. **Crear/Modificar UI**
   - Seguir patrones de formularios inline
   - Usar componentes de shadcn/ui
   - Implementar loading states
   - Agregar notificaciones toast

5. **Commit y Push**
   - Commit descriptivo
   - Push a GitHub
   - Vercel despliega automáticamente

6. **Verificar en Producción**
   - Probar funcionalidad en Vercel
   - Verificar que migraciones se aplicaron
   - Confirmar que todo funciona

---

## 📚 Referencias Rápidas

### Categorías Predefinidas

**Compras:**
- Material Restaurador, Anestesia, Bioseguridad, Instrumental Rotatorio
- Medicamentos, Endodoncia, Periodoncia, Material de Impresión
- Estética, Radiología, Sutura, Material Consumible
- Profilaxis, Desinfección, Otros

**Gastos:**
- Nómina, Arriendo, Servicios Públicos, Aseo y Mantenimiento
- Marketing y Publicidad, Impuestos y Contribuciones
- Seguros, Otros

**Unidades (Compras):**
- unidad, caja, paquete, litro, kilogramo
- carpule, frasco, jeringa, bolsa, kit

**Métodos de Pago:**
- efectivo (→ manual), tarjeta (→ alegra)
- transferencia (→ alegra), nequi (→ alegra)

---

## ⚠️ Notas Importantes

1. **NO ejecutar migraciones Prisma localmente** - Vercel las maneja
2. **Siempre usar Promise en params** de rutas dinámicas (Next.js 16)
3. **Confirmar antes de eliminar** - UX importante
4. **Toast en todas las acciones** - Feedback al usuario
5. **Campos opcionales = null**, no string vacío
6. **Auto-login activo** - No hay sistema de login real
7. **PostgreSQL en producción** - No SQLite
8. **Commits descriptivos** - Facilita entender cambios futuros

---

## 🔄 Próxima Sesión

Al retomar el proyecto:
1. Revisar este archivo CLAUDE.md
2. Revisar CHANGELOG.md para cambios recientes
3. Verificar estado en Vercel
4. Continuar desde donde se quedó
