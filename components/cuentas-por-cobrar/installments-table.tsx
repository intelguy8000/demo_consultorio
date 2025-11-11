"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Installment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  paidDate: Date | null;
  status: string;
  paymentMethod: string | null;
  notes: string | null;
}

interface Props {
  installments: Installment[];
  paymentPlanId: string;
}

export function InstallmentsTable({ installments, paymentPlanId }: Props) {
  const router = useRouter();
  const [payingInstallment, setPayingInstallment] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (installment: Installment) => {
    if (installment.status === "paid") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Pagada
        </span>
      );
    }

    if (installment.status === "overdue") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Vencida
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Pendiente
      </span>
    );
  };

  const handleRegisterPayment = async (installmentId: string) => {
    setLoading(true);

    try {
      const response = await fetch("/api/payment-plans/installments/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          installmentId,
          paymentMethod,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al registrar el pago");
      }

      toast.success("Pago registrado exitosamente");
      setPayingInstallment(null);
      setPaymentMethod("efectivo");
      setNotes("");
      router.refresh();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error al registrar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cuota
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vencimiento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Pago
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Método de Pago
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {installments.map((installment) => (
            <>
              <tr key={installment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Cuota #{installment.installmentNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${installment.amount.toLocaleString("es-CO")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(installment.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {installment.paidDate
                    ? formatDate(installment.paidDate)
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {installment.paymentMethod || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(installment)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {installment.status !== "paid" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPayingInstallment(
                          payingInstallment === installment.id
                            ? null
                            : installment.id
                        )
                      }
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      {payingInstallment === installment.id
                        ? "Cancelar"
                        : "Registrar Pago"}
                    </Button>
                  )}
                </td>
              </tr>

              {/* Formulario de Registro de Pago */}
              {payingInstallment === installment.id && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 bg-blue-50">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Registrar Pago - Cuota #{installment.installmentNumber}
                      </h4>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Monto</Label>
                          <Input
                            type="text"
                            value={`$${installment.amount.toLocaleString("es-CO")}`}
                            disabled
                            className="bg-gray-100"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="paymentMethod">Método de Pago</Label>
                          <select
                            id="paymentMethod"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="nequi">Nequi</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Notas (Opcional)</Label>
                          <Input
                            id="notes"
                            type="text"
                            placeholder="Ej: Pago completo, sin novedad"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRegisterPayment(installment.id)}
                          disabled={loading}
                        >
                          {loading ? "Registrando..." : "Confirmar Pago"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPayingInstallment(null);
                            setNotes("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
