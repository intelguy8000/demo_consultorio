import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Limpiar datos existentes
  await prisma.integration.deleteMany();
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

  const asistente = await prisma.user.create({
    data: {
      email: "maria@crdentalstudio.com",
      password: asistentePassword,
      name: "María González",
      role: "asistente",
      status: "active",
    },
  });

  const readonly = await prisma.user.create({
    data: {
      email: "juan@crdentalstudio.com",
      password: readonlyPassword,
      name: "Juan Pérez",
      role: "readonly",
      status: "active",
    },
  });

  console.log("✅ Usuarios creados:");
  console.log(`   - ${admin.name} (${admin.role})`);
  console.log(`   - ${asistente.name} (${asistente.role})`);
  console.log(`   - ${readonly.name} (${readonly.role})`);

  // Crear configuración del consultorio
  const config = await prisma.config.create({
    data: {
      id: "singleton",
      name: "CR Dental Studio",
      address: "Carrera 43A #1-50, Medellín, Antioquia",
      phone: "+57 (4) 123-4567",
      email: "contacto@crdentalstudio.com",
      website: "https://crdentalstudio.com",
    },
  });

  console.log("✅ Configuración creada:");
  console.log(`   - ${config.name}`);

  // Crear integraciones
  const alegraIntegration = await prisma.integration.create({
    data: {
      name: "Alegra",
      type: "alegra",
      status: "active",
      lastSync: new Date(),
    },
  });

  const openaiIntegration = await prisma.integration.create({
    data: {
      name: "OpenAI",
      type: "openai",
      status: "inactive",
      lastSync: null,
    },
  });

  console.log("✅ Integraciones creadas:");
  console.log(`   - ${alegraIntegration.name} (${alegraIntegration.status})`);
  console.log(`   - ${openaiIntegration.name} (${openaiIntegration.status})`);

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("\n📝 Credenciales de acceso:");
  console.log("   Admin: dra.catalina@crdentalstudio.com / Admin123!");
  console.log("   Asistente: maria@crdentalstudio.com / Asistente123!");
  console.log("   Readonly: juan@crdentalstudio.com / Lectura123!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
