"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface PaymentPlan {
  id: string;
  totalAmount: number;
  downPayment: number;
  installments: number;
  installmentAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  nextDueDate: Date;
  treatment: string;
  patient: {
    fullName: string;
    document: string;
  };
  paymentInstallments: Array<{
    status: string;
  }>;
}

interface Props {
  paymentPlans: PaymentPlan[];
}

export function PaymentPlansTable({ paymentPlans }: Props) {
  const getStatusBadge = (plan: PaymentPlan) => {
    const overdueCount = plan.paymentInstallments.filter(
      (i) => i.status === "overdue"
    ).length;
    const paidCount = plan.paymentInstallments.filter(
      (i) => i.status === "paid"
    ).length;

    if (overdueCount > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Vencida
        </span>
      );
    }

    if (paidCount === plan.installments) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completada
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Al día
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (paymentPlans.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No hay planes de pago activos</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paciente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tratamiento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total / Pagado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Saldo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Próximo Pago
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
          {paymentPlans.map((plan) => {
            const paidInstallments = plan.paymentInstallments.filter(
              (i) => i.status === "paid"
            ).length;

            return (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {plan.patient.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {plan.patient.document}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {plan.treatment}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${plan.totalAmount.toLocaleString("es-CO")}
                  </div>
                  <div className="text-sm text-gray-500">
                    Pagado: ${plan.paidAmount.toLocaleString("es-CO")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-blue-600">
                    ${plan.remainingAmount.toLocaleString("es-CO")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {paidInstallments}/{plan.installments} cuotas pagadas
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(plan.nextDueDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${plan.installmentAmount.toLocaleString("es-CO")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(plan)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/cuentas-por-cobrar/${plan.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalle
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
