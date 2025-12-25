"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, LoginFormData } from "@/validations/validations";

/**
 * Página de Login
 * * Este componente gestiona el acceso de usuarios, validando las credenciales
 * mediante un esquema de Zod y coordinando la redirección post-login.
 */
export default function LoginPage() {
  /** * Extraemos 'login' para ejecutar la acción y 'isLoading' para el feedback visual
   * del estado global de autenticación.
   */
  const { login, isLoading } = useAuth();

  /** Hook de Next.js para gestionar la navegación programática. */
  const router = useRouter();

  /**
   * Configuración de React Hook Form para el login.
   * Se vincula con 'loginSchema' para asegurar que los datos cumplen con el formato
   * antes de intentar el proceso de autenticación.
   */
  const { register, handleSubmit, formState: { errors }, } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Función de envío de datos del formulario.
   * @param data - Credenciales validadas (email y password).
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      // 1. Intentamos la autenticación a través del contexto global
      await login(data.email);

      // 2. Si es exitoso, redirigimos al usuario al dashboard
      router.push("/dashboard");
    } catch (error) {
      /**
       * Manejo de excepciones de autenticación.
       */
      console.error("Error al iniciar sesión", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl">

        {/* Cabecera de la página: Logo y Bienvenida */}
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Logo de la aplicación"
            className="block mx-auto rounded-xl mb-10 shadow-lg shadow-app-purple/30"
            width={300}
            height={150}
          />
          <h2 className="text-4xl font-bold text-app-green">Bienvenido</h2>
          <p className="mt-4 text-gray-600">
            Ingresa a tu cuenta de prueba
          </p>
        </div>

        {/* Formulario de acceso */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">

            {/* SECCIÓN: Identificación (Email) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition-all ${errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20"
                  }`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* SECCIÓN: Seguridad (Password) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <input
                {...register("password")}
                type="password"
                className={`w-full rounded-lg border px-4 py-3 outline-none transition-all ${errors.password
                  ? "border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20"
                  }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Botón de acción principal con feedback de estado */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-app-purple py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:bg-gray-400"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                {/* Spinner visual de carga */}
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-app-green"></div>
                Cargando...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}