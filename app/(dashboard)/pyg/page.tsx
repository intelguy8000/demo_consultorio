"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Percent, Calculator } from "lucide-react";

interface PygData {
  revenue: number;
  directCosts: number;
  grossProfit: number;
  grossMargin: number;
  expenses: number;
  operatingProfit: number;
  operatingMargin: number;
  netProfit: number;
}

export default function PygPage() {
  const [pyg, setPyg] = useState<PygData | null>(null);
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener P&G del mes actual
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    Promise.all([
      fetch(`/api/pyg?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`).then((r) => r.json()),
      fetch(`/api/pyg?type=expenses-by-category&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`).then((r) => r.json()),
    ])
      .then(([pygData, expensesData]) => {
        setPyg(pygData);
        setExpensesByCategory(expensesData);
      })
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF6B6B"];

  if (loading || !pyg) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pérdidas y Ganancias</h1>
        <p className="text-gray-500 mt-1">
          Estado de resultados del mes actual
        </p>
      </div>

      {/* KPIs Principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pyg.revenue.toLocaleString("es-CO")}</div>
            <p className="text-xs text-gray-500 mt-1">Ventas del mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(pyg.directCosts + pyg.expenses).toLocaleString("es-CO")}</div>
            <p className="text-xs text-gray-500 mt-1">Costos + Gastos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen Bruto</CardTitle>
            <Percent className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pyg.grossMargin.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">Utilidad bruta / Ingresos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pyg.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${pyg.netProfit.toLocaleString("es-CO")}
            </div>
            <p className="text-xs text-gray-500 mt-1">Resultado final</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Estado de Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Resultados</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Ingresos</span>
                <span className="text-green-600">${pyg.revenue.toLocaleString("es-CO")}</span>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground pl-4">
                <span>- Costos Directos</span>
                <span>${pyg.directCosts.toLocaleString("es-CO")}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Utilidad Bruta</span>
                <span className="text-teal-600">
                  ${pyg.grossProfit.toLocaleString("es-CO")}
                  <span className="text-sm ml-2 text-gray-500">
                    ({pyg.grossMargin.toFixed(1)}%)
                  </span>
                </span>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground pl-4">
                <span>- Gastos Operacionales</span>
                <span>${pyg.expenses.toLocaleString("es-CO")}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Utilidad Operacional</span>
                <span className="text-teal-600">
                  ${pyg.operatingProfit.toLocaleString("es-CO")}
                  <span className="text-sm ml-2 text-gray-500">
                    ({pyg.operatingMargin.toFixed(1)}%)
                  </span>
                </span>
              </div>

              <Separator className="border-2" />

              <div className="flex justify-between text-xl font-bold">
                <span>Utilidad Neta</span>
                <span className={pyg.netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                  ${pyg.netProfit.toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ratios Financieros */}
        <Card>
          <CardHeader>
            <CardTitle>Ratios Financieros</CardTitle>
            <CardDescription>Indicadores clave de desempeño</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium">Margen Bruto</p>
                    <p className="text-xs text-gray-500">Utilidad bruta / Ingresos</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-teal-600">{pyg.grossMargin.toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Margen Operacional</p>
                    <p className="text-xs text-gray-500">Utilidad operacional / Ingresos</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-purple-600">{pyg.operatingMargin.toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Margen Neto</p>
                    <p className="text-xs text-gray-500">Utilidad neta / Ingresos</p>
                  </div>
                </div>
                <span className={`text-xl font-bold ${pyg.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {((pyg.netProfit / pyg.revenue) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Ratio Gastos/Ingresos</p>
                    <p className="text-xs text-gray-500">Total gastos / Ingresos</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {(((pyg.directCosts + pyg.expenses) / pyg.revenue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Desglose de Gastos por Categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Desglose de Gastos</CardTitle>
            <CardDescription>Detalle por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expensesByCategory.map((expense, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{expense.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${expense.amount.toLocaleString("es-CO")}</p>
                    <p className="text-xs text-gray-500">{(expense.percent * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
              {expensesByCategory.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">No hay gastos registrados</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Distribución de Gastos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
            <CardDescription>Visualización por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.category} (${(entry.percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString("es-CO")}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
