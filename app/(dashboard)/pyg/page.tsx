"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  const [revenueVsExpenses, setRevenueVsExpenses] = useState<any[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener P&G del mes actual
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    Promise.all([
      fetch(`/api/pyg?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`).then((r) => r.json()),
      fetch(`/api/pyg?type=revenue-vs-expenses&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`).then((r) => r.json()),
      fetch(`/api/pyg?type=expenses-by-category&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`).then((r) => r.json()),
    ])
      .then(([pygData, revenueData, expensesData]) => {
        setPyg(pygData);
        setRevenueVsExpenses(revenueData);
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
              <span className="text-blue-600">
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
              <span className="text-blue-600">
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

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Ingresos vs Gastos */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos vs Gastos</CardTitle>
            <CardDescription>Comparativo del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueVsExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `$${value.toLocaleString("es-CO")}`}
                  />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribución de Gastos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
            <CardDescription>Por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.category} (${(entry.percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
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
