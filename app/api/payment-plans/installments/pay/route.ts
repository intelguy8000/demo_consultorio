import { NextResponse } from "next/server";
import { registerInstallmentPayment } from "@/lib/services/payment-plans.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { installmentId, paymentMethod, notes } = body;

    if (!installmentId || !paymentMethod) {
      return NextResponse.json(
        { error: "installmentId y paymentMethod son requeridos" },
        { status: 400 }
      );
    }

    const updatedInstallment = await registerInstallmentPayment({
      installmentId,
      paymentMethod,
      notes,
    });

    return NextResponse.json(updatedInstallment, { status: 200 });
  } catch (error: any) {
    console.error("Error registering payment:", error);
    return NextResponse.json(
      { error: error.message || "Error al registrar el pago" },
      { status: 500 }
    );
  }
}
