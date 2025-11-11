"use client";

import { format } from "date-fns";
import { useState, useMemo } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { InventoryItemWithStatus } from "@/lib/services/inventario.service";

interface InventoryTableProps {
  items: InventoryItemWithStatus[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [filters, setFilters] = useState({
    codigo: "",
    nombre: "",
    categoria: "",
    stockActual: "",
    stockMinimo: "",
    estado: "",
    valorTotal: "",
  });

  const getStatusLabel = (status: string) => {
    const statusConfig = {
      ok: "OK",
      low: "Bajo",
      critical: "Crítico",
    };
    return statusConfig[status as keyof typeof statusConfig] || status;
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const codigo = item.code.slice(0, 8).toLowerCase();
      const nombre = item.name.toLowerCase();
      const categoria = item.category.toLowerCase();
      const stockActual = item.currentStock.toString();
      const stockMinimo = item.minStock.toString();
      const estado = getStatusLabel(item.status).toLowerCase();
      const valorTotal = item.totalValue.toString();

      return (
        codigo.includes(filters.codigo.toLowerCase()) &&
        nombre.includes(filters.nombre.toLowerCase()) &&
        categoria.includes(filters.categoria.toLowerCase()) &&
        stockActual.includes(filters.stockActual) &&
        stockMinimo.includes(filters.stockMinimo) &&
        estado.includes(filters.estado.toLowerCase()) &&
        valorTotal.includes(filters.valorTotal)
      );
    });
  }, [items, filters]);

  const exportToExcel = () => {
    const dataToExport = filteredItems.map((item) => ({
      Código: item.code.slice(0, 8),
      Nombre: item.name,
      Categoría: item.category,
      "Stock Actual": `${item.currentStock} ${item.unit}`,
      "Stock Mínimo": `${item.minStock} ${item.unit}`,
      Estado: getStatusLabel(item.status),
      "Valor Total": item.totalValue,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");
    XLSX.writeFile(wb, `inventario_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const exportToCSV = () => {
    const headers = ["Código", "Nombre", "Categoría", "Stock Actual", "Stock Mínimo", "Estado", "Valor Total"];
    const dataToExport = filteredItems.map((item) => [
      item.code.slice(0, 8),
      item.name,
      item.category,
      `${item.currentStock} ${item.unit}`,
      `${item.minStock} ${item.unit}`,
      getStatusLabel(item.status),
      item.totalValue,
    ]);

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inventario_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ok: { label: "OK", className: "bg-green-100 text-green-800" },
      low: { label: "Bajo", className: "bg-yellow-100 text-yellow-800" },
      critical: { label: "Crítico", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
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
                Código
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Nombre
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Categoría
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Stock Actual
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Stock Mínimo
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Estado
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Valor Total
              </th>
            </tr>
            {/* Filter Row */}
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.codigo}
                  onChange={(e) => setFilters({ ...filters, codigo: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.nombre}
                  onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
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
                  value={filters.stockActual}
                  onChange={(e) => setFilters({ ...filters, stockActual: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.stockMinimo}
                  onChange={(e) => setFilters({ ...filters, stockMinimo: e.target.value })}
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
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.valorTotal}
                  onChange={(e) => setFilters({ ...filters, valorTotal: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-mono text-gray-600">
                  {item.code.slice(0, 8)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  {item.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {item.category}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                  {item.currentStock} {item.unit}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 text-right">
                  {item.minStock} {item.unit}
                </td>
                <td className="py-3 px-4 text-center">
                  {getStatusBadge(item.status)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                  ${item.totalValue.toLocaleString("es-CO")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {items.length === 0 ? "No hay items en el inventario" : "No se encontraron resultados con los filtros aplicados"}
          </div>
        )}
      </div>
    </div>
  );
}
