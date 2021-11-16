import React, {useContext} from "react";
import {SidebarContext} from "../context/Sidebar";
import {NotificacaoContext} from "../context/Notificacoes";
import {useHistory} from "react-router-dom";
import {notificaDevolucaoPCService} from "../services/NotificacaDevolucaoPC.service";
import { barraMensagemCustom } from "../componentes/Globais/BarraMensagem";

export const PaginasContainer = ({children}) => {
    const history = useHistory();
    const sidebarStatus = useContext(SidebarContext);
    const notificacaoContext = useContext(NotificacaoContext);
    const mensagem = `A prestação de contas ${localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")} foi devolvida para acertos pela DRE.`

    const onVerAcertos = () => {
        notificacaoContext.setExibeMensagemFixaTemDevolucao(false)
        notificaDevolucaoPCService.marcaNotificacaoComoLidaERedirecianaParaVerAcertos(history)
    };

    return (
        <>
            <div className={`page-content  px-5 pt-0 pb-5 ${!sidebarStatus.sideBarStatus ? "active" : ""}`} id="content">
                { notificacaoContext.exibeMensagemFixaTemDevolucao &&
                    barraMensagemCustom.BarraMensagemSucessLaranja(mensagem, "Ver acertos", onVerAcertos, true)
                }
                {children}
            </div>
        </>
    );
}
