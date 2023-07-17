import React, { createContext, useMemo, useState } from 'react';
import {visoesService} from "../../../../services/visoes.service";

const emptyValues = {
  tipoUsuario: '',
  userName: '',
  nome: '',
  email: '',
};

export const GestaoDeUsuariosFormContext = createContext({
  visaoBase: '',
  uuidUnidadeBase: '',
  emptyValues: emptyValues,
  formValues: emptyValues,
  setFormValues: () => {},
});

export function GestaoDeUsuariosFormProvider({ children }) {
  const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');
  const unidade_selecionada = visoesService.getItemUsuarioLogado('unidade_selecionada.uuid');

  const [visaoBase, setVisaoBase] = useState(visao_selecionada);
  const [uuidUnidadeBase, setUuidUnidadeBase] = useState(visao_selecionada === 'SME' ? 'SME' : unidade_selecionada);
  const [formValues, setFormValues] = useState(emptyValues);

  const contextValue = useMemo(() => {
    return {
      visaoBase,
      uuidUnidadeBase,
      emptyValues, formValues, setFormValues,
    };
  }, [
    visaoBase,
    uuidUnidadeBase,
    formValues,
  ]);

  return (
    <GestaoDeUsuariosFormContext.Provider value={contextValue}>
      {children}
    </GestaoDeUsuariosFormContext.Provider>
  );
}
