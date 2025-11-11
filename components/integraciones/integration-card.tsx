"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Integration {
  id: string;
  name: string;
  type: string;
  status: string;
  lastSync: Date | null;
  lastError: string | null;
  _count: {
    logs: number;
  };
}

interface Props {
  integration: Integration;
}

export function IntegrationCard({ integration }: Props) {
  const [testing, setTesting] = useState(false);
  const router = useRouter();

  const getStatusBadge = () => {
    switch (integration.status) {
      case "active":
        return <Badge className="bg-green-500">Activa</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Inactiva</Badge>;
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const response = await fetch(`/api/integraciones/${integration.id}/test`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Conexión exitosa");
      } else {
        toast.error("Error en la conexión");
      }

      router.refresh();
    } catch (error) {
      toast.error("Error al probar integración");
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{integration.name}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Tipo: {integration.type} | Total sincronizaciones: {integration._count.logs}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {integration.lastSync && (
          <div className="text-sm">
            <span className="text-muted-foreground">Última sincronización:</span>{" "}
            {new Date(integration.lastSync).toLocaleString("es-CO")}
          </div>
        )}

        {integration.lastError && (
          <div className="text-sm text-red-600">
            <span className="font-medium">Último error:</span> {integration.lastError}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleTest} disabled={testing}>
            {testing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PlayCircle className="h-4 w-4 mr-2" />
            )}
            {testing ? "Probando..." : "Probar Conexión"}
          </Button>

          <Link href={`/integraciones/${integration.id}/logs`}>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Ver Logs
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
