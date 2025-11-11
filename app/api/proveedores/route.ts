import { NextResponse } from "next/server";
import { getSuppliers } from "@/lib/services/compras.service";

export async function GET() {
  try {
    const suppliers = await getSuppliers();
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { error: "Error al obtener proveedores" },
      { status: 500 }
    );
  }
}
