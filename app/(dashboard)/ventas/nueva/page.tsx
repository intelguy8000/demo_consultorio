"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TRATAMIENTOS_DENTALES, CATEGORIAS_TRATAMIENTOS } from "@/lib/constants/treatments";

interface Patient {
  id: string;
  fullName: string;
  document: string;
}

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
}

export default function NuevaVentaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [displayAmount, setDisplayAmount] = useState("");
  const [showCustomTreatment, setShowCustomTreatment] = useState(false);
  const [customTreatmentName, setCustomTreatmentName] = useState("");
  const [createPaymentPlan, setCreatePaymentPlan] = useState(false);
  const [paymentPlanData, setPaymentPlanData] = useState({
    downPayment: "",
    installments: "3",
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    patientId: "",
    treatment: "",
    amount: "",
    paymentMethod: "efectivo",
    status: "completada",
  });

  useEffect(() => {
    // Cargar pacientes
    fetch("/api/pacientes")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error("Error loading patients:", err));

    // Cargar inventario
    fetch("/api/inventario")
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error("Error loading inventory:", err));
  }, []);

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

  // Handler para cambio de tratamiento
  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const treatmentName = e.target.value;
    const treatment = TRATAMIENTOS_DENTALES.find((t) => t.nombre === treatmentName);

    // Si selecciona "Otros", mostrar input personalizado
    if (treatmentName === "Otros") {
      setShowCustomTreatment(true);
      setFormData({
        ...formData,
        treatment: "",
        amount: "",
      });
      setDisplayAmount("");
      setCustomTreatmentName("");
    } else {
      setShowCustomTreatment(false);
      setFormData({
        ...formData,
        treatment: treatmentName,
        amount: treatment?.precio.toString() || "",
      });

      if (treatment) {
        setDisplayAmount(formatCurrency(treatment.precio.toString()));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usar nombre personalizado si seleccionó "Otros"
      const treatmentName = showCustomTreatment ? customTreatmentName : formData.treatment;

      const body: any = {
        ...formData,
        treatment: treatmentName,
        amount: parseFloat(formData.amount),
      };

      // Si hay plan de pago, agregarlo al body
      if (createPaymentPlan && formData.status === "pendiente") {
        body.paymentPlan = {
          downPayment: parseFloat(paymentPlanData.downPayment) || 0,
          installments: parseInt(paymentPlanData.installments),
        };
        body.paymentMethod = "plan_pagos";
      }

      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Error creating sale");
      }

      toast.success(
        createPaymentPlan
          ? "Venta y plan de pago creados exitosamente"
          : "Venta creada exitosamente"
      );
      router.push("/ventas");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear la venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ventas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Venta</h1>
          <p className="text-gray-500 mt-1">
            Registra un nuevo tratamiento o servicio
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Venta</CardTitle>
          <CardDescription>
            Completa los datos del tratamiento realizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="patient">Paciente</Label>
                  <Link href="/clientes" target="_blank">
                    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs">
                      <Plus className="mr-1 h-3 w-3" />
                      Nuevo Paciente
                    </Button>
                  </Link>
                </div>
                <select
                  id="patient"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={formData.patientId}
                  onChange={(e) =>
                    setFormData({ ...formData, patientId: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar paciente</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName} - {patient.document}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">Tratamiento</Label>
                <select
                  id="treatment"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={showCustomTreatment ? "Otros" : formData.treatment}
                  onChange={handleTreatmentChange}
                  required={!showCustomTreatment}
                >
                  <option value="">Seleccionar tratamiento</option>
                  {TRATAMIENTOS_DENTALES.map((tratamiento) => (
                    <option key={tratamiento.nombre} value={tratamiento.nombre}>
                      {tratamiento.nombre}
                      {tratamiento.precio > 0 &&
                        ` - $${tratamiento.precio.toLocaleString("es-CO")}`}
                    </option>
                  ))}
                </select>
                {showCustomTreatment && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      placeholder="Escribe el nombre del tratamiento"
                      value={customTreatmentName}
                      onChange={(e) => setCustomTreatmentName(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  {showCustomTreatment
                    ? "Escribe el nombre del tratamiento personalizado"
                    : "El precio se autocompleta según el tratamiento seleccionado"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
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
                <p className="text-xs text-gray-500">
                  Formato: $500.000 (pesos colombianos)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <select
                  id="paymentMethod"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="nequi">Nequi</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={(e) => {
                    setFormData({ ...formData, status: e.target.value });
                    if (e.target.value !== "pendiente") {
                      setCreatePaymentPlan(false);
                    }
                  }}
                >
                  <option value="completada">Completada (Pagada y Realizada)</option>
                  <option value="pendiente">Pendiente (Pago o Tratamiento Pendiente)</option>
                </select>
                <p className="text-xs text-gray-500">
                  <strong>Completada:</strong> Tratamiento realizado y pagado.{" "}
                  <strong>Pendiente:</strong> Pago a crédito o cita programada
                </p>
              </div>
            </div>

            {/* Plan de Pago - Solo si el estado es "pendiente" */}
            {formData.status === "pendiente" && (
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="createPaymentPlan"
                    checked={createPaymentPlan}
                    onChange={(e) => setCreatePaymentPlan(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="createPaymentPlan" className="font-medium">
                    Crear Plan de Pago (Cuotas)
                  </Label>
                </div>

                {createPaymentPlan && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-blue-900">
                      Configuración del Plan de Pago
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="downPayment">Cuota Inicial</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            $
                          </span>
                          <Input
                            id="downPayment"
                            type="text"
                            placeholder="0"
                            value={paymentPlanData.downPayment}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              setPaymentPlanData({
                                ...paymentPlanData,
                                downPayment: value,
                              });
                            }}
                            className="pl-7"
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          Monto que paga hoy (puede ser $0)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="installments">Número de Cuotas</Label>
                        <select
                          id="installments"
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          value={paymentPlanData.installments}
                          onChange={(e) =>
                            setPaymentPlanData({
                              ...paymentPlanData,
                              installments: e.target.value,
                            })
                          }
                        >
                          <option value="2">2 cuotas</option>
                          <option value="3">3 cuotas</option>
                          <option value="4">4 cuotas</option>
                          <option value="5">5 cuotas</option>
                          <option value="6">6 cuotas</option>
                          <option value="9">9 cuotas</option>
                          <option value="12">12 cuotas</option>
                        </select>
                        <p className="text-xs text-gray-600">
                          Pagos mensuales después de la cuota inicial
                        </p>
                      </div>
                    </div>

                    {/* Preview del Plan de Pago */}
                    {formData.amount && (
                      <div className="bg-white p-4 rounded border border-blue-200">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          Resumen del Plan de Pago:
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total venta:</span>
                            <span className="font-medium">
                              ${parseInt(formData.amount).toLocaleString("es-CO")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cuota inicial:</span>
                            <span className="font-medium">
                              $
                              {(parseInt(paymentPlanData.downPayment) || 0).toLocaleString(
                                "es-CO"
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-gray-600">Saldo a financiar:</span>
                            <span className="font-medium">
                              $
                              {(
                                parseInt(formData.amount) -
                                (parseInt(paymentPlanData.downPayment) || 0)
                              ).toLocaleString("es-CO")}
                            </span>
                          </div>
                          <div className="flex justify-between text-blue-700 font-semibold border-t pt-1">
                            <span>
                              Valor de cada cuota ({paymentPlanData.installments}x):
                            </span>
                            <span>
                              $
                              {Math.round(
                                (parseInt(formData.amount) -
                                  (parseInt(paymentPlanData.downPayment) || 0)) /
                                  parseInt(paymentPlanData.installments)
                              ).toLocaleString("es-CO")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-end">
              <Link href="/ventas">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Venta"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
