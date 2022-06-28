import React, {useCallback, useEffect, useState} from "react";
import { barraMensagemCustom } from "../BarraMensagem";
import {visoesService} from "../../../services/visoes.service"
import {ModalConfirmaEncerramentoSuporte} from "./ModalConfirmaEncerramentoSuporte";

export const BarraMensagemUnidadeEmSuporte = () => {
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

    const handleEncerrarSuporte = () => {
        setShowModalConfirmaEncerramentoSuporte(true)
    }

    const [showModalConfirmaEncerramentoSuporte, setShowModalConfirmaEncerramentoSuporte] = useState(false);
    const handleNaoConfirmaEncerramentoSuporte = useCallback(() => {
        setShowModalConfirmaEncerramentoSuporte(false)
    }, []);
    const handleConfirmaEncerramentoSuporte = useCallback(() => {
        // viabilizarAcessoSuporte(getUsuarioLogado().login, {codigo_eol: unidadeSuporteSelecionada.codigo_eol})
        // setarUnidadeProximoLoginAcessoSuporte(
        //     unidadeSuporteSelecionada.visao,
        //     unidadeSuporteSelecionada.uuid,
        //     unidadeSuporteSelecionada.associacao_uuid,
        //     unidadeSuporteSelecionada.associacao_nome,
        //     unidadeSuporteSelecionada.tipo_unidade,
        //     unidadeSuporteSelecionada.nome
        // )
        // authService.logout()
        setUnidadeEstaEmSuporte(false)
        setShowModalConfirmaEncerramentoSuporte(false)
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
