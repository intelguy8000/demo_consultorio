/**
 * Catálogo de tratamientos dentales de CR Dental Studio
 * Basado en los servicios ofrecidos por la clínica
 */

export interface Treatment {
  nombre: string;
  categoria: string;
  precio: number;
  descripcion?: string;
}

export const TRATAMIENTOS_DENTALES: Treatment[] = [
  // ESTÉTICA DENTAL
  {
    nombre: "Lentes Cerámicos",
    categoria: "Estética",
    precio: 2500000,
    descripcion: "Carillas ultrafinas de cerámica para mejorar la apariencia dental",
  },
  {
    nombre: "Diseño de Sonrisa",
    categoria: "Estética",
    precio: 3500000,
    descripcion: "Planificación completa para transformación estética dental",
  },
  {
    nombre: "Armonización de Sonrisa",
    categoria: "Estética",
    precio: 1800000,
    descripcion: "Tratamiento para equilibrar y armonizar la sonrisa",
  },
  {
    nombre: "Blanqueamiento Dental",
    categoria: "Estética",
    precio: 450000,
    descripcion: "Tratamiento para aclarar el tono de los dientes",
  },

  // CIRUGÍA Y PROCEDIMIENTOS FACIALES
  {
    nombre: "Recorte de Encía",
    categoria: "Cirugía",
    precio: 800000,
    descripcion: "Gingivectomía para corregir sonrisa gingival",
  },
  {
    nombre: "Cirugía Oral",
    categoria: "Cirugía",
    precio: 350000,
    descripcion: "Procedimientos quirúrgicos bucales",
  },
  {
    nombre: "Bichectomía",
    categoria: "Cirugía",
    precio: 1200000,
    descripcion: "Extracción de bolas de Bichat para afinamiento facial",
  },
  {
    nombre: "Perfilamiento de Papada",
    categoria: "Cirugía",
    precio: 1500000,
    descripcion: "Tratamiento para reducir papada y definir contorno",
  },

  // IMPLANTES Y REHABILITACIÓN
  {
    nombre: "Implantes Dentales",
    categoria: "Rehabilitación",
    precio: 2000000,
    descripcion: "Implante dental completo con corona",
  },
  {
    nombre: "Rehabilitación Oral",
    categoria: "Rehabilitación",
    precio: 1500000,
    descripcion: "Restauración completa de la función oral",
  },
  {
    nombre: "Corona Porcelana",
    categoria: "Rehabilitación",
    precio: 650000,
    descripcion: "Corona de porcelana sobre diente o implante",
  },
  {
    nombre: "Corona Metal-Porcelana",
    categoria: "Rehabilitación",
    precio: 550000,
    descripcion: "Corona de metal recubierta con porcelana",
  },
  {
    nombre: "Puente Fijo (3 piezas)",
    categoria: "Rehabilitación",
    precio: 1200000,
    descripcion: "Puente dental fijo de tres piezas",
  },
  {
    nombre: "Prótesis Removible Parcial",
    categoria: "Rehabilitación",
    precio: 800000,
    descripcion: "Prótesis removible para reemplazo parcial",
  },
  {
    nombre: "Prótesis Removible Total",
    categoria: "Rehabilitación",
    precio: 1000000,
    descripcion: "Prótesis removible completa",
  },

  // ORTODONCIA
  {
    nombre: "Ortodoncia",
    categoria: "Ortodoncia",
    precio: 200000,
    descripcion: "Cuota mensual de tratamiento de ortodoncia",
  },
  {
    nombre: "Ortodoncia Instalación",
    categoria: "Ortodoncia",
    precio: 800000,
    descripcion: "Instalación inicial de aparatos de ortodoncia",
  },

  // ENDODONCIA
  {
    nombre: "Endodoncia",
    categoria: "Endodoncia",
    precio: 380000,
    descripcion: "Tratamiento de conducto radicular",
  },

  // PERIODONCIA
  {
    nombre: "Periodoncia",
    categoria: "Periodoncia",
    precio: 150000,
    descripcion: "Tratamiento de encías y tejidos de soporte",
  },
  {
    nombre: "Detartraje (Limpieza Profunda)",
    categoria: "Periodoncia",
    precio: 120000,
    descripcion: "Limpieza profunda periodontal",
  },

  // ODONTOLOGÍA GENERAL
  {
    nombre: "Odontología General",
    categoria: "General",
    precio: 80000,
    descripcion: "Consulta y procedimientos generales",
  },
  {
    nombre: "Consulta General",
    categoria: "General",
    precio: 50000,
    descripcion: "Consulta odontológica inicial",
  },
  {
    nombre: "Limpieza Dental (Profilaxis)",
    categoria: "General",
    precio: 80000,
    descripcion: "Profilaxis dental básica",
  },
  {
    nombre: "Urgencia Odontológica",
    categoria: "General",
    precio: 80000,
    descripcion: "Atención de urgencias dentales",
  },

  // RESTAURACIONES
  {
    nombre: "Resina Dental (1 superficie)",
    categoria: "Restauración",
    precio: 150000,
    descripcion: "Obturación con resina en una superficie",
  },
  {
    nombre: "Resina Dental (2 superficies)",
    categoria: "Restauración",
    precio: 200000,
    descripcion: "Obturación con resina en dos superficies",
  },
  {
    nombre: "Resina Dental (3 superficies)",
    categoria: "Restauración",
    precio: 250000,
    descripcion: "Obturación con resina en tres superficies",
  },

  // EXTRACCIONES
  {
    nombre: "Extracción Simple",
    categoria: "Cirugía",
    precio: 120000,
    descripcion: "Extracción dental simple",
  },
  {
    nombre: "Extracción Compleja",
    categoria: "Cirugía",
    precio: 180000,
    descripcion: "Extracción dental compleja",
  },
  {
    nombre: "Extracción Quirúrgica",
    categoria: "Cirugía",
    precio: 250000,
    descripcion: "Extracción quirúrgica con incisión",
  },

  // RADIOLOGÍA
  {
    nombre: "Radiografía Periapical",
    categoria: "Diagnóstico",
    precio: 25000,
    descripcion: "Radiografía dental individual",
  },
  {
    nombre: "Radiografía Panorámica",
    categoria: "Diagnóstico",
    precio: 60000,
    descripcion: "Radiografía panorámica completa",
  },

  // PREVENCIÓN
  {
    nombre: "Sellante de Fosas",
    categoria: "Prevención",
    precio: 40000,
    descripcion: "Sellantes para prevenir caries",
  },
  {
    nombre: "Aplicación de Flúor",
    categoria: "Prevención",
    precio: 30000,
    descripcion: "Aplicación de flúor preventivo",
  },

  // OTROS
  {
    nombre: "Otros",
    categoria: "Otros",
    precio: 0,
    descripcion: "Tratamiento personalizado",
  },
];

