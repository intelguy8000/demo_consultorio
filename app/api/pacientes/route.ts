import { NextResponse } from "next/server";
import { getPatients, createPatient } from "@/lib/services/clientes.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const eps = searchParams.get("eps") || undefined;

    const patients = await getPatients({ search, eps });
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Error al obtener pacientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const patient = await createPatient({
      document: body.document,
      fullName: body.fullName,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      phone: body.phone,
      email: body.email,
      address: body.address,
      eps: body.eps,
      notes: body.notes,
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error: any) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear paciente" },
      { status: 400 }
    );
  }
}
