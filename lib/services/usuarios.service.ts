import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
}

/**
 * Obtiene todos los usuarios
 */
export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      // Excluir password
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Crea un nuevo usuario
 */
export async function createUser(data: CreateUserData) {
  // Verificar si ya existe un usuario con ese email
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error(`Ya existe un usuario con el email ${data.email}`);
  }

  // Hash del password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      status: "active",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Actualiza un usuario
 */
export async function updateUser(id: string, data: UpdateUserData) {
  // Si se está actualizando el email, verificar que no exista
  if (data.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing && existing.id !== id) {
      throw new Error(`Ya existe un usuario con el email ${data.email}`);
    }
  }

  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
  };

  // Si se está actualizando el password, hashearlo
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Elimina un usuario
 */
export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}

/**
 * Crea un registro de auditoría
 */
export async function logAudit(data: {
  userId: string;
  action: string;
  module: string;
  recordId?: string;
  details?: string;
}) {
  return await prisma.auditLog.create({
    data,
  });
}

/**
 * Obtiene logs de auditoría con filtros
 */
export async function getAuditLogs(filters?: {
  userId?: string;
  module?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  const where: any = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.module) {
    where.module = filters.module;
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

  return await prisma.auditLog.findMany({
    where,
    take: filters?.limit || 100,
    orderBy: { createdAt: "desc" },
  });
}
