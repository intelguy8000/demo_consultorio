import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreatePaymentPlanData {
  patientId: string;
  treatment: string;
  saleId?: string;
  totalAmount: number;
  downPayment: number;
  installments: number;
  frequency?: "mensual" | "quincenal" | "semanal";
  startDate: Date;
  createdBy?: string;
}

export interface RegisterPaymentData {
  installmentId: string;
  paymentMethod: string;
  notes?: string;
}

export interface PaymentPlanFilters {
  status?: string;
  patientId?: string;
  overdue?: boolean;
}

/**
 * Calcula la fecha de vencimiento según la frecuencia
 */
function calculateDueDate(startDate: Date, installmentNumber: number, frequency: string): Date {
  const dueDate = new Date(startDate);

  switch (frequency) {
    case "semanal":
      dueDate.setDate(dueDate.getDate() + (installmentNumber * 7));
      break;
    case "quincenal":
      dueDate.setDate(dueDate.getDate() + (installmentNumber * 15));
      break;
    case "mensual":
    default:
      dueDate.setMonth(dueDate.getMonth() + installmentNumber);
      break;
  }

  return dueDate;
}

/**
 * Crea un plan de pago con sus cuotas asociadas
 */
export async function createPaymentPlan(data: CreatePaymentPlanData) {
  // Calcular el monto de cada cuota
  const amountToFinance = data.totalAmount - data.downPayment;
  const installmentAmount = Math.round(amountToFinance / data.installments);

  // Frequency por defecto es mensual
  const frequency = data.frequency || "mensual";

  // Primera cuota con fecha de vencimiento según la frecuencia
  const firstDueDate = calculateDueDate(data.startDate, 1, frequency);

  return await prisma.$transaction(async (tx) => {
    // Crear el plan de pago
    const paymentPlan = await tx.paymentPlan.create({
      data: {
        patientId: data.patientId,
        treatment: data.treatment,
        saleId: data.saleId,
        totalAmount: data.totalAmount,
        downPayment: data.downPayment,
        installments: data.installments,
        installmentAmount: installmentAmount,
        paidAmount: data.downPayment,
        remainingAmount: amountToFinance,
        frequency: frequency,
        status: "active",
        startDate: data.startDate,
        nextDueDate: firstDueDate,
        createdBy: data.createdBy,
      },
    });

    // Crear las cuotas
    for (let i = 0; i < data.installments; i++) {
      const dueDate = calculateDueDate(data.startDate, i + 1, frequency);

      await tx.paymentInstallment.create({
        data: {
          paymentPlanId: paymentPlan.id,
          installmentNumber: i + 1,
          amount: installmentAmount,
          dueDate: dueDate,
          status: "pending",
        },
      });
    }

    return paymentPlan;
  });
}

/**
 * Registra el pago de una cuota
 */
export async function registerInstallmentPayment(data: RegisterPaymentData) {
  return await prisma.$transaction(async (tx) => {
    // Obtener la cuota
    const installment = await tx.paymentInstallment.findUnique({
      where: { id: data.installmentId },
      include: { paymentPlan: true },
    });

    if (!installment) {
      throw new Error("Cuota no encontrada");
    }

    if (installment.status === "paid") {
      throw new Error("Esta cuota ya fue pagada");
    }

    // Actualizar la cuota
    const updatedInstallment = await tx.paymentInstallment.update({
      where: { id: data.installmentId },
      data: {
        status: "paid",
        paidDate: new Date(),
        paidAmount: installment.amount,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      },
    });

    // Actualizar el plan de pago
    const updatedPlan = await tx.paymentPlan.update({
      where: { id: installment.paymentPlanId },
      data: {
        paidAmount: { increment: installment.amount },
        remainingAmount: { decrement: installment.amount },
      },
    });

    // Buscar la próxima cuota pendiente
    const nextPendingInstallment = await tx.paymentInstallment.findFirst({
      where: {
        paymentPlanId: installment.paymentPlanId,
        status: { in: ["pending", "overdue"] },
      },
      orderBy: { dueDate: "asc" },
    });

    // Actualizar nextDueDate y status del plan
    if (nextPendingInstallment) {
      await tx.paymentPlan.update({
        where: { id: installment.paymentPlanId },
        data: { nextDueDate: nextPendingInstallment.dueDate },
      });
    } else {
      // No hay más cuotas pendientes, marcar plan como completado
      await tx.paymentPlan.update({
        where: { id: installment.paymentPlanId },
        data: {
          status: "completed",
          nextDueDate: new Date(), // Set to current date as placeholder
        },
      });

      // Actualizar el estado de la venta a "completada" si existe
      if (installment.paymentPlan.saleId) {
        await tx.sale.update({
          where: { id: installment.paymentPlan.saleId },
          data: { status: "completada" },
        });
      }
    }

    return updatedInstallment;
  });
}

/**
 * Obtiene los planes de pago con filtros
 */
export async function getPaymentPlans(filters?: PaymentPlanFilters) {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters?.overdue) {
    where.paymentInstallments = {
      some: {
        status: "overdue",
      },
    };
  }

  return await prisma.paymentPlan.findMany({
    where,
    include: {
      patient: true,
      sale: true,
      paymentInstallments: {
        orderBy: { installmentNumber: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Obtiene una plan de pago por ID
 */
export async function getPaymentPlanById(id: string) {
  return await prisma.paymentPlan.findUnique({
    where: { id },
    include: {
      patient: true,
      sale: true,
      paymentInstallments: {
        orderBy: { installmentNumber: "asc" },
      },
    },
  });
}

/**
 * Actualiza el estado de las cuotas vencidas
 */
export async function updateOverdueInstallments() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.paymentInstallment.updateMany({
    where: {
      status: "pending",
      dueDate: { lt: today },
    },
    data: {
      status: "overdue",
    },
  });
}

/**
 * Obtiene KPIs de cuentas por cobrar
 */
export async function getAccountsReceivableKPIs() {
  // Total por cobrar (planes activos)
  const activePlans = await prisma.paymentPlan.findMany({
    where: { status: "active" },
  });

  const totalReceivable = activePlans.reduce(
    (sum, plan) => sum + plan.remainingAmount,
    0
  );

  // Cuotas vencidas
  const overdueInstallments = await prisma.paymentInstallment.findMany({
    where: { status: "overdue" },
  });

  const overdueCount = overdueInstallments.length;
  const overdueAmount = overdueInstallments.reduce(
    (sum, inst) => sum + inst.amount,
    0
  );

  // Cuotas por vencer esta semana
  const today = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const dueThisWeek = await prisma.paymentInstallment.findMany({
    where: {
      status: "pending",
      dueDate: {
        gte: today,
        lte: weekFromNow,
      },
    },
  });

  const dueThisWeekCount = dueThisWeek.length;
  const dueThisWeekAmount = dueThisWeek.reduce(
    (sum, inst) => sum + inst.amount,
    0
  );

  // Planes activos
  const activePlansCount = activePlans.length;

  return {
    totalReceivable,
    overdueCount,
    overdueAmount,
    dueThisWeekCount,
    dueThisWeekAmount,
    activePlansCount,
  };
}

/**
 * Obtiene las cuotas pendientes y vencidas de un plan
 */
export async function getPendingInstallments(paymentPlanId: string) {
  return await prisma.paymentInstallment.findMany({
    where: {
      paymentPlanId,
      status: { in: ["pending", "overdue"] },
    },
    orderBy: { dueDate: "asc" },
  });
}
