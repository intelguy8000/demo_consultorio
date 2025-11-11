import { NextResponse } from "next/server";
import { getUsers, createUser } from "@/lib/services/usuarios.service";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear usuario" },
      { status: 400 }
    );
  }
}
