import React, {useCallback, useEffect, useState} from "react";
import {TextoExplicativo} from "./TextoExplicativoDaPagina"
import {EscolheUnidade} from "../EscolheUnidade";
import {visoesService} from "../../../services/visoes.service";
import {ModalConfirmaInicioSuporte} from "./ModalConfirmaInicioSuporte";
import {getUsuarioLogado, viabilizarAcessoSuporte, authService} from "../../../services/auth.service"

export const SuporteAsUnidades = (props) =>{

    const {visao} = props

    let dreUuid = ''
    if (visao === "DRE") {
        dreUuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')
    }

    const [showModalConfirmaSuporte, setShowModalConfirmaSuporte] = useState(false);
    const [unidadeSuporteSelecionada, setUnidadeSuporteSelecionada] = useState(null)

    const handleNaoConfirmaSuporte = useCallback(() => {
        setShowModalConfirmaSuporte(false)
    }, []);

    const handleConfirmaSuporte = useCallback(() => {
        viabilizarAcessoSuporte(getUsuarioLogado().login, {codigo_eol: unidadeSuporteSelecionada.codigo_eol})
        authService.logout()
        setShowModalConfirmaSuporte(false)
    }, [unidadeSuporteSelecionada]);

    const handleSelecaoUnidadeSuporte = useCallback((unidadeSelecionada) => {
        setUnidadeSuporteSelecionada(unidadeSelecionada)
        setShowModalConfirmaSuporte(true)
    }, []);

    let textoConfirmacaoSuporte = ""
    if (unidadeSuporteSelecionada){
        textoConfirmacaoSuporte = `<p>Deseja iniciar suporte para a unidade ${unidadeSuporteSelecionada.nome}?</p> <p>Ao confirmar, você será direcionado para a página de acesso ao sistema e ao acessá-lo novamente você visualizará a unidade selecionada.</p>`
    }

    return(
        <div>
            <TextoExplicativo visao={visao}/>
            <EscolheUnidade dre_uuid={dreUuid} onSelecionaUnidade={handleSelecaoUnidadeSuporte}/>
            <section>
                <ModalConfirmaInicioSuporte
                    show={showModalConfirmaSuporte}
                    handleNaoConfirmaSuporte={handleNaoConfirmaSuporte}
                    handleConfirmaSuporte={handleConfirmaSuporte}
                    texto={textoConfirmacaoSuporte}
                />
            </section>
        </div>

    )
}
