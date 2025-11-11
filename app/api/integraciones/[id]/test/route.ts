import { NextResponse } from "next/server";
import { testIntegration } from "@/lib/services/integraciones.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await testIntegration(id);

    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error testing integration:", error);
    return NextResponse.json(
      { error: "Error al probar integración" },
      { status: 500 }
    );
  }
}
