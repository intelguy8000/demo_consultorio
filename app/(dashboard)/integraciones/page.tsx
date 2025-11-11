import { PrismaClient } from "@prisma/client";
import { IntegrationCard } from "@/components/integraciones/integration-card";

const prisma = new PrismaClient();

export default async function IntegracionesPage() {
  const integrations = await prisma.integration.findMany({
    include: {
      logs: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { logs: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integraciones</h1>
        <p className="text-gray-500 mt-1">
          Gestiona las integraciones externas del sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}
