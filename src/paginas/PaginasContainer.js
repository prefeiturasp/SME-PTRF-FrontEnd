import React, {useCallback, useContext, useEffect, useState} from "react";
import {SidebarContext} from "../context/Sidebar";
import {NotificacaoContext} from "../context/Notificacoes";
import {useLocation, useNavigate} from 'react-router-dom';
import {notificaDevolucaoPCService} from "../services/NotificacaDevolucaoPC.service";
import { barraMensagemCustom } from "../componentes/Globais/BarraMensagem";
import { visoesService } from "../services/visoes.service";
import {BarraMensagemUnidadeEmSuporte} from "../componentes/Globais/BarraMensagemUnidadeEmSuporte";
import { BarraMensagemFixa } from "../componentes/Globais/BarraMensagemFixa";
import { BarraMensagemFixaRecurso } from "../componentes/Globais/BarraMensagemFixaRecurso";
import { BarraMensagemFixaProvider } from "../componentes/Globais/BarraMensagemFixa/context/BarraMensagemFixaProvider";
import { FEATURE_FLAGS } from '../constantes/featureFlags';
import useRecursoSelecionado from "../hooks/Globais/useRecursoSelecionado";

export const PaginasContainer = ({children}) => {
    const navigate = useNavigate();
    const sidebarStatus = useContext(SidebarContext);
    const notificacaoContext = useContext(NotificacaoContext);
    const mensagem = `A prestação de contas ${localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")} foi devolvida para acertos pela DRE.`
    const onVerAcertos = () => {
        notificacaoContext.setExibeMensagemFixaTemDevolucao(false)
        notificaDevolucaoPCService.marcaNotificacaoComoLidaERedirecianaParaVerAcertos(navigate)
    };

    const { recursoSelecionado } = useRecursoSelecionado({ visoesService });
    const location = useLocation();

    // Caminhos em que a barra de recurso pode ser exibida
    const allowedPaths = [
        // UE
        '/dashboard', 'lista-de-receitas', 'lista-de-despesas',
        '/detalhe-das-prestacoes', 'prestacao-de-contas', 'analise-dre',
        // SME
        '/acompanhamento-pcs-sme', '/analises-relatorios-consolidados-dre',
        '/consulta-de-saldos-bancarios', 'extracoes-dados',
        // DRE
        '/dre-valores-reprogramados', '/dre-dashboard', '/dre-relatorio-consolidado'
    ]

    const podeExibirBarraRecurso = allowedPaths.some(path => location.pathname.includes(path))
    
    const isRecursoLegado = recursoSelecionado?.legado || false;

    return (
        <>
            <div className={`page-content  px-5 pt-0 pb-5 ${!sidebarStatus.sideBarStatus ? "active" : ""}`} id="content">
                { recursoSelecionado && visoesService.featureFlagAtiva(FEATURE_FLAGS.PREMIO_EXCELENCIA) && !isRecursoLegado && podeExibirBarraRecurso &&
                    <BarraMensagemFixaProvider 
                        mensagem={`Você está acessando essa funcionalidade com o recurso ${recursoSelecionado?.nome.toUpperCase()}.`} 
                        exibeBotao={false}
                        fixed={true}
                    >
                        <BarraMensagemFixaRecurso/>
                    </BarraMensagemFixaProvider>
                }

                <BarraMensagemUnidadeEmSuporte/>
                
                {visoesService.featureFlagAtiva('historico-de-membros') && visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' &&
                    <BarraMensagemFixaProvider>
                        <BarraMensagemFixa/>
                    </BarraMensagemFixaProvider>
                }
                
                { notificacaoContext.exibeMensagemFixaTemDevolucao &&
                    barraMensagemCustom.BarraMensagemSucessLaranja(mensagem, "Ver acertos", onVerAcertos, true)
                }
                {children}
            </div>
        </>
    );
}
