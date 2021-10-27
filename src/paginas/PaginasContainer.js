import React, {useContext} from "react";
import {SidebarContext} from "../context/Sidebar";
import {NotificacaoContext} from "../context/Notificacoes";
import {BarraDeMensagem} from "../componentes/Globais/BarraMensagem"
import {useHistory} from "react-router-dom";
import {notificaDevolucaoPCService} from "../services/NotificacaDevolucaoPC.service";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

export const PaginasContainer = ({children}) => {
    const history = useHistory();
    const sidebarStatus = useContext(SidebarContext);
    const notificacaoContext = useContext(NotificacaoContext);

    const onVerAcertos = () => {
        let periodoReferencia = localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")
        notificacaoContext.setExibeMensagemFixaTemDevolucao(false)
        notificaDevolucaoPCService.marcaNotificacaoComoLida()
        notificaDevolucaoPCService.redirectVerAcertos(periodoReferencia, history)
    };

    return (
        <>
            <div className={`page-content  px-5 pt-0 pb-5 ${!sidebarStatus.sideBarStatus ? "active" : ""}`} id="content">
                { notificacaoContext.exibeMensagemFixaTemDevolucao &&
                    <BarraDeMensagem
                        mensagem={`A prestação de contas ${localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")} foi devolvida para acertos pela DRE.`}
                        textoBotao={'Ver acertos'}
                        handleClickBotao={onVerAcertos}
                        icone={faExclamationCircle}
                    />
                }
                {children}
            </div>
        </>
    );
}
