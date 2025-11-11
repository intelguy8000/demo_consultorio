"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasesTable } from "@/components/compras/purchases-table";
import { ExpensesTable } from "@/components/compras/expenses-table";

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

interface Expense {
  id: string;
  date: Date;
  category: string;
  description: string;
  amount: number;
  status: string;
}

export default function ComprasPage() {
  const [activeTab, setActiveTab] = useState<"compras" | "gastos">("compras");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/compras").then((r) => r.json()),
      fetch("/api/gastos").then((r) => r.json()),
    ])
      .then(([purchasesData, expensesData]) => {
        setPurchases(purchasesData);
        setExpenses(expensesData);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compras & Gastos</h1>
          <p className="text-gray-500 mt-1">
            Gestiona tus compras a proveedores y gastos operacionales
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("compras")}
            className={`${
              activeTab === "compras"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Compras ({purchases.length})
          </button>
          <button
            onClick={() => setActiveTab("gastos")}
            className={`${
              activeTab === "gastos"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Gastos ({expenses.length})
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : (
        <>
          {activeTab === "compras" && (
            <Card>
              <CardHeader>
                <CardTitle>Compras a Proveedores</CardTitle>
                <CardDescription>
                  Historial de compras de insumos y materiales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PurchasesTable purchases={purchases} />
              </CardContent>
            </Card>
          )}

          {activeTab === "gastos" && (
            <Card>
              <CardHeader>
                <CardTitle>Gastos Operacionales</CardTitle>
                <CardDescription>
                  Registro de gastos fijos y variables del consultorio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpensesTable expenses={expenses} />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
