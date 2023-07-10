import React, { createContext, useMemo, useState } from 'react';
import {visoesService} from "../../../../services/visoes.service";

const initialFilter = {
  search: '',
  grupo: '',
  tipoUsuario: '',
  nomeUnidade: '',
  apenasUsuariosDaUnidade: false,
};

export const GestaoDeUsuariosContext = createContext({
  visaoBase: '',
  uuidUnidadeBase: '',
  initialFilter: initialFilter,
  filter: initialFilter,
  setFilter: () => {},
  totalPages: 1,
  currentPage: 1,
  count: 0,
  setTotalPages: () => {},
  setCurrentPage: () => {},
  setCount: () => {},
});

export function GestaoDeUsuariosProvider({ children }) {
  const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');
  const unidade_selecionada = visoesService.getItemUsuarioLogado('unidade_selecionada.uuid');

  const [visaoBase, setVisaoBase] = useState(visao_selecionada);
  const [uuidUnidadeBase, setUuidUnidadeBase] = useState(visao_selecionada === 'SME' ? 'SME' : unidade_selecionada);
  const [filter, setFilter] = useState(initialFilter);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);

  const contextValue = useMemo(() => {
    return {
      visaoBase,
      uuidUnidadeBase,
      initialFilter, filter, setFilter,
      totalPages, setTotalPages,
      currentPage, setCurrentPage,
      count, setCount
    };
  }, [
    visaoBase,
    uuidUnidadeBase,
    filter,
    totalPages,
    currentPage,
    count,
  ]);

  return (
    <GestaoDeUsuariosContext.Provider value={contextValue}>
      {children}
    </GestaoDeUsuariosContext.Provider>
  );
}
