"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, Sparkles, Shield, Users } from "lucide-react";

export default function LoginProposalsPage() {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  const proposals = [
    {
      id: 1,
      name: "Propuesta 1: Minimalista Profesional",
      description: "Diseño limpio inspirado en loopera.co con enfoque en simplicidad",
      style: "minimal"
    },
    {
      id: 2,
      name: "Propuesta 2: Médico Elegante",
      description: "Interfaz elegante con elementos médicos y espacios amplios",
      style: "elegant"
    },
    {
      id: 3,
      name: "Propuesta 3: Multi-tenant Moderno",
      description: "Diseño moderno con selector de consultorio/doctor",
      style: "modern"
    }
  ];

  return (
    <div className="min-h-screen bg-warm-gradient p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Propuestas de Diseño - Login
          </h1>
          <p className="text-gray-600 mb-4">
            3 diseños inspirados en loopera.co con sistema multi-tenant para doctores
          </p>
          <Button onClick={() => window.print()} className="print:hidden">
            Descargar como PDF
          </Button>
        </div>

        {/* Design Inspiration */}
        <Card className="mb-8 p-6 print:break-inside-avoid">
          <h3 className="text-xl font-semibold mb-4">Inspiración: loopera.co</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-12 bg-red-500 rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Rojo Principal</p>
            </div>
            <div>
              <div className="h-12 bg-blue-600 rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Azul Acento</p>
            </div>
            <div>
              <div className="h-12 bg-gray-900 rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Negro</p>
            </div>
            <div>
              <div className="h-12 bg-gray-200 rounded-lg mb-2"></div>
              <p className="text-sm font-medium">Gris Claro</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p><strong>Características:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Diseño limpio y minimalista</li>
              <li>Bordes muy redondeados (xl-2xl)</li>
              <li>Sombras sutiles con hover effects</li>
              <li>Tipografía sans-serif moderna</li>
              <li>Espaciado generoso</li>
            </ul>
          </div>
        </Card>

        {/* Proposals */}
        <div className="space-y-8">
          {/* Propuesta 1 */}
          <Card className="overflow-hidden print:break-inside-avoid">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{proposals[0].name}</h2>
                  <p className="text-gray-600">{proposals[0].description}</p>
                </div>
                {selectedProposal === 1 && <Check className="h-6 w-6 text-green-600" />}
              </div>

              <div className="bg-gray-100 rounded-2xl p-8 h-[600px] flex items-center justify-center">
                <Proposal1Design />
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-semibold">Características:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-teal-500 mt-0.5" />
                    <span>Fondo simple con card flotante central</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-teal-500 mt-0.5" />
                    <span>Logo y tagline minimalista</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-teal-500 mt-0.5" />
                    <span>Botón de acción en teal (marca CR Dental)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-teal-500 mt-0.5" />
                    <span>Sin distracciones, foco en credenciales</span>
                  </li>
                </ul>
                <Button
                  onClick={() => setSelectedProposal(1)}
                  className="w-full mt-4"
                  variant={selectedProposal === 1 ? "default" : "outline"}
                >
                  {selectedProposal === 1 ? "Seleccionada" : "Seleccionar"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Propuesta 2 */}
          <Card className="overflow-hidden print:break-inside-avoid">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{proposals[1].name}</h2>
                  <p className="text-gray-600">{proposals[1].description}</p>
                </div>
                {selectedProposal === 2 && <Check className="h-6 w-6 text-green-600" />}
              </div>

              <div className="bg-white rounded-2xl p-8 h-[600px] flex items-center justify-center">
                <Proposal2Design />
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-semibold">Características:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Split screen: izquierda branding, derecha login</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Gradiente de marca en panel izquierdo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Iconos de beneficios/features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Diseño más corporativo y profesional</span>
                  </li>
                </ul>
                <Button
                  onClick={() => setSelectedProposal(2)}
                  className="w-full mt-4"
                  variant={selectedProposal === 2 ? "default" : "outline"}
                >
                  {selectedProposal === 2 ? "Seleccionada" : "Seleccionar"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Propuesta 3 */}
          <Card className="overflow-hidden print:break-inside-avoid">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{proposals[2].name}</h2>
                  <p className="text-gray-600">{proposals[2].description}</p>
                </div>
                {selectedProposal === 3 && <Check className="h-6 w-6 text-green-600" />}
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-2xl p-8 h-[600px] flex items-center justify-center">
                <Proposal3Design />
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-semibold">Características (MULTI-TENANT):</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-coral-500 mt-0.5" />
                    <span><strong>Selector de Consultorio:</strong> Cada doctor tiene su espacio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-coral-500 mt-0.5" />
                    <span>Subdominios o rutas: dr-rodriguez.crdentalstudio.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-coral-500 mt-0.5" />
                    <span>Cada doctor puede tener su logo y colores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-coral-500 mt-0.5" />
                    <span>Lista de consultorios/doctores disponibles</span>
                  </li>
                </ul>
                <Button
                  onClick={() => setSelectedProposal(3)}
                  className="w-full mt-4"
                  variant={selectedProposal === 3 ? "default" : "outline"}
                >
                  {selectedProposal === 3 ? "Seleccionada" : "Seleccionar"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Propuesta 1: Minimalista
function Proposal1Design() {
  return (
    <Card className="w-full max-w-md card-floating">
      <div className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">CR Dental Studio</h1>
          <p className="text-sm text-gray-500">Sonrisas que llegan al alma</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="tu@email.com" className="mt-1" />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" placeholder="••••••••" className="mt-1" />
          </div>
        </div>

        <Button className="w-full bg-brand-gradient">
          Iniciar Sesión
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="text-center text-xs text-gray-500">
          <a href="#" className="hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </Card>
  );
}

// Propuesta 2: Split Screen Elegante
function Proposal2Design() {
  return (
    <div className="w-full max-w-5xl h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
      {/* Left Panel - Branding */}
      <div className="w-1/2 bg-brand-gradient p-12 flex flex-col justify-center text-white">
        <h2 className="text-4xl font-bold mb-4">Bienvenido a CR Dental Studio</h2>
        <p className="text-lg mb-8 text-white/90">
          Sistema de gestión dental profesional
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              ✓
            </div>
            <span>Gestión de pacientes</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              ✓
            </div>
            <span>Control de inventario</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              ✓
            </div>
            <span>Planes de pago</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-6">Iniciar Sesión</h3>
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" className="mt-1" />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" className="mt-1" />
          </div>
          <Button className="w-full">Ingresar</Button>
        </div>
      </div>
    </div>
  );
}

// Propuesta 3: Multi-tenant
function Proposal3Design() {
  return (
    <Card className="w-full max-w-lg card-floating">
      <div className="p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">CR Dental Studio</h1>
          <p className="text-sm text-gray-500">Sistema Multi-Consultorio</p>
        </div>

        {/* Selector de Consultorio */}
        <div>
          <Label>Selecciona tu Consultorio</Label>
          <select className="w-full mt-1 rounded-lg border border-gray-300 p-2">
            <option>Dr. Carlos Rodríguez - Medellín Centro</option>
            <option>Dra. Ana Martínez - Poblado</option>
            <option>Dr. Luis Gómez - Envigado</option>
            <option>Dra. María Pérez - Sabaneta</option>
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="tu@email.com" className="mt-1" />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" placeholder="••••••••" className="mt-1" />
          </div>
        </div>

        <Button className="w-full">
          Ingresar al Consultorio
        </Button>

        <div className="text-center text-xs text-gray-500 border-t pt-4">
          <p className="mb-2">¿Eres nuevo doctor?</p>
          <a href="#" className="text-teal-600 hover:underline">Registra tu consultorio aquí</a>
        </div>
      </div>
    </Card>
  );
}
