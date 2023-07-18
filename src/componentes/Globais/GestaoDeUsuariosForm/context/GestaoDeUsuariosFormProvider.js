import React, { createContext, useMemo, useState } from 'react';
import {visoesService} from "../../../../services/visoes.service";

const emptyValues = {
  tipoUsuario: '',
  userName: '',
  nome: '',
  email: '',
};

const Modos = {
    INSERT: "Adicionar Usuário",
    EDIT: "Editar Usuário",
    VIEW: "Visualizar Usuário"
}


export const GestaoDeUsuariosFormContext = createContext({
  visaoBase: '',
  uuidUnidadeBase: '',
  emptyValues: emptyValues,
  formValues: emptyValues,
  setFormValues: () => {},
  modo: Modos.VIEW,
  setModo: () => {},
  Modos: Modos
});

export function GestaoDeUsuariosFormProvider({ children }) {
  const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');
  const unidade_selecionada = visoesService.getItemUsuarioLogado('unidade_selecionada.uuid');

  const [visaoBase, setVisaoBase] = useState(visao_selecionada);
  const [uuidUnidadeBase, setUuidUnidadeBase] = useState(visao_selecionada === 'SME' ? 'SME' : unidade_selecionada);

  const [formValues, setFormValues] = useState(emptyValues);

  const [modo, setModo] = useState(Modos.VIEW);

  const contextValue = useMemo(() => {
    return {
      visaoBase,
      uuidUnidadeBase,
      emptyValues, formValues, setFormValues,
      modo, setModo, Modos
    };
  }, [
    visaoBase,
    uuidUnidadeBase,
    formValues,
    modo
  ]);

  return (
    <GestaoDeUsuariosFormContext.Provider value={contextValue}>
      {children}
    </GestaoDeUsuariosFormContext.Provider>
  );
}
