import { NextResponse } from "next/server";
import { getPurchases, createPurchase } from "@/lib/services/compras.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get("supplierId") || undefined;
    const category = searchParams.get("category") || undefined;

    const purchases = await getPurchases({
      supplierId,
      category,
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { error: "Error al obtener compras" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const purchase = await createPurchase({
      date: body.date ? new Date(body.date) : new Date(),
      supplierId: body.supplierId,
      invoiceNumber: body.invoiceNumber,
      category: body.category,
      items: body.items || [],
      userId: body.userId,
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json(
      { error: "Error al crear la compra" },
      { status: 500 }
    );
  }
}
