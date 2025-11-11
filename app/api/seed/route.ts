import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Importar dinámicamente el seed para ejecutarlo
    const seed = await import("@/prisma/seed");

    return NextResponse.json({
      success: true,
      message: "Seed executed successfully"
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
