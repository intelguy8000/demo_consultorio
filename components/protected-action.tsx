"use client";

import { useSession } from "next-auth/react";
import { hasPermission, type Module, type Action } from "@/lib/permissions";

interface ProtectedActionProps {
  module: Module;
  action: Action;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedAction({
  module,
  action,
  children,
  fallback = null,
}: ProtectedActionProps) {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  if (!hasPermission(userRole, module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
