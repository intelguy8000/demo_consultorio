import { NextResponse } from "next/server";
import { getExpenses, createExpense } from "@/lib/services/gastos.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const frequency = searchParams.get("frequency") || undefined;

    const expenses = await getExpenses({
      category,
      status,
      frequency,
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Error al obtener gastos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const expense = await createExpense({
      date: body.date ? new Date(body.date) : new Date(),
      category: body.category,
      description: body.description,
      amount: parseFloat(body.amount),
      frequency: body.frequency,
      status: body.status,
      userId: body.userId,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Error al crear el gasto" },
      { status: 500 }
    );
  }
}
