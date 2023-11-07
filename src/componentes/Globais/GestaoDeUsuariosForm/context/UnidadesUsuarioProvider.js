import React, {createContext, useMemo, useState} from 'react';

export const UnidadesUsuarioContext = createContext({
    currentPage: 1,
    setCurrentPage: () => {},
    firstPage: 0,
    setFirstPage: () => {},
    showFaixaIndicativa: false,
    setShowFaixaIndicativa: () => {},
    showModalRemoverAcesso: false,
    setShowModalRemoverAcesso: () => {},
    textoModalRemoverAcesso: '',
    setTextoModalRemoverAcesso: () => {},
    payloadRemoveAcessoConcedidoSme: {},
    setPayloadRemoveAcessoConcedidoSme: () => {}
});

export const UnidadesUsuarioProvider = ({children}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);
    const [showFaixaIndicativa, setShowFaixaIndicativa] = useState(false);
    const [showModalRemoverAcesso, setShowModalRemoverAcesso] = useState(false);
    const [textoModalRemoverAcesso, setTextoModalEncerramentoConta] = useState('<span>Ao desativar essa unidade ela será excluída automaticamente da listagem de acesso para este usuário, pois se trata de uma unidade adicionada manualmente.</br>Caso este usuário precise ter acesso novamente a esta unidade, será necessário realizar um novo cadastro da unidade</span>');
    const [payloadRemoveAcessoConcedidoSme, setPayloadRemoveAcessoConcedidoSme] = useState({});

    const contextValue = useMemo(() => {
        return {
            currentPage,
            setCurrentPage,
            firstPage,
            setFirstPage,
            showFaixaIndicativa,
            setShowFaixaIndicativa,
            showModalRemoverAcesso,
            setShowModalRemoverAcesso,
            textoModalRemoverAcesso,
            setTextoModalEncerramentoConta,
            payloadRemoveAcessoConcedidoSme,
            setPayloadRemoveAcessoConcedidoSme
        };
    }, [currentPage, firstPage, showFaixaIndicativa, showModalRemoverAcesso, textoModalRemoverAcesso, payloadRemoveAcessoConcedidoSme]);

    return (
        <UnidadesUsuarioContext.Provider value={contextValue}>
            {children}
        </UnidadesUsuarioContext.Provider>
    )
}