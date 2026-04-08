import { useState, useEffect, useMemo } from "react";
import { getRecursos, getRecursosPorUnidade } from "../../services/AlterarRecurso.service";
import { authService } from "../../services/auth.service";

/**
 * Hook para gerenciar recurso selecionado com persistência em localStorage
 * @param {string} storageKey - Chave para armazenar no localStorage
 * @param {Function} fetchFunction - Função para buscar recursos disponíveis
 * @returns {Object} - { recursoSelecionado, recursos, handleChangeRecurso, isLoading, error }
 */
const useRecursoSelecionado = ({ visoesService }) => {
  const storageKey = "RECURSO_SELECIONADO";
  const RECURSO_EXIBIDO_NA_SESSAO = "RECURSO_EXIBIDO_NA_SESSAO";
  const dadosUsuarioLogado = visoesService.getDadosDoUsuarioLogado();

  const [recursoSelecionado, setRecursoSelecionado] = useState(() => {
    try {
      const recursoStorage = localStorage.getItem(storageKey);
      return recursoStorage ? JSON.parse(recursoStorage) : null;
    } catch (error) {
      console.error("Erro ao carregar recurso do localStorage:", error);
      return null;
    }
  });
  const [recursoSelecionadoNaSessao, setRecursoSelecionadoNaSessao] = useState(() => {
    try {
      const recursoExibido = localStorage.getItem(RECURSO_EXIBIDO_NA_SESSAO);
      return recursoExibido ? JSON.parse(recursoExibido) : false;
    } catch {
      return false;
    }
  });
  const [recursos, setRecursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recursos?.length) return;

    const recursoValido = recursoSelecionado
      ? recursos.some((r) => r.uuid === recursoSelecionado.uuid)
      : false;

    const deveAutoSelecionar = recursos.length === 1 && !recursoSelecionado;
    const recursoInvalido = recursoSelecionado && !recursoValido;

    if (deveAutoSelecionar || recursoInvalido) {
      setRecursoSelecionado(recursos[0]);
      localStorage.setItem(storageKey, JSON.stringify(recursos[0]));
      authService.limparStorageAoTrocarRecurso();
    }
  }, [recursos, recursoSelecionado]);

  const mostrarSelecionarRecursos = useMemo(() => {
    return recursos.length > 1;
  }, [recursos]);

  const mostrarOverlaySelecionarRecursos = useMemo(() => {
    return (recursoSelecionado === null && recursos.length > 1) || (!recursoSelecionadoNaSessao && recursos.length > 1);
  }, [recursoSelecionado, recursos]);

  const handleChangeRecurso = (recursoSelecionadoObj) => {
    try {
      setRecursoSelecionado(recursoSelecionadoObj);
      setRecursoSelecionadoNaSessao(true);
      if (recursoSelecionadoObj) {
        localStorage.setItem(storageKey, JSON.stringify(recursoSelecionadoObj));
        localStorage.setItem(RECURSO_EXIBIDO_NA_SESSAO, JSON.stringify(true));
        // TODO: Ao invés de limpar as informações do storage, tratar as informações por recurso selecionado
        // A separação de storage por recurso foi feita para a tela de conciliação apenas
        // Onde foi possível guardar informações do último período/conta na tela por recurso
        // Ver services/storages/Conciliacao.storage.service
        authService.limparStorageAoTrocarRecurso();
      } else {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(RECURSO_EXIBIDO_NA_SESSAO);
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao salvar recurso no localStorage:", error);
      setError(error);
    }
  };

  const clearRecurso = () => {
    setRecursoSelecionado(null);
    localStorage.removeItem(storageKey);
  };

  const clearRecursoNaSessao = () => {
    setRecursoSelecionadoNaSessao(false);
    localStorage.removeItem(RECURSO_EXIBIDO_NA_SESSAO);
  };

  useEffect(() => {
    if (!dadosUsuarioLogado) return;

    const fetchRecursosPorUnidade = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await getRecursosPorUnidade(dadosUsuarioLogado.unidade_selecionada.uuid);
        setRecursos(res);

        // previne cenário onde o recurso selecionado pode ter sido atualizado, buscando o recurso atualizado na lista retornada
        const recursoAtualizado = res.find((r) => r.uuid === recursoSelecionado?.uuid);
        if (recursoAtualizado) {
          setRecursoSelecionado(recursoAtualizado);
          localStorage.setItem(storageKey, JSON.stringify(recursoAtualizado));
        }
      } catch (err) {
        console.error("Erro ao buscar recursos:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRecursos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await getRecursos();
        setRecursos(res);
      } catch (err) {
        console.error("Erro ao buscar recursos:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (dadosUsuarioLogado.visao_selecionada.nome === "SME") {
      fetchRecursos();
    } else {
      fetchRecursosPorUnidade();
    }
  }, []);

  return {
    recursoSelecionado,
    recursos,
    handleChangeRecurso,
    clearRecurso,
    isLoading,
    error,
    mostrarSelecionarRecursos,
    mostrarOverlaySelecionarRecursos,
    setRecursoSelecionadoNaSessao,
    clearRecursoNaSessao,
  };
};

export default useRecursoSelecionado;
