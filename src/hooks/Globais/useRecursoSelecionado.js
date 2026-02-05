import { useState, useEffect } from "react";
import { getRecursosDisponiveis } from "../../services/AlterarRecurso.service";

/**
 * Hook para gerenciar recurso selecionado com persistência em localStorage
 * @param {string} storageKey - Chave para armazenar no localStorage
 * @param {Function} fetchFunction - Função para buscar recursos disponíveis
 * @returns {Object} - { recursoSelecionado, recursos, handleChangeRecurso, isLoading, error }
 */
const useRecursoSelecionado = () => {
  const storageKey = "recursoSelecionado";
  const fetchFunction = getRecursosDisponiveis;

  const [recursoSelecionado, setRecursoSelecionado] = useState(() => {
    try {
      const recursoStorage = localStorage.getItem(storageKey);
      return recursoStorage ? JSON.parse(recursoStorage) : null;
    } catch (error) {
      console.error("Erro ao carregar recurso do localStorage:", error);
      return null;
    }
  });

  const [recursos, setRecursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChangeRecurso = (recursoSelecionadoObj) => {
    try {
      setRecursoSelecionado(recursoSelecionadoObj);
      if (recursoSelecionadoObj) {
        localStorage.setItem(storageKey, JSON.stringify(recursoSelecionadoObj));
      } else {
        localStorage.removeItem(storageKey);
      }

      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar recurso no localStorage:", error);
      setError(error);
    }
  };

  const clearRecurso = () => {
    setRecursoSelecionado(null);
    localStorage.removeItem(storageKey);
  };

  useEffect(() => {
    if (!fetchFunction) return;

    const fetchRecursos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetchFunction();
        setRecursos(res);
      } catch (err) {
        console.error("Erro ao buscar recursos:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecursos();
  }, [fetchFunction]);

  return {
    recursoSelecionado,
    recursos,
    handleChangeRecurso,
    clearRecurso,
    isLoading,
    error,
  };
};

export default useRecursoSelecionado;
