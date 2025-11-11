import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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

  // Crear pacientes
  const patientsData = [
    { document: "1020304050", fullName: "Carlos Andrés López", phone: "3001234567", email: "carlos.lopez@email.com" },
    { document: "1020304051", fullName: "María Fernanda Gómez", phone: "3002345678", email: "maria.gomez@email.com" },
    { document: "1020304052", fullName: "Jorge Luis Martínez", phone: "3003456789", email: "jorge.martinez@email.com" },
    { document: "1020304053", fullName: "Ana María Rodríguez", phone: "3004567890", email: "ana.rodriguez@email.com" },
    { document: "1020304054", fullName: "Pedro José Sánchez", phone: "3005678901", email: "pedro.sanchez@email.com" },
    { document: "1020304055", fullName: "Laura Patricia Díaz", phone: "3006789012", email: "laura.diaz@email.com" },
    { document: "1020304056", fullName: "Andrés Felipe Torres", phone: "3007890123", email: "andres.torres@email.com" },
    { document: "1020304057", fullName: "Carolina Ramírez", phone: "3008901234", email: "carolina.ramirez@email.com" },
    { document: "1020304058", fullName: "Ricardo Alberto Vargas", phone: "3009012345", email: "ricardo.vargas@email.com" },
    { document: "1020304059", fullName: "Claudia Patricia Moreno", phone: "3010123456", email: "claudia.moreno@email.com" },
  ];

  const patients = [];
  for (const patientData of patientsData) {
    const patient = await prisma.patient.create({ data: patientData });
    patients.push(patient);
  }

  console.log(`✅ ${patients.length} pacientes creados`);

  // Crear items de inventario
  const inventoryData = [
    // Material dental - stock OK
    { name: "Resina Composite A2", category: "Material Restaurador", currentStock: 45, minStock: 10, unit: "unidad", avgCost: 85000 },
    { name: "Resina Composite A3", category: "Material Restaurador", currentStock: 38, minStock: 10, unit: "unidad", avgCost: 85000 },
    { name: "Ionómero de Vidrio", category: "Material Restaurador", currentStock: 25, minStock: 8, unit: "unidad", avgCost: 65000 },
    { name: "Cemento Temporal", category: "Material Restaurador", currentStock: 30, minStock: 10, unit: "unidad", avgCost: 45000 },

    // Anestesia - stock OK
    { name: "Lidocaína 2% con Epinefrina", category: "Anestesia", currentStock: 120, minStock: 50, unit: "carpule", avgCost: 2500 },
    { name: "Articaína 4%", category: "Anestesia", currentStock: 80, minStock: 40, unit: "carpule", avgCost: 3500 },

    // Instrumental - stock OK
    { name: "Guantes de Nitrilo Talla M", category: "Bioseguridad", currentStock: 500, minStock: 200, unit: "par", avgCost: 800 },
    { name: "Guantes de Nitrilo Talla L", category: "Bioseguridad", currentStock: 400, minStock: 200, unit: "par", avgCost: 800 },
    { name: "Mascarillas Quirúrgicas", category: "Bioseguridad", currentStock: 800, minStock: 300, unit: "unidad", avgCost: 500 },
    { name: "Baberos Desechables", category: "Bioseguridad", currentStock: 600, minStock: 200, unit: "unidad", avgCost: 300 },

    // Material rotatorio - stock OK
    { name: "Fresas Carburo #330", category: "Instrumental Rotatorio", currentStock: 50, minStock: 15, unit: "unidad", avgCost: 8000 },
    { name: "Fresas Diamante Redonda", category: "Instrumental Rotatorio", currentStock: 45, minStock: 15, unit: "unidad", avgCost: 12000 },
    { name: "Fresas Diamante Llama", category: "Instrumental Rotatorio", currentStock: 40, minStock: 15, unit: "unidad", avgCost: 12000 },

    // Medicamentos - algunos en stock bajo
    { name: "Amoxicilina 500mg", category: "Medicamentos", currentStock: 35, minStock: 30, unit: "cápsula", avgCost: 800 },
    { name: "Ibuprofeno 400mg", category: "Medicamentos", currentStock: 18, minStock: 30, unit: "tableta", avgCost: 400 },
    { name: "Acetaminofén 500mg", category: "Medicamentos", currentStock: 15, minStock: 30, unit: "tableta", avgCost: 300 },

    // Endodoncia - algunos críticos
    { name: "Limas K-File #15", category: "Endodoncia", currentStock: 8, minStock: 20, unit: "unidad", avgCost: 15000 },
    { name: "Limas K-File #20", category: "Endodoncia", currentStock: 5, minStock: 20, unit: "unidad", avgCost: 15000 },
    { name: "Limas K-File #25", category: "Endodoncia", currentStock: 12, minStock: 20, unit: "unidad", avgCost: 15000 },
    { name: "Gutapercha #25", category: "Endodoncia", currentStock: 22, minStock: 15, unit: "unidad", avgCost: 18000 },

    // Periodoncia
    { name: "Curetas Gracey 5-6", category: "Periodoncia", currentStock: 8, minStock: 5, unit: "unidad", avgCost: 95000 },
    { name: "Curetas Gracey 7-8", category: "Periodoncia", currentStock: 6, minStock: 5, unit: "unidad", avgCost: 95000 },

    // Materiales de impresión
    { name: "Silicona de Condensación", category: "Material de Impresión", currentStock: 12, minStock: 8, unit: "kit", avgCost: 125000 },
    { name: "Alginato", category: "Material de Impresión", currentStock: 20, minStock: 10, unit: "bolsa", avgCost: 35000 },

    // Blanqueamiento - stock crítico
    { name: "Gel Blanqueador 35%", category: "Estética", currentStock: 3, minStock: 10, unit: "jeringa", avgCost: 75000 },
    { name: "Gel Blanqueador 16%", category: "Estética", currentStock: 6, minStock: 10, unit: "jeringa", avgCost: 55000 },

    // Radiografía
    { name: "Película Radiográfica Periapical", category: "Radiología", currentStock: 180, minStock: 100, unit: "unidad", avgCost: 2800 },
    { name: "Película Radiográfica Oclusal", category: "Radiología", currentStock: 45, minStock: 30, unit: "unidad", avgCost: 3500 },

    // Sutura
    { name: "Seda 3-0", category: "Sutura", currentStock: 25, minStock: 15, unit: "unidad", avgCost: 8500 },
    { name: "Vicryl 4-0", category: "Sutura", currentStock: 4, minStock: 15, unit: "unidad", avgCost: 22000 },

    // Algodón y gasas
    { name: "Rollos de Algodón", category: "Material Consumible", currentStock: 15, minStock: 30, unit: "paquete", avgCost: 12000 },
    { name: "Gasas Estériles", category: "Material Consumible", currentStock: 35, minStock: 25, unit: "paquete", avgCost: 8500 },

    // Adhesivos
    { name: "Adhesivo Dental Single Bond", category: "Material Restaurador", currentStock: 18, minStock: 10, unit: "frasco", avgCost: 145000 },
    { name: "Ácido Grabador 37%", category: "Material Restaurador", currentStock: 22, minStock: 10, unit: "jeringa", avgCost: 35000 },

    // Profilaxis
    { name: "Pasta Profiláctica Fresa", category: "Profilaxis", currentStock: 8, minStock: 8, unit: "tarro", avgCost: 28000 },
    { name: "Pasta Profiláctica Menta", category: "Profilaxis", currentStock: 10, minStock: 8, unit: "tarro", avgCost: 28000 },

    // Desinfección
    { name: "Alcohol Antiséptico 70%", category: "Desinfección", currentStock: 25, minStock: 15, unit: "litro", avgCost: 12000 },
    { name: "Glutaraldehído 2%", category: "Desinfección", currentStock: 12, minStock: 8, unit: "litro", avgCost: 45000 },

    // Cepillos y copa de profilaxis
    { name: "Copas de Profilaxis", category: "Profilaxis", currentStock: 100, minStock: 50, unit: "unidad", avgCost: 1200 },
    { name: "Cepillos de Profilaxis", category: "Profilaxis", currentStock: 85, minStock: 50, unit: "unidad", avgCost: 1500 },
  ];

  const inventoryItems = [];
  for (const itemData of inventoryData) {
    const item = await prisma.inventoryItem.create({ data: itemData });
    inventoryItems.push(item);

    // Crear movimiento inicial de entrada
    await prisma.inventoryMovement.create({
      data: {
        inventoryId: item.id,
        type: "entrada",
        quantity: item.currentStock,
        reason: "Stock inicial",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
      },
    });
  }

  console.log(`✅ ${inventoryItems.length} items de inventario creados`);

  // Crear ventas del último mes
  const treatments = [
    { name: "Consulta General", amount: 50000 },
    { name: "Limpieza Dental (Profilaxis)", amount: 80000 },
    { name: "Resina Dental (1 superficie)", amount: 150000 },
    { name: "Extracción Simple", amount: 120000 },
    { name: "Blanqueamiento Dental", amount: 450000 },
    { name: "Endodoncia", amount: 380000 },
    { name: "Corona Porcelana", amount: 650000 },
    { name: "Ortodoncia", amount: 200000 },
    { name: "Implantes Dentales", amount: 2000000 },
    { name: "Diseño de Sonrisa", amount: 3500000 },
    { name: "Lentes Cerámicos", amount: 2500000 },
    { name: "Bichectomía", amount: 1200000 },
    { name: "Periodoncia", amount: 150000 },
    { name: "Rehabilitación Oral", amount: 1500000 },
  ];

  const paymentMethods = ["efectivo", "tarjeta", "transferencia", "nequi"];
  const statuses = ["completada", "completada", "completada", "completada", "pendiente"];

  const sales = [];
  for (let i = 0; i < 30; i++) {
    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];
    const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Fecha aleatoria en los últimos 30 días
    const daysAgo = Math.floor(Math.random() * 30);
    const saleDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const sale = await prisma.sale.create({
      data: {
        date: saleDate,
        patientId: randomPatient.id,
        treatment: randomTreatment.name,
        amount: randomTreatment.amount,
        paymentMethod: randomPayment,
        status: randomStatus,
      },
    });

    // Algunas ventas usan inventario
    if (Math.random() > 0.4) { // 60% de las ventas usan inventario
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
      const usedItems: string[] = [];

      for (let j = 0; j < numItems; j++) {
        const randomItem = inventoryItems[Math.floor(Math.random() * inventoryItems.length)];
        if (!usedItems.includes(randomItem.id)) {
          usedItems.push(randomItem.id);
          const quantityUsed = Math.floor(Math.random() * 3) + 1;

          await prisma.saleInventoryItem.create({
            data: {
              saleId: sale.id,
              inventoryId: randomItem.id,
              quantityUsed,
            },
          });

          // Actualizar stock
          await prisma.inventoryItem.update({
            where: { id: randomItem.id },
            data: { currentStock: { decrement: quantityUsed } },
          });

          // Crear movimiento
          await prisma.inventoryMovement.create({
            data: {
              inventoryId: randomItem.id,
              type: "salida",
              quantity: quantityUsed,
              reason: `Venta: ${randomTreatment.name}`,
              referenceId: sale.id,
              date: saleDate,
            },
          });
        }
      }
    }

    sales.push(sale);
  }

  console.log(`✅ ${sales.length} ventas creadas`);

  // Crear planes de pago de ejemplo
  const paymentPlansData = [
    {
      patient: patients[0],
      treatment: "Diseño de Sonrisa",
      totalAmount: 3500000,
      downPayment: 500000,
      installments: 6,
      installmentAmount: 500000,
      startDate: new Date(),
    },
    {
      patient: patients[1],
      treatment: "Implantes Dentales + Corona",
      totalAmount: 2650000,
      downPayment: 650000,
      installments: 4,
      installmentAmount: 500000,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Started 30 days ago
    },
    {
      patient: patients[2],
      treatment: "Lentes Cerámicos",
      totalAmount: 2500000,
      downPayment: 500000,
      installments: 4,
      installmentAmount: 500000,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Started 60 days ago
    },
  ];

  const paymentPlans = [];
  for (let i = 0; i < paymentPlansData.length; i++) {
    const planData = paymentPlansData[i];

    // Crear la venta asociada al plan de pago
    const sale = await prisma.sale.create({
      data: {
        date: planData.startDate,
        patientId: planData.patient.id,
        treatment: planData.treatment,
        amount: planData.totalAmount,
        paymentMethod: "plan_pagos",
        status: "pendiente",
      },
    });

    // Calcular remaining amount
    const remainingAmount = planData.totalAmount - planData.downPayment;

    // Determinar próxima fecha de pago
    const today = new Date();
    let nextDueDate = new Date(planData.startDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    // Crear el plan de pago
    const paymentPlan = await prisma.paymentPlan.create({
      data: {
        patientId: planData.patient.id,
        treatment: planData.treatment,
        saleId: sale.id,
        totalAmount: planData.totalAmount,
        downPayment: planData.downPayment,
        installments: planData.installments,
        installmentAmount: planData.installmentAmount,
        paidAmount: planData.downPayment,
        remainingAmount: remainingAmount,
        frequency: "mensual",
        status: "active",
        startDate: planData.startDate,
        nextDueDate: nextDueDate,
        createdBy: admin.id,
      },
    });

    // Crear las cuotas
    for (let j = 0; j < planData.installments; j++) {
      const dueDate = new Date(planData.startDate);
      dueDate.setMonth(dueDate.getMonth() + j + 1);

      // Para el segundo plan (índice 1), marcar primera cuota como pagada
      // Para el tercer plan (índice 2), marcar primeras dos cuotas como pagadas
      let installmentStatus = "pending";
      let paidDate = null;
      let paymentMethod = null;

      if (i === 1 && j === 0) {
        installmentStatus = "paid";
        paidDate = new Date(planData.startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        paymentMethod = "transferencia";
      } else if (i === 2 && j < 2) {
        installmentStatus = "paid";
        paidDate = new Date(planData.startDate.getTime() + (j + 1) * 30 * 24 * 60 * 60 * 1000);
        paymentMethod = j === 0 ? "efectivo" : "tarjeta";
      } else if (dueDate < today) {
        installmentStatus = "overdue";
      }

      await prisma.paymentInstallment.create({
        data: {
          paymentPlanId: paymentPlan.id,
          installmentNumber: j + 1,
          amount: planData.installmentAmount,
          dueDate: dueDate,
          paidDate: paidDate,
          paidAmount: installmentStatus === "paid" ? planData.installmentAmount : null,
          status: installmentStatus,
          paymentMethod: paymentMethod,
        },
      });

      // Actualizar paidAmount y remainingAmount si la cuota está pagada
      if (installmentStatus === "paid") {
        await prisma.paymentPlan.update({
          where: { id: paymentPlan.id },
          data: {
            paidAmount: { increment: planData.installmentAmount },
            remainingAmount: { decrement: planData.installmentAmount },
          },
        });
      }
    }

    // Actualizar nextDueDate al próximo pago pendiente
    const nextPendingInstallment = await prisma.paymentInstallment.findFirst({
      where: {
        paymentPlanId: paymentPlan.id,
        status: { in: ["pending", "overdue"] },
      },
      orderBy: { dueDate: "asc" },
    });

    if (nextPendingInstallment) {
      await prisma.paymentPlan.update({
        where: { id: paymentPlan.id },
        data: { nextDueDate: nextPendingInstallment.dueDate },
      });
    }

    paymentPlans.push(paymentPlan);
  }

  console.log(`✅ ${paymentPlans.length} planes de pago creados`);

  // Crear proveedores
  const suppliersData = [
    { name: "Dental Supply Colombia", phone: "+57 (4) 555-1234", email: "ventas@dentalsupply.com" },
    { name: "Insumos Odontológicos S.A.", phone: "+57 (4) 555-2345", email: "pedidos@insumosdental.com" },
    { name: "Distribuidora Médica Del Valle", phone: "+57 (2) 555-3456", email: "info@medivalle.com" },
    { name: "Equipos Dentales Ltda", phone: "+57 (1) 555-4567", email: "contacto@equiposdental.com" },
    { name: "Suministros Odonto Plus", phone: "+57 (4) 555-5678", email: "ventas@odontoplus.com" },
  ];

  const suppliers = [];
  for (const supplierData of suppliersData) {
    const supplier = await prisma.supplier.create({ data: supplierData });
    suppliers.push(supplier);
  }

  console.log(`✅ ${suppliers.length} proveedores creados`);

  // Crear compras del último mes
  const purchasesData = [
    {
      supplier: suppliers[0],
      invoiceNumber: "FC-2024-001",
      category: "Material Restaurador",
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Resina Composite A2", quantity: 20, unit: "unidad", unitPrice: 75000 },
        { productName: "Resina Composite A3", quantity: 15, unit: "unidad", unitPrice: 75000 },
      ],
    },
    {
      supplier: suppliers[1],
      invoiceNumber: "FC-2024-002",
      category: "Anestesia",
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Lidocaína 2% con Epinefrina", quantity: 100, unit: "carpule", unitPrice: 2200 },
        { productName: "Articaína 4%", quantity: 50, unit: "carpule", unitPrice: 3200 },
      ],
    },
    {
      supplier: suppliers[0],
      invoiceNumber: "FC-2024-003",
      category: "Bioseguridad",
      date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Guantes de Nitrilo Talla M", quantity: 500, unit: "par", unitPrice: 700 },
        { productName: "Mascarillas Quirúrgicas", quantity: 500, unit: "unidad", unitPrice: 450 },
      ],
    },
    {
      supplier: suppliers[2],
      invoiceNumber: "FC-2024-004",
      category: "Instrumental Rotatorio",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Fresas Carburo #330", quantity: 30, unit: "unidad", unitPrice: 7500 },
        { productName: "Fresas Diamante Redonda", quantity: 25, unit: "unidad", unitPrice: 11000 },
      ],
    },
    {
      supplier: suppliers[1],
      invoiceNumber: "FC-2024-005",
      category: "Medicamentos",
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Amoxicilina 500mg", quantity: 100, unit: "cápsula", unitPrice: 700 },
        { productName: "Ibuprofeno 400mg", quantity: 100, unit: "tableta", unitPrice: 350 },
      ],
    },
    {
      supplier: suppliers[3],
      invoiceNumber: "FC-2024-006",
      category: "Endodoncia",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Limas K-File #15", quantity: 20, unit: "unidad", unitPrice: 14000 },
        { productName: "Limas K-File #20", quantity: 20, unit: "unidad", unitPrice: 14000 },
        { productName: "Gutapercha #25", quantity: 15, unit: "unidad", unitPrice: 17000 },
      ],
    },
    {
      supplier: suppliers[4],
      invoiceNumber: "FC-2024-007",
      category: "Estética",
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Gel Blanqueador 35%", quantity: 10, unit: "jeringa", unitPrice: 70000 },
        { productName: "Gel Blanqueador 16%", quantity: 10, unit: "jeringa", unitPrice: 52000 },
      ],
    },
    {
      supplier: suppliers[2],
      invoiceNumber: "FC-2024-008",
      category: "Radiología",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Película Radiográfica Periapical", quantity: 200, unit: "unidad", unitPrice: 2600 },
      ],
    },
    {
      supplier: suppliers[0],
      invoiceNumber: "FC-2024-009",
      category: "Material Consumible",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Rollos de Algodón", quantity: 30, unit: "paquete", unitPrice: 11000 },
        { productName: "Gasas Estériles", quantity: 20, unit: "paquete", unitPrice: 8000 },
      ],
    },
    {
      supplier: suppliers[1],
      invoiceNumber: "FC-2024-010",
      category: "Profilaxis",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      items: [
        { productName: "Copas de Profilaxis", quantity: 100, unit: "unidad", unitPrice: 1100 },
        { productName: "Pasta Profiláctica Fresa", quantity: 10, unit: "tarro", unitPrice: 26000 },
      ],
    },
  ];

  const purchases = [];
  for (const purchaseData of purchasesData) {
    const totalAmount = purchaseData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const purchase = await prisma.purchase.create({
      data: {
        date: purchaseData.date,
        supplierId: purchaseData.supplier.id,
        invoiceNumber: purchaseData.invoiceNumber,
        category: purchaseData.category,
        totalAmount: totalAmount,
        createdBy: admin.id,
      },
    });

    for (const item of purchaseData.items) {
      await prisma.purchaseItem.create({
        data: {
          purchaseId: purchase.id,
          productName: item.productName,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        },
      });
    }

    purchases.push(purchase);
  }

  console.log(`✅ ${purchases.length} compras creadas`);

  // Crear gastos mensuales
  const expensesData = [
    {
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      category: "Nómina",
      description: "Nómina mensual personal consultorio",
      amount: 8000000,
      frequency: "mensual",
      status: "pagado",
    },
    {
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      category: "Arriendo",
      description: "Arriendo local consultorio",
      amount: 2500000,
      frequency: "mensual",
      status: "pagado",
    },
    {
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      category: "Servicios Públicos",
      description: "Energía, agua, internet",
      amount: 450000,
      frequency: "mensual",
      status: "pagado",
    },
    {
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      category: "Aseo y Mantenimiento",
      description: "Servicio de aseo y mantenimiento del consultorio",
      amount: 300000,
      frequency: "mensual",
      status: "pagado",
    },
    {
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      category: "Marketing y Publicidad",
      description: "Campaña digital redes sociales",
      amount: 800000,
      frequency: "mensual",
      status: "pagado",
    },
    {
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      category: "Impuestos y Contribuciones",
      description: "ICA y contribuciones",
      amount: 500000,
      frequency: "mensual",
      status: "pagado",
    },
    {
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      category: "Seguros",
      description: "Seguro de responsabilidad civil profesional",
      amount: 350000,
      frequency: "mensual",
      status: "pagado",
    },
    {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: "Otros",
      description: "Gastos varios y misceláneos",
      amount: 200000,
      frequency: "unico",
      status: "pagado",
    },
  ];

  const expenses = [];
  for (const expenseData of expensesData) {
    const expense = await prisma.expense.create({
      data: {
        ...expenseData,
        createdBy: admin.id,
      },
    });
    expenses.push(expense);
  }

  console.log(`✅ ${expenses.length} gastos creados`);

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
