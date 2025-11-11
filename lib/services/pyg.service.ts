import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PygData {
  revenue: number;
  directCosts: number;
  grossProfit: number;
  grossMargin: number;
  expenses: number;
  operatingProfit: number;
  operatingMargin: number;
  netProfit: number;
}

export async function getPyG(startDate: Date, endDate: Date): Promise<PygData> {
  // INGRESOS - Total de ventas
  const totalSales = await prisma.sale.aggregate({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const revenue = totalSales._sum.amount || 0;

  // COSTOS DIRECTOS - Costo de insumos usados en ventas
  const salesWithItems = await prisma.sale.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      itemsUsed: {
        include: {
          inventory: true,
        },
      },
    },
  });

  const directCosts = salesWithItems.reduce((sum, sale) => {
    return (
      sum +
      sale.itemsUsed.reduce((s, item) => {
        return s + item.quantityUsed * item.inventory.avgCost;
      }, 0)
    );
  }, 0);

  // GASTOS OPERACIONALES
  const totalExpenses = await prisma.expense.aggregate({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const expenses = totalExpenses._sum.amount || 0;

  // CALCULAR MÁRGENES
  const grossProfit = revenue - directCosts;
  const operatingProfit = grossProfit - expenses;

  return {
    revenue,
    directCosts,
    grossProfit,
    grossMargin: revenue ? (grossProfit / revenue) * 100 : 0,
    expenses,
    operatingProfit,
    operatingMargin: revenue ? (operatingProfit / revenue) * 100 : 0,
    netProfit: operatingProfit,
  };
}

export async function getRevenueVsExpenses(startDate: Date, endDate: Date) {
  const pyg = await getPyG(startDate, endDate);

  return [
    { name: "Ingresos", value: pyg.revenue },
    { name: "Gastos", value: pyg.expenses },
    { name: "Utilidad Neta", value: pyg.netProfit },
  ];
}
