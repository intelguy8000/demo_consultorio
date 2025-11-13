"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const EXPENSE_CATEGORIES = [
  "Nómina",
  "Arriendo",
  "Servicios Públicos",
  "Aseo y Mantenimiento",
  "Marketing y Publicidad",
  "Impuestos y Contribuciones",
  "Seguros",
  "Otros",
];

const FREQUENCIES = [
  { value: "unico", label: "Único" },
  { value: "mensual", label: "Mensual" },
  { value: "anual", label: "Anual" },
];

const STATUSES = [
  { value: "pagado", label: "Pagado" },
  { value: "pendiente", label: "Pendiente" },
  { value: "vencido", label: "Vencido" },
];

export default function NuevoGastoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [displayAmount, setDisplayAmount] = useState("");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
    amount: "",
    frequency: "unico",
    status: "pagado",
  });

  // Formatear monto con separador de miles
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return new Intl.NumberFormat("es-CO").format(parseInt(numericValue));
  };

  // Handler para cambio de monto
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, amount: value });
    setDisplayAmount(formatCurrency(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(formData.date),
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          frequency: formData.frequency,
          status: formData.status,
        }),
      });

      if (!response.ok) throw new Error("Error al crear el gasto");

      toast.success("Gasto registrado exitosamente");
      router.push("/compras");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al registrar el gasto");
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
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Gasto</h1>
          <p className="text-gray-500 mt-1">
            Registra un nuevo gasto operacional del consultorio
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Gasto</CardTitle>
            <CardDescription>
              Complete los datos del gasto a registrar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fecha y Categoría */}
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
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                type="text"
                placeholder="Ej: Nómina mensual personal consultorio"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Monto, Frecuencia y Estado */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0"
                    value={displayAmount}
                    onChange={handleAmountChange}
                    className="pl-7"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia</Label>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {FREQUENCIES.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end">
              <Link href="/compras">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Gasto"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
