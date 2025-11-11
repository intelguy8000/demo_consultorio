"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useMemo } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";

interface Purchase {
  id: string;
  date: Date;
  invoiceNumber: string;
  category: string;
  totalAmount: number;
  supplier: {
    name: string;
  };
}

interface PurchasesTableProps {
  purchases: Purchase[];
}

export function PurchasesTable({ purchases }: PurchasesTableProps) {
  const [filters, setFilters] = useState({
    fecha: "",
    factura: "",
    proveedor: "",
    categoria: "",
    total: "",
  });

  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const fecha = format(new Date(purchase.date), "dd MMM yyyy", { locale: es }).toLowerCase();
      const factura = purchase.invoiceNumber.toLowerCase();
      const proveedor = purchase.supplier.name.toLowerCase();
      const categoria = purchase.category.toLowerCase();
      const total = purchase.totalAmount.toString();

      return (
        fecha.includes(filters.fecha.toLowerCase()) &&
        factura.includes(filters.factura.toLowerCase()) &&
        proveedor.includes(filters.proveedor.toLowerCase()) &&
        categoria.includes(filters.categoria.toLowerCase()) &&
        total.includes(filters.total)
      );
    });
  }, [purchases, filters]);

  const exportToExcel = () => {
    const dataToExport = filteredPurchases.map((purchase) => ({
      Fecha: format(new Date(purchase.date), "dd/MM/yyyy"),
      Factura: purchase.invoiceNumber,
      Proveedor: purchase.supplier.name,
      Categoría: purchase.category,
      Total: purchase.totalAmount,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compras");
    XLSX.writeFile(wb, `compras_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const exportToCSV = () => {
    const headers = ["Fecha", "Factura", "Proveedor", "Categoría", "Total"];
    const dataToExport = filteredPurchases.map((purchase) => [
      format(new Date(purchase.date), "dd/MM/yyyy"),
      purchase.invoiceNumber,
      purchase.supplier.name,
      purchase.category,
      purchase.totalAmount,
    ]);

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `compras_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                Factura
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Proveedor
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Categoría
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Total
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
                  value={filters.factura}
                  onChange={(e) => setFilters({ ...filters, factura: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
              <th className="py-2 px-4">
                <Input
                  placeholder="Filtrar..."
                  value={filters.proveedor}
                  onChange={(e) => setFilters({ ...filters, proveedor: e.target.value })}
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
                  value={filters.total}
                  onChange={(e) => setFilters({ ...filters, total: e.target.value })}
                  className="h-8 text-xs"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map((purchase) => (
              <tr key={purchase.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">
                  {format(new Date(purchase.date), "dd MMM yyyy", { locale: es })}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  {purchase.invoiceNumber}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {purchase.supplier.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {purchase.category}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right font-semibold">
                  ${purchase.totalAmount.toLocaleString("es-CO")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPurchases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {purchases.length === 0 ? "No hay compras registradas" : "No se encontraron resultados con los filtros aplicados"}
          </div>
        )}
      </div>
    </div>
  );
}