// Obtener categorías únicas
export const CATEGORIAS_TRATAMIENTOS = Array.from(
  new Set(TRATAMIENTOS_DENTALES.map((t) => t.categoria))
).sort();

// Función auxiliar para buscar tratamiento por nombre
export function getTreatmentByName(nombre: string): Treatment | undefined {
  return TRATAMIENTOS_DENTALES.find((t) => t.nombre === nombre);
}

// Función auxiliar para obtener tratamientos por categoría
export function getTreatmentsByCategory(categoria: string): Treatment[] {
  return TRATAMIENTOS_DENTALES.filter((t) => t.categoria === categoria);
}

// Tratamientos para el seed (versión simplificada para datos de prueba)
export const TRATAMIENTOS_SEED = [
  { name: "Consulta General", amount: 50000 },
  { name: "Limpieza Dental (Profilaxis)", amount: 80000 },
  { name: "Resina Dental (1 superficie)", amount: 150000 },
  { name: "Extracción Simple", amount: 120000 },
  { name: "Blanqueamiento Dental", amount: 450000 },
  { name: "Endodoncia", amount: 380000 },
  { name: "Corona Porcelana", amount: 650000 },
  { name: "Ortodoncia", amount: 200000 },
  { name: "Implantes Dentales", amount: 2000000 },
  { name: "Diseño de Sonrisa", amount: 3500000 },
  { name: "Lentes Cerámicos", amount: 2500000 },
  { name: "Bichectomía", amount: 1200000 },
  { name: "Periodoncia", amount: 150000 },
  { name: "Rehabilitación Oral", amount: 1500000 },
];
