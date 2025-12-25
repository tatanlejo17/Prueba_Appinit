"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';

/**
 * Define la estructura extendida del contexto de autenticación.
 * Incluye el estado base y las funciones de acción.
 */
interface AuthContextType extends AuthState {
  /** Inicia sesión de forma asíncrona y persiste los datos. */
  login: (email: string) => Promise<void>;
  /** Limpia la sesión del estado y del almacenamiento local. */
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Componente Provider que envuelve la aplicación o rama de componentes.
 * Se encarga de la lógica de sincronización con el almacenamiento local.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Crucial para evitar redirecciones falsas durante el montaje
  });

  /**
   * Efecto de hidratación: Al cargar el cliente, verifica si hay una sesión
   * previamente guardada para restaurar el estado del usuario.
   */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');

      if (savedUser) {
        setState({
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error recuperando sesión:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Lógica de autenticación. 
   * @param email - Correo proporcionado por el usuario.
   * TODO: Reemplazar mock con llamada real a servicio de autenticación.
   */
  const login = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Simulación de tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = { id: '1', email, name: 'Usuario Demo' };
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  /**
   * Finaliza la sesión actual eliminando los tokens de localStorage.
   */
  const logout = () => {
    localStorage.removeItem('auth_user');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para acceder a las propiedades de autenticación.
 * @throws {Error} Si se usa fuera del árbol de un AuthProvider.
 * @returns {AuthContextType} El estado y métodos de autenticación.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse obligatoriamente dentro de un AuthProvider");
  }

  return context;
};