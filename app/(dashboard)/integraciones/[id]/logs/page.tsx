import Link from "next/link";
import { notFound } from "next/navigation";
import { getIntegrationById, getIntegrationLogs } from "@/lib/services/integraciones.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function IntegrationLogsPage({ params }: Props) {
  const { id } = await params;
  const integration = await getIntegrationById(id);

  if (!integration) {
    notFound();
  }

  const logs = await getIntegrationLogs(id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Éxito</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Advertencia</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/integraciones">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Logs de {integration.name}
          </h1>
          <p className="text-gray-500 mt-1">
            Historial de sincronizaciones y operaciones
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Logs</CardTitle>
          <CardDescription>{logs.length} registros totales</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No hay logs registrados para esta integración</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(log.status)}
                      <span className="text-sm font-medium">{log.action}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString("es-CO")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{log.message}</p>
                    {log.recordsAffected !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Registros afectados: {log.recordsAffected}
                      </p>
                    )}
                    {log.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
