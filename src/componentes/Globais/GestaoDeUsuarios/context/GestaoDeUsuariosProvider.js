import React, { createContext, useMemo, useState } from 'react';
import {visoesService} from "../../../../services/visoes.service";

const initialFilter = {
  search: '',
  grupo: '',
  tipoUsuario: '',
};

export const GestaoDeUsuariosContext = createContext({
  visaoBase: '',
  uuidUnidadeBase: '',
  initialFilter: initialFilter,
  filter: initialFilter,
  setFilter: () => {},
});

export function GestaoDeUsuariosProvider({ children }) {
  const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');
  const unidade_selecionada = visoesService.getItemUsuarioLogado('unidade_selecionada.uuid');

  const [visaoBase, setVisaoBase] = useState(visao_selecionada);
  const [uuidUnidadeBase, setUuidUnidadeBase] = useState(visao_selecionada === 'SME' ? 'SME' : unidade_selecionada);
  const [filter, setFilter] = useState(initialFilter);

  const contextValue = useMemo(() => {
    return { visaoBase, uuidUnidadeBase, initialFilter, filter, setFilter };
  }, [visaoBase, uuidUnidadeBase, filter]);

  return (
    <GestaoDeUsuariosContext.Provider value={contextValue}>
      {children}
    </GestaoDeUsuariosContext.Provider>
  );
}
