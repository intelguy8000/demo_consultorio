import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreatePatientData {
  document: string;
  fullName: string;
  birthDate?: Date;
  phone: string;
  email?: string;
  address?: string;
  eps?: string;
  notes?: string;
}

export interface UpdatePatientData {
  document?: string;
  fullName?: string;
  birthDate?: Date;
  phone?: string;
  email?: string;
  address?: string;
  eps?: string;
  notes?: string;
}

export interface PatientFilters {
  search?: string;
  eps?: string;
}

/**
 * Obtiene todos los pacientes con filtros opcionales
 */
export async function getPatients(filters?: PatientFilters) {
  const where: any = {};

  if (filters?.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: "insensitive" } },
      { document: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters?.eps) {
    where.eps = filters.eps;
  }

  return await prisma.patient.findMany({
    where,
    include: {
      _count: {
        select: {
          sales: true,
          paymentPlans: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Obtiene un paciente por ID con toda su información relacionada
 */
export async function getPatientById(id: string) {
  return await prisma.patient.findUnique({
    where: { id },
    include: {
      sales: {
        orderBy: { date: "desc" },
      },
      paymentPlans: {
        include: {
          paymentInstallments: {
            orderBy: { installmentNumber: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

/**
 * Crea un nuevo paciente
 */
export async function createPatient(data: CreatePatientData) {
  // Verificar si ya existe un paciente con ese documento
  const existing = await prisma.patient.findUnique({
    where: { document: data.document },
  });

  if (existing) {
    throw new Error(`Ya existe un paciente con el documento ${data.document}`);
  }

  return await prisma.patient.create({
    data: {
      document: data.document,
      fullName: data.fullName,
      birthDate: data.birthDate,
      phone: data.phone,
      email: data.email,
      address: data.address,
      eps: data.eps,
      notes: data.notes,
    },
  });
}

/**
 * Actualiza un paciente
 */
export async function updatePatient(id: string, data: UpdatePatientData) {
  // Si se está actualizando el documento, verificar que no exista
  if (data.document) {
    const existing = await prisma.patient.findUnique({
      where: { document: data.document },
    });

    if (existing && existing.id !== id) {
      throw new Error(`Ya existe un paciente con el documento ${data.document}`);
    }
  }

  return await prisma.patient.update({
    where: { id },
    data,
  });
}

/**
 * Elimina un paciente (solo si no tiene ventas o planes de pago)
 */
export async function deletePatient(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          sales: true,
          paymentPlans: true,
        },
      },
    },
  });

  if (!patient) {
    throw new Error("Paciente no encontrado");
  }

  if (patient._count.sales > 0 || patient._count.paymentPlans > 0) {
    throw new Error(
      "No se puede eliminar un paciente con ventas o planes de pago asociados"
    );
  }

  return await prisma.patient.delete({
    where: { id },
  });
}

/**
 * Obtiene estadísticas de un paciente
 */
export async function getPatientStats(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      sales: true,
      paymentPlans: {
        include: {
          paymentInstallments: true,
        },
      },
    },
  });

  if (!patient) {
    throw new Error("Paciente no encontrado");
  }

  // Total de ventas
  const totalSales = patient.sales.length;
  const totalRevenue = patient.sales.reduce((sum, sale) => sum + sale.amount, 0);

  // Planes de pago
  const activePlans = patient.paymentPlans.filter((p) => p.status === "active");
  const totalOwed = activePlans.reduce((sum, plan) => sum + plan.remainingAmount, 0);

  // Cuotas vencidas
  const overdueInstallments = patient.paymentPlans
    .flatMap((plan) => plan.paymentInstallments)
    .filter((inst) => inst.status === "overdue");

  const overdueCount = overdueInstallments.length;
  const overdueAmount = overdueInstallments.reduce(
    (sum, inst) => sum + inst.amount,
    0
  );

  // Última visita (última venta)
  const lastVisit = patient.sales.length > 0
    ? patient.sales.sort((a, b) => b.date.getTime() - a.date.getTime())[0].date
    : null;

  return {
    totalSales,
    totalRevenue,
    activePlans: activePlans.length,
    totalOwed,
    overdueCount,
    overdueAmount,
    lastVisit,
  };
}

/**
 * Busca pacientes por documento
 */
export async function findPatientByDocument(document: string) {
  return await prisma.patient.findUnique({
    where: { document },
  });
}
