import { NextResponse } from "next/server";
import { getPyG, getRevenueVsExpenses } from "@/lib/services/pyg.service";
import { getExpensesByCategory } from "@/lib/services/gastos.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const type = searchParams.get("type");

    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const endDate = endDateParam
      ? new Date(endDateParam)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    if (type === "revenue-vs-expenses") {
      const data = await getRevenueVsExpenses(startDate, endDate);
      return NextResponse.json(data);
    }

    if (type === "expenses-by-category") {
      const data = await getExpensesByCategory(startDate, endDate);
      return NextResponse.json(data);
    }

    const pyg = await getPyG(startDate, endDate);
    return NextResponse.json(pyg);
  } catch (error) {
    console.error("Error fetching P&G:", error);
    return NextResponse.json(
      { error: "Error al obtener P&G" },
      { status: 500 }
    );
  }
}
