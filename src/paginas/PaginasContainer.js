import React, {useCallback, useContext, useEffect, useState} from "react";
import {SidebarContext} from "../context/Sidebar";
import {NotificacaoContext} from "../context/Notificacoes";
import {useNavigate} from 'react-router-dom';
import {notificaDevolucaoPCService} from "../services/NotificacaDevolucaoPC.service";
import { barraMensagemCustom } from "../componentes/Globais/BarraMensagem";
import { visoesService } from "../services/visoes.service";
import {BarraMensagemUnidadeEmSuporte} from "../componentes/Globais/BarraMensagemUnidadeEmSuporte";
import { BarraMensagemFixa } from "../componentes/Globais/BarraMensagemFixa";
import { BarraMensagemFixaProvider } from "../componentes/Globais/BarraMensagemFixa/context/BarraMensagemFixaProvider";

export const PaginasContainer = ({children}) => {
    const navigate = useNavigate();
    const sidebarStatus = useContext(SidebarContext);
    const notificacaoContext = useContext(NotificacaoContext);
    const mensagem = `A prestação de contas ${localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")} foi devolvida para acertos pela DRE.`
    const onVerAcertos = () => {
        notificacaoContext.setExibeMensagemFixaTemDevolucao(false)
        notificaDevolucaoPCService.marcaNotificacaoComoLidaERedirecianaParaVerAcertos(navigate)
    };

    return (
        <>
            <div className={`page-content  px-5 pt-0 pb-5 ${!sidebarStatus.sideBarStatus ? "active" : ""}`} id="content">
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
