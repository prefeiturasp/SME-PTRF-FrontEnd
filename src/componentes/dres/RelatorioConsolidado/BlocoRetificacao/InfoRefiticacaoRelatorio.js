import React, {memo, useMemo} from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import IconeEditarRetificacao from "../BlocoRetificacao/IconeEditarRetificacao";
import { TextoDocumentoConsolidadoPC } from "../../../../utils/TextoDocumentoConsolidadoPC";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado";

const InfoRetificacaoRelatorio = ({consolidadoDre}) => {
    const dataTemplate = useDataTemplate();
    const { recursoSelecionado } = useRecursoSelecionadoContext();

    const text_possessive = useMemo(() => new TextoDocumentoConsolidadoPC(recursoSelecionado?.habilita_exibicao_de_lauda).possessivo(), [recursoSelecionado?.habilita_exibicao_de_lauda]);

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
