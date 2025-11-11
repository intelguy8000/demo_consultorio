"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Phone, Globe, MapPin, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Config {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  logo: string | null;
}

export function ConfigForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const response = await fetch("/api/config");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
      toast.error("Error al cargar la configuración");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    try {
      const response = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast.success("Configuración actualizada correctamente");
      } else {
        toast.error("Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: keyof Config, value: string) {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No se pudo cargar la configuración</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre del Consultorio */}
          <div className="space-y-2">
            <Label htmlFor="name">
              <Building2 className="w-4 h-4 inline mr-2" />
              Nombre del Consultorio
            </Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="CR Dental Studio"
              required
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="w-4 h-4 inline mr-2" />
              Teléfono
            </Label>
            <Input
              id="phone"
              value={config.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+57 (4) 555-1234"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={config.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="info@crdentalstudio.com"
              required
            />
          </div>

          {/* Sitio Web */}
          <div className="space-y-2">
            <Label htmlFor="website">
              <Globe className="w-4 h-4 inline mr-2" />
              Sitio Web
            </Label>
            <Input
              id="website"
              value={config.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://crdentalstudio.com"
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <Label htmlFor="address">
            <MapPin className="w-4 h-4 inline mr-2" />
            Dirección
          </Label>
          <Input
            id="address"
            value={config.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Calle 10 #43-65, Medellín, Colombia"
            required
          />
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
