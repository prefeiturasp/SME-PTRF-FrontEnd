import React, {memo} from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import IconeEditarRetificacao from "../BlocoRetificacao/IconeEditarRetificacao";
import { TextoDocumentoConsolidadoPC } from "../../../../utils/TextoDocumentoConsolidadoPC";
const dataTemplate = useDataTemplate()

const InfoRetificacaoRelatorio = ({consolidadoDre}) => {
    const { recursoSelecionado } = useRecursoSelecionadoContext();

    const text_possessive = new TextoDocumentoConsolidadoPC(recursoSelecionado?.habilita_exibicao_lauda).possessivo();

    return(
        <>
            {consolidadoDre?.data_publicacao &&
                <div className='mb-0 fonte-12 fonte-normal'>
                    <strong>Data {text_possessive}:</strong> {dataTemplate(null, null, consolidadoDre.data_publicacao)}
                    <IconeEditarRetificacao
                        consolidadoDre={consolidadoDre}
                    />
                </div>
            }
        </>
    )
}

export default memo(InfoRetificacaoRelatorio)