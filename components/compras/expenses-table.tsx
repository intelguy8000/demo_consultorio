"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useMemo } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";

interface Expense {
  id: string;
  date: Date;
  category: string;
  description: string;
  amount: number;
  status: string;
}

interface ExpensesTableProps {
  expenses: Expense[];
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const [filters, setFilters] = useState({
    fecha: "",
    categoria: "",
    descripcion: "",
    monto: "",
    estado: "",
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const fecha = format(new Date(expense.date), "dd MMM yyyy", { locale: es }).toLowerCase();
      const categoria = expense.category.toLowerCase();
      const descripcion = expense.description.toLowerCase();
      const monto = expense.amount.toString();
      const estado = expense.status.toLowerCase();

      return (
        fecha.includes(filters.fecha.toLowerCase()) &&
        categoria.includes(filters.categoria.toLowerCase()) &&
        descripcion.includes(filters.descripcion.toLowerCase()) &&
        monto.includes(filters.monto) &&
        estado.includes(filters.estado.toLowerCase())
      );
    });
  }, [expenses, filters]);

  const exportToExcel = () => {
    const dataToExport = filteredExpenses.map((expense) => ({
      Fecha: format(new Date(expense.date), "dd/MM/yyyy"),
      Categoría: expense.category,
      Descripción: expense.description,
      Monto: expense.amount,
      Estado: expense.status.charAt(0).toUpperCase() + expense.status.slice(1),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gastos");
    XLSX.writeFile(wb, `gastos_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const exportToCSV = () => {
    const headers = ["Fecha", "Categoría", "Descripción", "Monto", "Estado"];
    const dataToExport = filteredExpenses.map((expense) => [
      format(new Date(expense.date), "dd/MM/yyyy"),
      expense.category,
      expense.description,
      expense.amount,
      expense.status.charAt(0).toUpperCase() + expense.status.slice(1),
    ]);

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `gastos_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pagado: "bg-green-100 text-green-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      vencido: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Export Buttons */}
      <div className="flex gap-2 justify-end">
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
        <Button onClick={exportToExcel} variant="outline" size="sm">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Fecha
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Categoría
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Descripción
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Monto
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Estado
              </th>
            </tr>
            {/* Filter Row */}
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.fecha}
                  onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.categoria}
                  onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.descripcion}
                  onChange={(e) => setFilters({ ...filters, descripcion: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.monto}
                  onChange={(e) => setFilters({ ...filters, monto: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.estado}
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">
                  {format(new Date(expense.date), "dd MMM yyyy", { locale: es })}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  {expense.category}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {expense.description}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right font-semibold">
                  ${expense.amount.toLocaleString("es-CO")}
                </td>
                <td className="py-3 px-4 text-center">
                  {getStatusBadge(expense.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExpenses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {expenses.length === 0 ? "No hay gastos registrados" : "No se encontraron resultados con los filtros aplicados"}
          </div>
        )}
      </div>
    </div>
  );
}
