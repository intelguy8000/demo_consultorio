import { redirect } from "next/navigation";

export default function HomePage() {
  // Siempre redirigir al dashboard (siempre estamos logueados como Dra. Catalina)
  redirect("/dashboard");
}
