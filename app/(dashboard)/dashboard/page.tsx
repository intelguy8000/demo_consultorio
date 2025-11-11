import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react";

export default function DashboardPage() {
  const kpis = [
    {
      title: "Ventas del Mes",
      value: "$0",
      description: "Próximamente",
      icon: DollarSign,
      trend: "+0%",
    },
    {
      title: "Ingresos Totales",
      value: "$0",
      description: "Próximamente",
      icon: TrendingUp,
      trend: "+0%",
    },
    {
      title: "Compras del Mes",
      value: "$0",
      description: "Próximamente",
      icon: ShoppingCart,
      trend: "+0%",
    },
    {
      title: "Clientes Activos",
      value: "0",
      description: "Próximamente",
      icon: Users,
      trend: "+0",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Vista general del consultorio CR Dental Studio
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                <p className="text-xs text-green-600 mt-2">{kpi.trend} vs mes anterior</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Placeholders */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Mes</CardTitle>
            <CardDescription>Gráfico de barras próximamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Gráfico próximamente</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
            <CardDescription>Gráfico circular próximamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Gráfico próximamente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
