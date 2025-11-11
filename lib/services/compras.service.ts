import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreatePurchaseData {
  date: Date;
  supplierId: string;
  invoiceNumber: string;
  category: string;
  items: Array<{
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    inventoryId?: string;
  }>;
  userId?: string;
}

export async function createPurchase(data: CreatePurchaseData) {
  return await prisma.$transaction(async (tx) => {
    // Calcular total
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    // 1. Crear la compra
    const purchase = await tx.purchase.create({
      data: {
        date: data.date,
        supplierId: data.supplierId,
        invoiceNumber: data.invoiceNumber,
        category: data.category,
        totalAmount,
        createdBy: data.userId,
      },
    });

    // 2. Crear items y actualizar inventario si corresponde
    for (const item of data.items) {
      // Crear item de compra
      await tx.purchaseItem.create({
        data: {
          purchaseId: purchase.id,
          productName: item.productName,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          inventoryId: item.inventoryId,
        },
      });

      // Si tiene inventoryId, aumentar stock
      if (item.inventoryId) {
        await tx.inventoryItem.update({
          where: { id: item.inventoryId },
          data: {
            currentStock: { increment: item.quantity },
          },
        });

        // Crear movimiento de inventario
        await tx.inventoryMovement.create({
          data: {
            inventoryId: item.inventoryId,
            type: "entrada",
            quantity: item.quantity,
            reason: `Compra: ${data.invoiceNumber}`,
            referenceId: purchase.id,
            date: data.date,
          },
        });
      }
    }

    // Retornar compra con relaciones
    return await tx.purchase.findUnique({
      where: { id: purchase.id },
      include: {
        supplier: true,
        items: {
          include: {
            inventory: true,
          },
        },
      },
    });
  });
}

export interface PurchaseFilters {
  supplierId?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getPurchases(filters?: PurchaseFilters) {
  const where: any = {};

  if (filters?.supplierId) {
    where.supplierId = filters.supplierId;
  }

  if (filters?.category) {
    where.category = filters.category;
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

  return await prisma.purchase.findMany({
    where,
    include: {
      supplier: true,
      items: {
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

export async function getPurchaseById(id: string) {
  return await prisma.purchase.findUnique({
    where: { id },
    include: {
      supplier: true,
      items: {
        include: {
          inventory: true,
        },
      },
    },
  });
}

export async function getSuppliers() {
  return await prisma.supplier.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
