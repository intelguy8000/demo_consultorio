import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface IntegrationFilters {
  status?: string;
  type?: string;
}

/**
 * Obtiene todas las integraciones con filtros opcionales
 */
export async function getIntegrations(filters?: IntegrationFilters) {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.type) {
    where.type = filters.type;
  }

  return await prisma.integration.findMany({
    where,
    include: {
      logs: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { logs: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

/**
 * Obtiene una integración por ID con sus logs
 */
export async function getIntegrationById(id: string) {
  return await prisma.integration.findUnique({
    where: { id },
    include: {
      logs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

/**
 * Obtiene los logs de una integración con filtros
 */
export async function getIntegrationLogs(
  integrationId: string,
  filters?: {
    status?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const where: any = { integrationId };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.action) {
    where.action = filters.action;
  }

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  return await prisma.integrationLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Prueba la conexión de una integración
 */
export async function testIntegration(integrationId: string) {
  // Simular test de conexión (90% de éxito)
  const success = Math.random() > 0.1;

  // Crear log del test
  await prisma.integrationLog.create({
    data: {
      integrationId,
      action: "test",
      status: success ? "success" : "error",
      message: success ? "Conexión exitosa" : "Error de conexión",
      recordsAffected: success ? 1 : 0,
    },
  });

  // Actualizar estado de la integración
  if (success) {
    await prisma.integration.update({
      where: { id: integrationId },
      data: {
        status: "active",
        lastSync: new Date(),
        lastError: null,
      },
    });
  } else {
    await prisma.integration.update({
      where: { id: integrationId },
      data: {
        status: "error",
        lastError: "Connection timeout",
      },
    });
  }

  return success;
}

/**
 * Actualiza el estado de una integración
 */
export async function updateIntegrationStatus(
  integrationId: string,
  status: string
) {
  return await prisma.integration.update({
    where: { id: integrationId },
    data: { status },
  });
}

/**
 * Crea un log de integración
 */
export async function createIntegrationLog(data: {
  integrationId: string;
  action: string;
  status: string;
  message: string;
  recordsAffected?: number;
  details?: string;
}) {
  return await prisma.integrationLog.create({
    data,
  });
}

/**
 * Obtiene estadísticas de integraciones
 */
export async function getIntegrationStats() {
  const total = await prisma.integration.count();
  const active = await prisma.integration.count({
    where: { status: "active" },
  });
  const error = await prisma.integration.count({
    where: { status: "error" },
  });

  const recentLogs = await prisma.integrationLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      integration: true,
    },
  });

  return {
    total,
    active,
    error,
    inactive: total - active - error,
    recentLogs,
  };
}
