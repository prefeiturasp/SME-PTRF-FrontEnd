import React, {createContext, useMemo, useState} from 'react';
import {visoesService} from "../../../../services/visoes.service";

const Modos = {
  INSERT: "Adicionar Usuário",
  EDIT: "Editar Usuário",
  VIEW: "Visualizar Usuário"
}


export const GestaoDeUsuariosFormContext = createContext({
  visaoBase: '',
  uuidUnidadeBase: '',
  modo: Modos.VIEW,
  setModo: () => {},
  Modos: Modos,
  usuarioId: '',
  setUsuarioId: () => {},
});

export function GestaoDeUsuariosFormProvider({children}) {
  const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');
  const unidade_selecionada = visoesService.getItemUsuarioLogado('unidade_selecionada.uuid');

  const [visaoBase, setVisaoBase] = useState(visao_selecionada);
  const [uuidUnidadeBase, setUuidUnidadeBase] = useState(visao_selecionada === 'SME' ? 'SME' : unidade_selecionada);

  const [modo, setModo] = useState(Modos.VIEW);

  const [usuarioId, setUsuarioId] = useState('');

  const contextValue = useMemo(() => {
    return {
      visaoBase,
      uuidUnidadeBase,
      modo, setModo, Modos,
      usuarioId, setUsuarioId,
    };
  }, [
    visaoBase,
    uuidUnidadeBase,
    modo,
    usuarioId
  ]);

  return (
      <GestaoDeUsuariosFormContext.Provider value={contextValue}>
        {children}
      </GestaoDeUsuariosFormContext.Provider>
  );
}
