# Prueba_Appinit - Finance Tracker

Proyecto de seguimiento de ingresos y gastos. Reto técnico React - Nextjs. La aplicación permite gestionar transacciones personales con una interfaz.

## 🛠️ Stack Tecnológico
* **Framework:** Next.js 14+ (App Router).
* **Lenguaje:** TypeScript.
* **Estilos:** Tailwind CSS.
* **Gestión de Estado:** Zustand.
* **Validación:** Zod + React Hook Form.
* **Iconos:** Lucide React.


## Hooks Utilizados
Aquí tienes la lista completa de los Hooks utilizados en el código que hemos analizado, clasificados por su origen:

* Hooks de React (Nativos)
```text
useState -> Manejo de estados locales como abrir/cerrar modales, filtros activos y datos de formularios en edición.
useEffect -> Ejecutar efectos secundarios, como verificar si el usuario está autenticado al cargar la página.
useContext -> Utilizado internamente en el AuthContext para compartir el estado de sesión globalmente.
useMemo -> Para optimizar cálculos pesados, como sumar los totales de ingresos/gastos y filtrar la lista de transacciones.
```

* Hooks de Next.js
```text
useRouter -> Permite la navegación, usado para redirigir al usuario al /dashboard después del login.
```

* Hooks de Librerías (Terceros)
```text
useForm (de React Hook Form) -> Gestiona el estado de los formularios, validaciones (con Zod) y el envío de datos.
```

* Custom Hooks (Propios del Proyecto)
```text
useAuth -> Hook personalizado que envuelve a useContext. Simplifica el acceso a la información del usuario desde cualquier componente.
useTransactionStore -> Permite leer y modificar las transacciones desde cualquier parte de la app.
```

## 📁 Estructura del Proyecto
El proyecto sigue una arquitectura escalable para el frontend:

```text
src/
├── app/                  # Sistema de rutas (App Router)
│   ├── (auth)/           # Grupo de rutas de autenticación (Login) 
│   └── (dashboard)/      # Grupo de rutas del tablero principal
├── components/           # Componentes UI reutilizables
├── context/              # Contexto de autenticación y sesión 
├── services/             # Estado global con Zustand (Transacciones) 
├── types/                # Interfaces y tipos de TypeScript
├── validations/          # Utilidades y esquemas de validación (Zod)
└── __tests__/            # Pruebas unitarias
```

## 🚀 Instalación y Ejecución Local

* Asegúrate de tener instalado:

```text
> Node.js v24 o superior
> npm o yarn
> Editor de código (recomendado: Visual Studio Code)
```

* Clonar el Repositorio:

```bash
git clone https://github.com/tatanlejo17/prueba_appinit.git
cd Prueba_Appinit
```

* Instalación de Dependencias:
Abre la terminal integrada y ejecuta

```bash
npm install
```

* Ejecutar la Aplicación:

```bash
npm run dev
```

* La aplicación estará disponible en:

```text
http://localhost:3000
```

## 🔐 Acceso a la Aplicación (Login)
La pantalla inicial corresponde al módulo de autenticación

* Credenciales de Acceso (Mock)

- El sistema no valida credenciales reales.
- Cualquier dato que cumpla con el formato requerido permitirá el acceso.

```text
Correo electrónico -> Cualquier email válido
Ejemplo: usuario@correo.com
```

```text
Contraseña -> Cualquier valor de mínimo 6 caracteres
Ejemplo: 123456
```

* Al enviar el formulario, el sistema redirige automáticamente al Dashboard.

## 📊 Dashboard

Una vez autenticado, se carga el tablero principal donde podrás:

* Visualizar transacciones (mock)
* Crear ingresos y gastos
* Filtrar y categorizar movimientos
* Ver resumen de las transacciones

## 📊 Test

* Se realiza un test de prueba utilizando jest

```bash
npm run test:watch
```