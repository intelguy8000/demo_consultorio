import { notFound, redirect } from "next/navigation";
import { getPaymentPlanById } from "@/lib/services/payment-plans.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { InstallmentsTable } from "@/components/cuentas-por-cobrar/installments-table";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentPlanDetailPage({ params }: Props) {
  const { id } = await params;
  const paymentPlan = await getPaymentPlanById(id);

  if (!paymentPlan) {
    notFound();
  }

  const paidInstallments = paymentPlan.paymentInstallments.filter(
    (i) => i.status === "paid"
  ).length;

  const progressPercentage = Math.round(
    (paymentPlan.paidAmount / paymentPlan.totalAmount) * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cuentas-por-cobrar">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detalle del Plan de Pago</h1>
          <p className="text-gray-500 mt-1">
            {paymentPlan.patient.fullName} - {paymentPlan.treatment}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del Paciente y Venta */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Paciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-medium">{paymentPlan.patient.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Documento</p>
              <p className="font-medium">{paymentPlan.patient.document}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">
                {paymentPlan.patient.email || "No registrado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium">{paymentPlan.patient.phone}</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-500">Tratamiento</p>
              <p className="font-medium">{paymentPlan.treatment}</p>
            </div>
          </CardContent>
        </Card>

        {/* Resumen del Plan de Pago */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Plan de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="text-2xl font-bold">
                ${paymentPlan.totalAmount.toLocaleString("es-CO")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cuota Inicial</p>
                <p className="font-medium">
                  ${paymentPlan.downPayment.toLocaleString("es-CO")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">N° de Cuotas</p>
                <p className="font-medium">{paymentPlan.installments}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Pagado</p>
                <p className="font-medium text-green-600">
                  ${paymentPlan.paidAmount.toLocaleString("es-CO")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Saldo Pendiente</p>
                <p className="font-medium text-blue-600">
                  ${paymentPlan.remainingAmount.toLocaleString("es-CO")}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Progreso del Pago</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {progressPercentage}% completado ({paidInstallments}/{paymentPlan.installments}{" "}
                cuotas)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Cuotas */}
      <Card>
        <CardHeader>
          <CardTitle>Cuotas del Plan de Pago</CardTitle>
          <CardDescription>
            Detalle de cada cuota y registro de pagos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InstallmentsTable
            installments={paymentPlan.paymentInstallments}
            paymentPlanId={paymentPlan.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
