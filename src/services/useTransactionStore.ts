import { create } from 'zustand';
import { Transaction } from '@/types';

/**
 * Contrato del estado y las acciones para las transacciones.
 */
interface TransactionState {
    /** Listado global de transacciones cargadas en memoria. */
    transactions: Transaction[];
    /** Indicador de procesos asíncronos. */
    isLoading: boolean;
    /** Recupera todas las transacciones desde la fuente de datos. */
    getAllTransactions: () => Promise<void>;
    /** * Crea una nueva transacción. */
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    /** Actualiza una transacción existente basada en su ID. */
    updateTransaction: (transaction: Transaction) => Promise<void>;
    /** Elimina una transacción de la persistencia y del estado local. */
    deleteTransaction: (id: string) => Promise<void>;
}

/**
 * Store global de transacciones.
 * Utiliza Zustand para una gestión de estado ligera y reactiva.
 */
export const useTransactionStore = create<TransactionState>((set, get) => ({
    // --- ESTADO INICIAL ---
    transactions: [],
    isLoading: false,

    /**
     * Simulación de lectura de datos (Fetch).
     */
    getAllTransactions: async () => {
        set({ isLoading: true });

        // Simulación de tiempo de procesamiento
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockData: Transaction[] = [
            { id: '1', title: 'Salario', amount: 3000, type: 'income', category: 'Trabajo', date: '2023-10-01' },
            { id: '2', title: 'Alquiler', amount: 800, type: 'expense', category: 'Vivienda', date: '2023-10-05' },
        ];

        set({ transactions: mockData, isLoading: false });
    },

    /**
     * Inserción de nueva transacción.
     */
    addTransaction: async (newTx) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Generación de ID temporal (Mock)
        const transaction: Transaction = {
            ...newTx,
            id: Math.random().toString(36).substring(2, 9)
        };

        // Actualización funcional del estado
        set((state) => ({
            transactions: [transaction, ...state.transactions],
            isLoading: false
        }));
    },

    /**
     * Actualización de registros.
     * Utiliza .map() para crear un nuevo arreglo, reemplazando solo el objeto modificado.
     */
    updateTransaction: async (updatedTx) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
            transactions: state.transactions.map(tx =>
                tx.id === updatedTx.id ? updatedTx : tx
            ),
            isLoading: false
        }));
    },

    /**
     * Eliminación de registros.
     * Utiliza .filter() para generar un nuevo arreglo excluyendo el ID seleccionado.
     */
    deleteTransaction: async (id) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
            transactions: state.transactions.filter(tx => tx.id !== id),
            isLoading: false
        }));
    },
}));