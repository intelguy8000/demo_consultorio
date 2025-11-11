import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.config.findFirst();

    if (!config) {
      return NextResponse.json(
        { error: "No se encontró la configuración" },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json(
      { error: "Error al obtener la configuración" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, address, phone, email, website } = body;

    const config = await prisma.config.findFirst();

    if (!config) {
      return NextResponse.json(
        { error: "No se encontró la configuración" },
        { status: 404 }
      );
    }

    const updatedConfig = await prisma.config.update({
      where: { id: config.id },
      data: {
        name,
        address,
        phone,
        email,
        website,
      },
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error("Error updating config:", error);
    return NextResponse.json(
      { error: "Error al actualizar la configuración" },
      { status: 500 }
    );
  }
}
