"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ImportAlegraButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImport = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/mock-facturacion/import", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error al importar facturas");
      }

      const data = await response.json();

      toast.success(data.message);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al importar facturas desde Alegra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleImport} disabled={loading}>
      <Download className="mr-2 h-4 w-4" />
      {loading ? "Importando..." : "Importar desde Alegra"}
    </Button>
  );
}
