import React, {useContext, useEffect, useState} from "react";
import {SidebarContext} from "../context/Sidebar";
import {NotificacaoContext} from "../context/Notificacoes";
import {useHistory} from "react-router-dom";
import {notificaDevolucaoPCService} from "../services/NotificacaDevolucaoPC.service";
import { barraMensagemCustom } from "../componentes/Globais/BarraMensagem";
import {visoesService} from "../services/visoes.service"

export const PaginasContainer = ({children}) => {
    const history = useHistory();
    const sidebarStatus = useContext(SidebarContext);
    const notificacaoContext = useContext(NotificacaoContext);
    const mensagem = `A prestação de contas ${localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")} foi devolvida para acertos pela DRE.`
    const onVerAcertos = () => {
        notificacaoContext.setExibeMensagemFixaTemDevolucao(false)
        notificaDevolucaoPCService.marcaNotificacaoComoLidaERedirecianaParaVerAcertos(history)
    };

    const mensagemSuporte = "Você está acessando essa unidade em modo de suporte. Use o botão para encerrar o suporte quando concluir."
    const [unidadeEstaEmSuporte, setUnidadeEstaEmSuporte] = useState(false)

    const verificaSeUnidadeEstaEmSuporte = () => {
        const dadosUsuarioLogado = visoesService.getDadosDoUsuarioLogado()

        if (dadosUsuarioLogado) {
            const unidadeSelecionada = dadosUsuarioLogado.unidades.find(obj => {
                return obj.uuid === dadosUsuarioLogado.unidade_selecionada.uuid
            })
            setUnidadeEstaEmSuporte(unidadeSelecionada.acesso_de_suporte)
        }
    }

    useEffect(() => {
        verificaSeUnidadeEstaEmSuporte()
    }, []);

    return (
        <>
            <div className={`page-content  px-5 pt-0 pb-5 ${!sidebarStatus.sideBarStatus ? "active" : ""}`} id="content">
                { unidadeEstaEmSuporte &&
                    barraMensagemCustom.BarraMensagemSucessLaranja(mensagemSuporte, "Encerrar suporte", onVerAcertos, true)
                }
                { notificacaoContext.exibeMensagemFixaTemDevolucao &&
                    barraMensagemCustom.BarraMensagemSucessLaranja(mensagem, "Ver acertos", onVerAcertos, true)
                }
                {children}
            </div>
        </>
    );
}
