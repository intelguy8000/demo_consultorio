import { NextResponse } from "next/server";
import { getIntegrations } from "@/lib/services/integraciones.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;

    const integrations = await getIntegrations({ status, type });
    return NextResponse.json(integrations);
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return NextResponse.json(
      { error: "Error al obtener integraciones" },
      { status: 500 }
    );
  }
}
