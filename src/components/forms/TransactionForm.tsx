"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionFormData } from "@/validations/validations";
import { useTransactionStore } from "@/services/useTransactionStore";
import { Transaction } from "@/types";

/**
 * Propiedades del componente TransactionForm.
 */
interface TransactionFormProps {
  /** Función para cerrar el formulario o el modal que lo contiene. */
  onClose: () => void;
  /** Objeto opcional; si se provee, el formulario se inicializa en modo edición. */
  transaction?: Transaction;
}

/**
 * Formulario de transacciones (Ingresos/Gastos).
 * Maneja la creación y actualización de registros utilizando validación con Zod.
 */
export default function TransactionForm({ onClose, transaction }: TransactionFormProps) {
  // Consumo de acciones y estado global del Store de transacciones
  const { addTransaction, updateTransaction, isLoading } = useTransactionStore();

  /** * Determina si el componente está operando en modo edición.
   * La doble negación (!!) convierte el objeto en undefined o un booleano puro.
   */
  const isEditMode = !!transaction;

  /**
   * Inicialización de React Hook Form.
   * - register: Vincula los inputs con el estado del formulario.
   * - handleSubmit: Función que envuelve el onSubmit para ejecutar validaciones primero.
   * - errors: Contiene los mensajes de error generados por el esquema de Zod.
   */
  const { register, handleSubmit, formState: { errors }, } = useForm({
    // Aplica reglas de validación definidas en transactionSchema
    resolver: zodResolver(transactionSchema),
    // Si es edición, cargamos los datos existentes; si no, valores base.
    defaultValues: transaction
      ? {
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
      }
      : {
        type: "expense",
        date: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
      },
  });

  /**
   * Procesa el envío del formulario tras una validación exitosa.
   * @param data - Objeto con los datos validados del formulario.
   */
  const onSubmit = async (data: TransactionFormData) => {
    try {
      if (isEditMode && transaction) {
        // Actualización: Combinamos los nuevos datos con el ID original.
        await updateTransaction({ ...data, id: transaction.id });
      } else {
        // Creación: Enviamos el objeto de datos limpio.
        await addTransaction(data);
      }

      onClose(); // Cierra el formulario tras completar la operación
    } catch (error) {
      console.error("Error al guardar la transacción:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* SECCIÓN: Título de la Transacción */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Título
        </label>
        <input
          {...register("title")}
          className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${errors.title
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20'
            }`}
          placeholder="Ej: Compra de supermercado"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title.message}</p>
        )}
      </div>

      {/* SECCIÓN: Monto (Numérico) y Tipo (Select) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monto
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              $
            </span>
            <input
              type="number"
              step="0.01"
              // valueAsNumber asegura que el dato llegue al onSubmit como número y no como string
              {...register("amount", { valueAsNumber: true })}
              className={`w-full border rounded-lg pl-8 pr-4 py-2.5 outline-none transition-all ${errors.amount
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20"
                }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo
          </label>
          <select
            {...register("type")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-app-purple focus:ring-2 focus:ring-app-purple/20 transition-all bg-white font-medium"
          >
            <option value="income">💰 Ingreso</option>
            <option value="expense">💸 Gasto</option>
          </select>
        </div>
      </div>

      {/* SECCIÓN: Categoría */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Categoría
        </label>
        <input
          {...register("category")}
          className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${errors.category
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20'
            }`}
          placeholder="Ej: Alimentación, Salario, Transporte"
        />
        {errors.category && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.category.message}</p>
        )}
      </div>

      {/* SECCIÓN: Fecha */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Fecha
        </label>
        <input
          type="date"
          {...register("date")}
          className={`w-full border rounded-lg px-4 py-2.5 outline-none transition-all ${errors.date
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-app-purple focus:ring-2 focus:ring-app-purple/20'
            }`}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.date.message}</p>
        )}
      </div>

      {/* SECCIÓN: Acciones (Cancelar y Guardar) */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading} // Previene múltiples clics durante el guardado
          className="flex-1 bg-app-purple text-white py-2.5 rounded-lg font-semibold hover:brightness-110 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Guardando...
            </span>
          ) : (
            isEditMode ? "Actualizar" : "Guardar"
          )}
        </button>
      </div>
    </form>
  );
}