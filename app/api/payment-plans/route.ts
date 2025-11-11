import { NextResponse } from "next/server";
import {
  getPaymentPlans,
  getAccountsReceivableKPIs,
  createPaymentPlan,
} from "@/lib/services/payment-plans.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const patientId = searchParams.get("patientId") || undefined;
    const overdue = searchParams.get("overdue") === "true" ? true : undefined;
    const kpisOnly = searchParams.get("kpis") === "true";

    if (kpisOnly) {
      const kpis = await getAccountsReceivableKPIs();
      return NextResponse.json(kpis);
    }

    const paymentPlans = await getPaymentPlans({
      status,
      patientId,
      overdue,
    });

    return NextResponse.json(paymentPlans);
  } catch (error) {
    console.error("Error fetching payment plans:", error);
    return NextResponse.json(
      { error: "Error al obtener planes de pago" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const paymentPlan = await createPaymentPlan({
      patientId: body.patientId,
      treatment: body.treatment,
      saleId: body.saleId,
      totalAmount: body.totalAmount,
      downPayment: body.downPayment || 0,
      installments: body.installments,
      frequency: body.frequency || "mensual",
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      createdBy: body.createdBy,
    });

    return NextResponse.json(paymentPlan, { status: 201 });
  } catch (error: any) {
    console.error("Error creating payment plan:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear plan de pago" },
      { status: 400 }
    );
  }
}
