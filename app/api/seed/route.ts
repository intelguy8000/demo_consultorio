import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function runSeed() {
  console.log("🌱 Starting seed...");

  // Limpiar datos existentes (en orden correcto por relaciones)
  await prisma.paymentInstallment.deleteMany();
  await prisma.paymentPlan.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.saleInventoryItem.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.integrationLog.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.config.deleteMany();

  // Hash de passwords
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const asistentePassword = await bcrypt.hash("Asistente123!", 10);
  const readonlyPassword = await bcrypt.hash("Lectura123!", 10);

  // Crear usuarios
  const admin = await prisma.user.create({
    data: {
      email: "dra.catalina@crdentalstudio.com",
      password: adminPassword,
      name: "Dra. Catalina Rodríguez",
      role: "admin",
      status: "active",
    },
  });

  await prisma.user.create({
    data: {
      email: "maria@crdentalstudio.com",
      password: asistentePassword,
      name: "María González",
      role: "asistente",
      status: "active",
    },
  });

  await prisma.user.create({
    data: {
      email: "juan@crdentalstudio.com",
      password: readonlyPassword,
      name: "Juan Pérez",
      role: "readonly",
      status: "active",
    },
  });

  console.log("✅ 3 usuarios creados");

  // Crear configuración del consultorio
  await prisma.config.create({
    data: {
      name: "CR Dental Studio",
      address: "Calle 10 #43-65, Medellín, Colombia",
      phone: "+57 (4) 555-1234",
      email: "info@crdentalstudio.com",
      website: "https://crdentalstudio.com",
    },
  });

  console.log("✅ Configuración creada");

  // Crear integraciones
  await prisma.integration.create({
    data: {
      name: "Alegra",
      type: "alegra",
      status: "active",
      lastSync: new Date(),
    },
  });

  await prisma.integration.create({
    data: {
      name: "OpenAI",
      type: "openai",
      status: "active",
    },
  });

  console.log("✅ 2 integraciones creadas");

  return {
    users: 3,
    config: 1,
    integrations: 2
  };
}

export async function GET() {
  try {
    const result = await runSeed();

    return NextResponse.json({
      success: true,
      message: "Seed executed successfully",
      data: result
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
  } finally {
    await prisma.$disconnect();
  }
}
