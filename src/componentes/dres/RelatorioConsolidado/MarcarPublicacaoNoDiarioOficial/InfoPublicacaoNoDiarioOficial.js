import React, {memo} from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import IconeMarcarPublicacaoNoDiarioOficial from "./IconeMarcarPublicacaoNoDiarioOficial";
const dataTemplate = useDataTemplate()

const InfoPublicacaoNoDiarioOficial = ({consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao}) => {
    return(
        <>
            {consolidadoDre && consolidadoDre.data_publicacao &&
                <div className='mb-0 fonte-12 fonte-normal'>
                    <strong>Data da publicação:</strong> {dataTemplate(null, null, consolidadoDre.data_publicacao)}
                    <IconeMarcarPublicacaoNoDiarioOficial
                        consolidadoDre={consolidadoDre}
                        carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                    />
                </div>
            }
        </>
    )
}

export default memo(InfoPublicacaoNoDiarioOficial)