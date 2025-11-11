import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Obtener un paciente aleatorio de la base de datos
    const patients = await prisma.patient.findMany({
      take: 5,
    });

    if (patients.length === 0) {
      return NextResponse.json(
        { error: "No hay pacientes en la base de datos" },
        { status: 400 }
      );
    }

    // Facturas mock de Alegra
    const mockFacturas = [
      {
        numeroFactura: "FE-2025-001",
        fecha: new Date(),
        cliente: {
          nombre: patients[0].fullName,
          documento: patients[0].document,
          email: patients[0].email,
        },
        items: [
          {
            descripcion: "Limpieza Dental (Profilaxis)",
            cantidad: 1,
            precioUnitario: 80000,
            total: 80000,
          },
        ],
        total: 80000,
      },
      {
        numeroFactura: "FE-2025-002",
        fecha: new Date(),
        cliente: {
          nombre: patients[1].fullName,
          documento: patients[1].document,
          email: patients[1].email,
        },
        items: [
          {
            descripcion: "Resina Dental (2 superficies)",
            cantidad: 1,
            precioUnitario: 200000,
            total: 200000,
          },
        ],
        total: 200000,
      },
      {
        numeroFactura: "FE-2025-003",
        fecha: new Date(),
        cliente: {
          nombre: patients[2].fullName,
          documento: patients[2].document,
          email: patients[2].email,
        },
        items: [
          {
            descripcion: "Extracción Simple",
            cantidad: 1,
            precioUnitario: 120000,
            total: 120000,
          },
        ],
        total: 120000,
      },
      {
        numeroFactura: "FE-2025-004",
        fecha: new Date(),
        cliente: {
          nombre: patients[3].fullName,
          documento: patients[3].document,
          email: patients[3].email,
        },
        items: [
          {
            descripcion: "Blanqueamiento Dental",
            cantidad: 1,
            precioUnitario: 450000,
            total: 450000,
          },
        ],
        total: 450000,
      },
      {
        numeroFactura: "FE-2025-005",
        fecha: new Date(),
        cliente: {
          nombre: patients[4].fullName,
          documento: patients[4].document,
          email: patients[4].email,
        },
        items: [
          {
            descripcion: "Consulta General + Radiografía",
            cantidad: 1,
            precioUnitario: 75000,
            total: 75000,
          },
        ],
        total: 75000,
      },
    ];

    // Opcional: crear ventas automáticamente en DB
    const ventasCreadas = [];
    for (let i = 0; i < mockFacturas.length; i++) {
      const factura = mockFacturas[i];
      const patient = patients[i];

      const venta = await prisma.sale.create({
        data: {
          date: factura.fecha,
          patientId: patient.id,
          treatment: factura.items[0].descripcion,
          amount: factura.total,
          paymentMethod: "efectivo",
          status: "completada",
        },
      });

      ventasCreadas.push(venta);
    }

    return NextResponse.json({
      success: true,
      message: `${mockFacturas.length} facturas importadas exitosamente desde Alegra`,
      facturas: mockFacturas,
      ventasCreadas: ventasCreadas.length,
    });
  } catch (error) {
    console.error("Error importing facturas:", error);
    return NextResponse.json(
      { error: "Error al importar facturas desde Alegra" },
      { status: 500 }
    );
  }
}
