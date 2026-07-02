import React, {memo, useMemo, useState} from "react";
import {ModalMarcarPublicacaoNoDiarioOficial} from "../ModalMarcarPublicacaoNoDiarioOficial";
import {visoesService} from "../../../../services/visoes.service";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado";
import { TextoDocumentoConsolidadoPC } from "../../../../utils/TextoDocumentoConsolidadoPC";

const BotaoMarcarPublicacaoNoDiarioOficial = ({consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao}) => {
    const { recursoSelecionado } = useRecursoSelecionadoContext();

    const [showModalMarcarPublicacaoNoDiarioOficial, setShowModalMarcarPublicacaoNoDiarioOficial] = useState(false)    

    const texto_documento_consolidado_pc = useMemo(() => new TextoDocumentoConsolidadoPC(recursoSelecionado?.habilita_exibicao_de_lauda), [recursoSelecionado?.habilita_exibicao_de_lauda]);

    const texto_publicacao = texto_documento_consolidado_pc.texto_acao();
    const texto_publicacao_modal = texto_documento_consolidado_pc.texto_titulo_publicacao_modal();
    const texto_aplicada = texto_documento_consolidado_pc.texto_pagina_publicacao();

    const texto_info = `Informar ${texto_publicacao}`;
    const texto_info_modal = `Informar ${texto_publicacao_modal}`;

    return (
        <>
            {consolidadoDre?.ja_publicado && !consolidadoDre.data_publicacao &&
                <div className="p-2 bd-highlight">
                    <button
                        onClick={() => setShowModalMarcarPublicacaoNoDiarioOficial(true)}
                        className="btn btn-outline-success"
                        disabled={!visoesService.getPermissoes(['change_relatorio_consolidado_dre'])}
                    >
                        {texto_info}
                    </button>
                </div>
            }
            <section>
                <ModalMarcarPublicacaoNoDiarioOficial
                    titulo={texto_info_modal}
                    show={showModalMarcarPublicacaoNoDiarioOficial}
                    handleClose={() => setShowModalMarcarPublicacaoNoDiarioOficial(false)}
                    consolidadoDre={consolidadoDre}
                    carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                    textoMsg={`Data ${texto_aplicada} com sucesso.`}
                    textoBotaoSalvar='Informar'
                />
            </section>
        </>

    )
}

export default memo(BotaoMarcarPublicacaoNoDiarioOficial)