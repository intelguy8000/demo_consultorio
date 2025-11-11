import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateExpenseData {
  date: Date;
  category: string;
  description: string;
  amount: number;
  frequency: string; // unico, mensual, anual
  status: string; // pagado, pendiente, vencido
  userId?: string;
}

export async function createExpense(data: CreateExpenseData) {
  return await prisma.expense.create({
    data: {
      date: data.date,
      category: data.category,
      description: data.description,
      amount: data.amount,
      frequency: data.frequency,
      status: data.status,
      createdBy: data.userId,
    },
  });
}

export interface ExpenseFilters {
  category?: string;
  status?: string;
  frequency?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getExpenses(filters?: ExpenseFilters) {
  const where: any = {};

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.frequency) {
    where.frequency = filters.frequency;
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

  return await prisma.expense.findMany({
    where,
    orderBy: {
      date: "desc",
    },
  });
}

export async function getExpenseById(id: string) {
  return await prisma.expense.findUnique({
    where: { id },
  });
}

export async function updateExpense(id: string, data: Partial<CreateExpenseData>) {
  return await prisma.expense.update({
    where: { id },
    data,
  });
}

export async function deleteExpense(id: string) {
  return await prisma.expense.delete({
    where: { id },
  });
}

export async function getTotalExpensesByPeriod(startDate: Date, endDate: Date) {
  const result = await prisma.expense.aggregate({
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

  return result._sum.amount || 0;
}

export async function getExpensesByCategory(startDate: Date, endDate: Date) {
  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const byCategory: { [key: string]: number } = {};

  expenses.forEach((expense) => {
    if (!byCategory[expense.category]) {
      byCategory[expense.category] = 0;
    }
    byCategory[expense.category] += expense.amount;
  });

  return Object.entries(byCategory).map(([category, amount]) => ({
    category,
    amount,
  }));
}
