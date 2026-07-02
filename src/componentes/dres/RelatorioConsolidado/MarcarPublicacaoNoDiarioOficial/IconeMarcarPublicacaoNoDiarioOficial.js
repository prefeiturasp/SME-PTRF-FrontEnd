import React, {memo, useMemo, useState} from "react";
import {ModalMarcarPublicacaoNoDiarioOficial} from "../ModalMarcarPublicacaoNoDiarioOficial";
import moment from "moment";
import {visoesService} from "../../../../services/visoes.service";
import { EditIconButton } from "../../../Globais/UI/Button";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado";
import { TextoDocumentoConsolidadoPC } from "../../../../utils/TextoDocumentoConsolidadoPC";

const IconeMarcarPublicacaoNoDiarioOficial = ({consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao}) => {
    const { recursoSelecionado } = useRecursoSelecionadoContext();

    const habilita_exibicao_lauda = recursoSelecionado?.habilita_exibicao_de_lauda;

    const texto_documento_consolidado_pc = useMemo(() => new TextoDocumentoConsolidadoPC(habilita_exibicao_lauda), [habilita_exibicao_lauda]);

    const text_possessive = texto_documento_consolidado_pc.possessivo_acao();
    const texto_publicacao_modal = texto_documento_consolidado_pc.texto_titulo_publicacao_modal();
    const texto_info_modal = `Informar ${texto_publicacao_modal}`;

    const [showModalMarcarPublicacaoNoDiarioOficial, setShowModalMarcarPublicacaoNoDiarioOficial] = useState(false)

    const retornaMsgToolTip = () => {
        let data_de_publicacao = moment(consolidadoDre.data_publicacao).format("DD/MM/YYYY")
        return (
            <div>
                <p className='mb-1'>Data {text_possessive}: {data_de_publicacao}</p>

                {
                    habilita_exibicao_lauda && (
                        <p className='mb-1'>Página publicação: {consolidadoDre.pagina_publicacao}</p>
                    )
                }
            </div>
        )
    }

    return (
        <>
            {consolidadoDre && consolidadoDre.ja_publicado && consolidadoDre.data_publicacao &&
                <EditIconButton
                    tooltipMessage={retornaMsgToolTip()}
                    disabled={!visoesService.getPermissoes(['change_relatorio_consolidado_dre'])}
                    onClick={() => setShowModalMarcarPublicacaoNoDiarioOficial(true)}

                />
            }
            <section>
                <ModalMarcarPublicacaoNoDiarioOficial
                    titulo={texto_info_modal}
                    show={showModalMarcarPublicacaoNoDiarioOficial}
                    handleClose={() => setShowModalMarcarPublicacaoNoDiarioOficial(false)}
                    consolidadoDre={consolidadoDre}
                    carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                    textoMsg={`Informações ${text_possessive} alteradas com sucesso.`}
                    textoBotaoSalvar='Salvar'
                />
            </section>
        </>
    )
}

export default memo(IconeMarcarPublicacaoNoDiarioOficial)