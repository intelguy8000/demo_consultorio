import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateSaleData {
  date: Date;
  patientId: string;
  treatment: string;
  amount: number;
  paymentMethod: string;
  status: string;
  itemsUsed?: Array<{
    inventoryId: string;
    quantityUsed: number;
  }>;
  paymentPlan?: {
    downPayment: number;
    installments: number;
  };
}

export async function createSale(data: CreateSaleData) {
  return await prisma.$transaction(async (tx) => {
    // 1. Crear la venta
    const sale = await tx.sale.create({
      data: {
        date: data.date,
        patientId: data.patientId,
        treatment: data.treatment,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        status: data.status,
      },
    });

    // 2. Si hay items usados, procesarlos
    if (data.itemsUsed && data.itemsUsed.length > 0) {
      for (const item of data.itemsUsed) {
        // Crear relación sale-inventory
        await tx.saleInventoryItem.create({
          data: {
            saleId: sale.id,
            inventoryId: item.inventoryId,
            quantityUsed: item.quantityUsed,
          },
        });

        // Descontar del inventario
        await tx.inventoryItem.update({
          where: { id: item.inventoryId },
          data: {
            currentStock: {
              decrement: item.quantityUsed,
            },
          },
        });

        // Crear movimiento de inventario
        await tx.inventoryMovement.create({
          data: {
            inventoryId: item.inventoryId,
            type: "salida",
            quantity: item.quantityUsed,
            reason: `Venta: ${data.treatment}`,
            referenceId: sale.id,
            date: data.date,
          },
        });
      }
    }

    // 3. Si hay plan de pago, crearlo
    if (data.paymentPlan) {
      const amountToFinance = data.amount - data.paymentPlan.downPayment;
      const installmentAmount = Math.round(
        amountToFinance / data.paymentPlan.installments
      );

      const firstDueDate = new Date(data.date);
      firstDueDate.setMonth(firstDueDate.getMonth() + 1);

      const paymentPlan = await tx.paymentPlan.create({
        data: {
          patientId: data.patientId,
          treatment: data.treatment,
          saleId: sale.id,
          totalAmount: data.amount,
          downPayment: data.paymentPlan.downPayment,
          installments: data.paymentPlan.installments,
          installmentAmount: installmentAmount,
          paidAmount: data.paymentPlan.downPayment,
          remainingAmount: amountToFinance,
          frequency: "mensual",
          status: "active",
          startDate: data.date,
          nextDueDate: firstDueDate,
        },
      });

      // Crear las cuotas
      for (let i = 0; i < data.paymentPlan.installments; i++) {
        const dueDate = new Date(data.date);
        dueDate.setMonth(dueDate.getMonth() + i + 1);

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
    }

    // Retornar la venta con sus relaciones
    return await tx.sale.findUnique({
      where: { id: sale.id },
      include: {
        patient: true,
        itemsUsed: {
          include: {
            inventory: true,
          },
        },
        paymentPlan: {
          include: {
            paymentInstallments: true,
          },
        },
      },
    });
  });
}

export interface SaleFilters {
  patientId?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getSales(filters?: SaleFilters) {
  const where: any = {};

  if (filters?.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.date = {};
    if (filters.dateFrom) {
      where.date.gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      where.date.lte = filters.dateTo;
    }
  }

  return await prisma.sale.findMany({
    where,
    include: {
      patient: true,
      itemsUsed: {
        include: {
          inventory: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getSaleById(id: string) {
  return await prisma.sale.findUnique({
    where: { id },
    include: {
      patient: true,
      itemsUsed: {
        include: {
          inventory: true,
        },
      },
    },
  });
}
