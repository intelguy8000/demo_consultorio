import { NextResponse } from "next/server";

function getMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("ventas") || lowerMessage.includes("venta")) {
    return "Las ventas de este mes van en $15,000,000 COP. Un 12% más que el mes anterior. 🎉";
  }

  if (lowerMessage.includes("inventario") || lowerMessage.includes("stock") || lowerMessage.includes("productos")) {
    return "Tienes 3 productos en estado crítico: Guantes L, Resina A3, y Lidocaína 2%. Te recomiendo hacer un pedido pronto.";
  }

  if (lowerMessage.includes("cobrar") || lowerMessage.includes("cuentas por cobrar") || lowerMessage.includes("deudas")) {
    return "Esta semana tienes $2,400,000 COP por cobrar de 5 pacientes con cuotas pendientes. 2 de ellas están vencidas.";
  }

  if (lowerMessage.includes("tratamiento") || lowerMessage.includes("rentable") || lowerMessage.includes("margen")) {
    return "Tu tratamiento más rentable es Diseño de Sonrisa con un margen del 68%. Le sigue Ortodoncia con 54%.";
  }

  if (lowerMessage.includes("gastos") || lowerMessage.includes("gasto")) {
    return "Los gastos de este mes suman $8,200,000 COP. El mayor gasto es Nómina ($5,000,000), seguido de Materiales ($2,100,000).";
  }

  if (lowerMessage.includes("pacientes") || lowerMessage.includes("clientes")) {
    return "Tienes 10 pacientes registrados. 3 pacientes tienen citas pendientes esta semana. El paciente más recurrente es María García con 8 visitas.";
  }

  if (lowerMessage.includes("pyg") || lowerMessage.includes("pérdidas") || lowerMessage.includes("ganancias")) {
    return "Tu P&G muestra utilidad neta de $6,800,000 este mes. Margen operacional: 45%. Muy por encima del promedio del sector (30%).";
  }

  if (lowerMessage.includes("compras") || lowerMessage.includes("proveedores")) {
    return "Este mes has realizado 10 compras por un total de $3,500,000 COP. Tu proveedor principal es DentalCo con 6 órdenes.";
  }

  if (lowerMessage.includes("hola") || lowerMessage.includes("hello") || lowerMessage.includes("ayuda")) {
    return "¡Hola! 👋 Soy tu asistente de CR Dental Studio. Puedo ayudarte con información sobre ventas, inventario, cuentas por cobrar, gastos, pacientes, P&G y más. ¿Qué necesitas saber?";
  }

  return "Puedo ayudarte con información sobre ventas, inventario, cuentas por cobrar, tratamientos rentables, gastos, pacientes, P&G y proveedores. ¿Qué necesitas saber específicamente?";
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Mensaje vacío" },
        { status: 400 }
      );
    }

    // TODO: Integrar OpenAI API aquí cuando esté configurado
    // Por ahora, usamos respuestas mock basadas en keywords

    const response = getMockResponse(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Error al procesar mensaje" },
      { status: 500 }
    );
  }
}
