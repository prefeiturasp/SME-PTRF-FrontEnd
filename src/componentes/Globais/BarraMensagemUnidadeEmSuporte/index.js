import React, {useCallback, useEffect, useState} from "react";
import { barraMensagemCustom } from "../BarraMensagem";
import {visoesService} from "../../../services/visoes.service"
import {ModalConfirmaEncerramentoSuporte} from "./ModalConfirmaEncerramentoSuporte";
import {encerrarAcessoSuporte,authService} from "../../../services/auth.service";

export const BarraMensagemUnidadeEmSuporte = () => {
    const mensagemSuporte = "Você está acessando essa unidade em MODO SUPORTE. Use o botão encerrar quando concluir o suporte."
    const [unidadeEstaEmSuporte, setUnidadeEstaEmSuporte] = useState(false)

    const dadosUsuarioLogado = visoesService.getDadosDoUsuarioLogado()

    const verificaSeUnidadeEstaEmSuporte = () => {
        if (dadosUsuarioLogado) {
            const unidadeSelecionada = dadosUsuarioLogado.unidades.find(obj => {
                return obj.uuid === dadosUsuarioLogado.unidade_selecionada.uuid
            })
            if (unidadeSelecionada && unidadeSelecionada.acesso_de_suporte){
                setUnidadeEstaEmSuporte(unidadeSelecionada.acesso_de_suporte)
            }
        }
    }

    useEffect(() => {
        verificaSeUnidadeEstaEmSuporte()
    }, []);

    const handleEncerrarSuporte = () => {
        setShowModalConfirmaEncerramentoSuporte(true)
    }

    const [showModalConfirmaEncerramentoSuporte, setShowModalConfirmaEncerramentoSuporte] = useState(false);
    const handleNaoConfirmaEncerramentoSuporte = useCallback(() => {
        setShowModalConfirmaEncerramentoSuporte(false)
    }, []);
    const handleConfirmaEncerramentoSuporte = useCallback(() => {
        encerrarAcessoSuporte(dadosUsuarioLogado.usuario_logado.login, dadosUsuarioLogado.unidade_selecionada.uuid)
            .then((result) => {
                setUnidadeEstaEmSuporte(false)
                setShowModalConfirmaEncerramentoSuporte(false)
                localStorage.removeItem('DADOS_USUARIO_LOGADO');
                authService.logout()
            })
            .catch((erro) => {
                console.error('Erro ao encerrar acesso de suporte.', erro)
            })

    }, []);

    return (
        <>

            { unidadeEstaEmSuporte &&
                barraMensagemCustom.BarraMensagemSucessLaranja(mensagemSuporte, "Encerrar suporte", handleEncerrarSuporte, true)
            }
            <section>
                <ModalConfirmaEncerramentoSuporte
                    show={showModalConfirmaEncerramentoSuporte}
                    handleNaoConfirmaEncerramentoSuporte={handleNaoConfirmaEncerramentoSuporte}
                    handleConfirmaEncerramentoSuporte={handleConfirmaEncerramentoSuporte}
                />
            </section>
        </>
    );
}
