import { NextResponse } from "next/server";
import {
  getPatientById,
  getPatientStats,
  updatePatient,
  deletePatient,
} from "@/lib/services/clientes.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get("stats") === "true";

    const patient = await getPatientById(id);

    if (!patient) {
      return NextResponse.json(
        { error: "Paciente no encontrado" },
        { status: 404 }
      );
    }

    if (includeStats) {
      const stats = await getPatientStats(id);
      return NextResponse.json({ ...patient, stats });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Error al obtener paciente" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const patient = await updatePatient(id, {
      document: body.document,
      fullName: body.fullName,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      phone: body.phone,
      email: body.email,
      address: body.address,
      eps: body.eps,
      notes: body.notes,
    });

    return NextResponse.json(patient);
  } catch (error: any) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar paciente" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePatient(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar paciente" },
      { status: 400 }
    );
  }
}
