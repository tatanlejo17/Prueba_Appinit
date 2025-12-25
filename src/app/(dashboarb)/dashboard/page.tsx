"use client";

import { useState, useEffect, useMemo } from "react";
import { useTransactionStore } from "@/services/useTransactionStore";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import Modal from "@/components/ui/Modal";
import TransactionForm from "@/components/forms/TransactionForm";
import { Plus, ArrowUpDown, Filter, Wallet, ArrowUpCircle, ArrowDownCircle, Edit2, Trash2 } from "lucide-react";
import { Transaction } from "@/types";

/**
 * Gestiona la visualización, filtrado y acciones de transacciones.
 */
export default function DashboardPage() {
  // --- ESTADO GLOBAL ---
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { transactions, getAllTransactions, deleteTransaction, isLoading: dataLoading } = useTransactionStore();

  // --- ESTADO LOCAL (UI) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Estado para el flujo de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  /**
   * Redirige al login si no hay sesión y dispara la carga inicial de datos.
   */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      redirect("/login");
    }
    getAllTransactions();
  }, [isAuthenticated, authLoading, getAllTransactions]);

  /**
   * Cálculo del Resumen Financiero.
   * Se utiliza useMemo para evitar recalcular totales si las transacciones no han cambiado.
   */
  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
    };
  }, [transactions]);

  /**
   * Lógica de Procesamiento de Lista.
   * Aplica filtros de tipo (ingreso/gasto) y ordenamiento por fecha.
   */
  const processedTransactions = useMemo(() => {
    return transactions
      .filter((t) => (filterType === "all" ? true : t.type === filterType))
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, filterType, sortOrder]);

  // --- MANEJADORES DE EVENTOS ---

  const handleCreate = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  /**
   * Pantalla de carga (Spinner).
   * Se muestra durante la validación de auth o la carga inicial de datos.
   */
  if (authLoading || (dataLoading && transactions.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-app-purple border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando tus finanzas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header con información de usuario y acción principal */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="rounded-xl shadow-lg shadow-app-purple/30" width={180} height={90} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 font-medium">
                Bienvenido, <span className="text-app-purple">{user?.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-app-purple hover:brightness-110 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Nueva Transacción
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Grilla de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Balance Neto"
            amount={netBalance}
            icon={<Wallet className="text-app-purple" />}
            accentColor="bg-app-purple/10"
          />
          <SummaryCard
            title="Total Ingresos"
            amount={totalIncome}
            icon={<ArrowUpCircle className="text-app-green" />}
            accentColor="bg-app-green/15"
          />
          <SummaryCard
            title="Total Gastos"
            amount={totalExpenses}
            icon={<ArrowDownCircle className="text-red-500" />}
            accentColor="bg-red-50"
          />
        </div>

        {/* Listado y Filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">Historial</h2>

            <div className="flex items-center gap-3">
              {/* Filtro por Tipo */}
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                <Filter size={16} className="ml-2 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-transparent text-sm font-semibold focus:outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="income">Ingresos</option>
                  <option value="expense">Gastos</option>
                </select>
              </div>

              {/* Toggle de Ordenamiento */}
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white px-4 py-2.5 rounded-xl border border-gray-200"
              >
                <ArrowUpDown size={16} />
                {sortOrder === "asc" ? "Antiguas" : "Recientes"}
              </button>
            </div>
          </div>

          {/* Tabla de Datos */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase font-bold">
                <tr>
                  <th className="px-8 py-4">Descripción</th>
                  <th className="px-8 py-4">Fecha</th>
                  <th className="px-8 py-4 text-right">Monto</th>
                  <th className="px-8 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {processedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-900">{tx.title}</div>
                      <div className="text-xs font-medium text-gray-400">{tx.category}</div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                      {new Date(tx.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className={`px-8 py-5 text-right font-black text-lg ${tx.type === "income" ? "text-app-green" : "text-red-500"
                      }`}>
                      {tx.type === "income" ? "+" : "-"} ${tx.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(tx)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDeleteClick(tx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODALES: Gestión de formularios y confirmaciones */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? "Editar Transacción" : "Nueva Transacción"}
      >
        <TransactionForm
          onClose={() => setIsModalOpen(false)}
          transaction={editingTransaction}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar eliminación"
      >
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de eliminar <span className="font-semibold text-gray-900">“{transactionToDelete?.title}”</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-gray-700">Cancelar</button>
          <button
            onClick={async () => {
              if (transactionToDelete) {
                await deleteTransaction(transactionToDelete.id);
                setIsDeleteModalOpen(false);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}

/**
 * Componente atómico para mostrar métricas financieras.
 */
function SummaryCard({ title, amount, icon, accentColor }: {
  title: string;
  amount: number;
  icon: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div className={`p-4 rounded-2xl ${accentColor} shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase">{title}</p>
        <p className="text-2xl font-black text-gray-900 mt-0.5">${amount.toLocaleString()}</p>
      </div>
    </div>
  );
}