"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Supplier {
  id: string;
  name: string;
}

interface PurchaseItem {
  id: string;
  productName: string;
  quantity: string;
  unitPrice: string;
  unit: string;
}

const PURCHASE_CATEGORIES = [
  "Material Restaurador",
  "Anestesia",
  "Bioseguridad",
  "Instrumental Rotatorio",
  "Medicamentos",
  "Endodoncia",
  "Periodoncia",
  "Material de Impresión",
  "Estética",
  "Radiología",
  "Sutura",
  "Material Consumible",
  "Profilaxis",
  "Desinfección",
  "Otros",
];

const UNITS = ["unidad", "caja", "paquete", "litro", "kilogramo", "carpule", "frasco", "jeringa", "bolsa", "kit"];

export default function NuevaCompraPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<PurchaseItem[]>([
    { id: "1", productName: "", quantity: "", unitPrice: "", unit: "unidad" },
  ]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    supplierId: "",
    invoiceNumber: "",
    category: "",
  });

  useEffect(() => {
    // Cargar proveedores
    fetch("/api/proveedores")
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch((err) => console.error("Error loading suppliers:", err));
  }, []);

  // Agregar nuevo item
  const addItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      productName: "",
      quantity: "",
      unitPrice: "",
      unit: "unidad",
    };
    setItems([...items, newItem]);
  };

  // Eliminar item
  const removeItem = (id: string) => {
    if (items.length === 1) {
      toast.error("Debe haber al menos un producto");
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  // Actualizar item
  const updateItem = (id: string, field: keyof PurchaseItem, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calcular total de un item
  const getItemTotal = (item: PurchaseItem) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    return quantity * unitPrice;
  };

  // Calcular total general
  const getGrandTotal = () => {
    return items.reduce((sum, item) => sum + getItemTotal(item), 0);
  };

  // Formatear número con separador de miles
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return new Intl.NumberFormat("es-CO").format(parseInt(numericValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validar que todos los items tengan datos
    const invalidItems = items.some(
      (item) => !item.productName || !item.quantity || !item.unitPrice
    );
    if (invalidItems) {
      toast.error("Por favor complete todos los campos de los productos");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(formData.date),
          supplierId: formData.supplierId,
          invoiceNumber: formData.invoiceNumber,
          category: formData.category,
          totalAmount: getGrandTotal(),
          items: items.map((item) => ({
            productName: item.productName,
            quantity: parseInt(item.quantity),
            unit: item.unit,
            unitPrice: parseFloat(item.unitPrice),
            total: getItemTotal(item),
          })),
        }),
      });

      if (!response.ok) throw new Error("Error al crear la compra");

      toast.success("Compra registrada exitosamente");
      router.push("/compras");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al registrar la compra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/compras">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Compra</h1>
          <p className="text-gray-500 mt-1">
            Registra una nueva compra a proveedor
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Información General */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>
              Datos de la factura y proveedor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Proveedor</Label>
                <select
                  id="supplier"
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar proveedor</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Número de Factura</Label>
                <Input
                  id="invoiceNumber"
                  type="text"
                  placeholder="Ej: FC-2024-001"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {PURCHASE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Productos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Productos</CardTitle>
                <CardDescription>
                  Detalles de los productos comprados
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Tabla de productos */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Producto</th>
                      <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Cantidad</th>
                      <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Unidad</th>
                      <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Precio Unit.</th>
                      <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Subtotal</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-2">
                          <Input
                            type="text"
                            placeholder="Nombre del producto"
                            value={item.productName}
                            onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                            className="min-w-[200px]"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                            className="w-24"
                            min="1"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                            className="px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                          >
                            {UNITS.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <div className="relative">
                            <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                            <Input
                              type="number"
                              placeholder="0"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                              className="pl-6 w-32"
                              min="0"
                            />
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right font-medium">
                          ${getItemTotal(item).toLocaleString("es-CO")}
                        </td>
                        <td className="py-2 px-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td colSpan={4} className="py-4 px-2 text-right font-bold text-lg">
                        Total:
                      </td>
                      <td className="py-4 px-2 text-right font-bold text-lg">
                        ${getGrandTotal().toLocaleString("es-CO")}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-end pt-4">
                <Link href="/compras">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Compra"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
