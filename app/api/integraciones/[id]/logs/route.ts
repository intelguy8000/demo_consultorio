import { NextResponse } from "next/server";
import { getIntegrationLogs } from "@/lib/services/integraciones.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const action = searchParams.get("action") || undefined;

    const logs = await getIntegrationLogs(id, { status, action });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching integration logs:", error);
    return NextResponse.json(
      { error: "Error al obtener logs" },
      { status: 500 }
    );
  }
}
