import React, {createContext, useMemo, useState} from 'react';

export const GestaoDeUsuariosAdicionarUnidadeContext = createContext({
    search: '',
    setSearch: () => {},
    submitFiltro: false,
    setSubmitFiltro: () => {},
    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 1,
    setFirstPage: () => {},
    showModalLegendaInformacao: false,
    setShowModalLegendaInformacao: () => {}
});


export function GestaoDeUsuariosAdicionarUnidadeProvider({children}) {
    const [search, setSearch] = useState('');
    const [submitFiltro, setSubmitFiltro] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);
    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false);
  
    const contextValue = useMemo(() => {
        return {
            search,
            setSearch,
            submitFiltro,
            setSubmitFiltro,
            firstPage,
            setFirstPage,
            currentPage,
            setCurrentPage,
            showModalLegendaInformacao,
            setShowModalLegendaInformacao
        };
    }, [search, currentPage, firstPage, submitFiltro, showModalLegendaInformacao]);
  
    return (
        <GestaoDeUsuariosAdicionarUnidadeContext.Provider value={contextValue}>
          {children}
        </GestaoDeUsuariosAdicionarUnidadeContext.Provider>
    );
  }