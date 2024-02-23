import React, { createContext, useContext } from 'react';

const ConferenciaDespesasPeriodosAnterioresContext = createContext();

export const useConferenciaDespesasPeriodosAnteriores = () => {
  return useContext(ConferenciaDespesasPeriodosAnterioresContext);
};

export const ConferenciaDespesasPeriodosAnterioresProvider = ({ 
    children,
    prestacaoDeContas,
    contasAssociacao,
    lancamentosParaConferencia,
    editavel,
    componentState,
    isLoadingDespesas,
    handleChangeCheckBoxOrdenarPorImposto,
    onTabClick,
    setLancamentosParaConferencia,
    stateCheckBoxOrdenarPorImposto,
    setStateCheckBoxOrdenarPorImposto,
    onHandleSubmitFiltros,
    onChangeOrdenamento,
    onChangePage
}) => {

  return (
    <ConferenciaDespesasPeriodosAnterioresContext.Provider
      value={{
        contasAssociacao,
        prestacaoDeContas,
  
        lancamentosParaConferencia,
        editavel,
        isLoadingDespesas,
  
        handleChangeCheckBoxOrdenarPorImposto,
        onTabClick,
        setLancamentosParaConferencia,
        stateCheckBoxOrdenarPorImposto,
        setStateCheckBoxOrdenarPorImposto,
        componentState,
        onHandleSubmitFiltros,
        onChangeOrdenamento,
        onChangePage
      }}
    >
      {children}
    </ConferenciaDespesasPeriodosAnterioresContext.Provider>
  );
};


