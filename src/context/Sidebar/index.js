import React, {useState, createContext} from "react";

import { FEATURE_FLAGS } from "../../constantes/featureFlags";
import { visoesService } from "../../services/visoes.service";
import { recursoSelecionadoStorageService } from "../../services/storages/RecursoSelecionado.storage.service";

export const FLAGS_KEY_CONTEXT = {
    PRESTACAO_DE_CONTAS: "prestacao-de-contas",
    ACOMPANHAMENTO_DE_PC: "acompanhamento-de-pc",
}

export const SidebarContext = createContext( {
    sideBarStatus: '',
    setSideBarStatus(){},

    // Esse estado é usado para definir quando o click no item do menu deve ir diretamento para url
    irParaUrl: '',
    setIrParaUrl(){},
});

// TODO: REMOVER ESSAS FLAGS APÓS HABILITAR EM PRODUÇÃO
const verificaAtivacaoItemNavegacaoViaFlags = () => {
    const recursoSelecionado = recursoSelecionadoStorageService.getRecursoSelecionado();
    
    // FLAG NECESSÁRIA PARA NÃO MOSTRAR MENU DE PRESTAÇÃO DE CONTAS PARA RECURSO DIFERENTE DE PTRF
    const flagAtivaPEPrestacaoContas = visoesService.featureFlagAtiva(FEATURE_FLAGS.PREMIO_EXCELENCIA_PRESTACAO_CONTAS);
    // FLAG NECESSÁRIA PARA NÃO MOSTRAR MENU DE ACOMPANHAMENTO DE PRESTAÇÃO DE CONTAS PARA RECURSO DIFERENTE DE PTRF
    const flagAtivaPEAcompanhamentoPrestacaoContas = visoesService.featureFlagAtiva(FEATURE_FLAGS.PREMIO_EXCELENCIA_ACOMPANHAMENTO_PRESTACAO_CONTAS);

    const ehLegadoOuNulo = recursoSelecionado?.legado === true || recursoSelecionado === null;

    const ativadoFlagPEPrestacaoContas = ehLegadoOuNulo || flagAtivaPEPrestacaoContas;
    const ativadoFlagPEAcompanhamentoPrestacaoContas = ehLegadoOuNulo || flagAtivaPEAcompanhamentoPrestacaoContas;

    return {
        [FLAGS_KEY_CONTEXT.PRESTACAO_DE_CONTAS]: ativadoFlagPEPrestacaoContas,
        [FLAGS_KEY_CONTEXT.ACOMPANHAMENTO_DE_PC]: ativadoFlagPEAcompanhamentoPrestacaoContas,
    }
}

export const SidebarContextProvider = ({children}) => {
    const [sideBarStatus, setSideBarStatus] = useState(true)

    const itensNavegacaoAtivadaViaFlag = verificaAtivacaoItemNavegacaoViaFlags();

    const redicionaDRESemPermissaoAcompanhamentoPC = () => {
        if (!itensNavegacaoAtivadaViaFlag[FLAGS_KEY_CONTEXT.ACOMPANHAMENTO_DE_PC]){
            window.location.href = "/dre-associacoes";
        }
    }

    // Como padrão, o click no item do menu deve sempre ir diretamente para url, ao menos que esse estado
    // seja mudado para false
    
    const [irParaUrl, setIrParaUrl] = useState(true)
    return (
        <SidebarContext.Provider value={ { sideBarStatus, setSideBarStatus, irParaUrl, setIrParaUrl, itensNavegacaoAtivadaViaFlag, redicionaDRESemPermissaoAcompanhamentoPC } }>
            {children}
        </SidebarContext.Provider>
    )
}