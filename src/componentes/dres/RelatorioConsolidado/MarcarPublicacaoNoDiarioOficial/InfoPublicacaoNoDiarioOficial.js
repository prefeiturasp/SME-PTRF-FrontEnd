import React, {memo} from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from "react-tooltip";
import {Link} from 'react-router-dom';
import IconeMarcarPublicacaoNoDiarioOficial from "./IconeMarcarPublicacaoNoDiarioOficial";
const dataTemplate = useDataTemplate()

const InfoPublicacaoNoDiarioOficial = ({consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao}) => {
    return(
        <>
            {consolidadoDre && consolidadoDre.data_publicacao && !consolidadoDre?.eh_retificacao &&
                <div className='mb-0 fonte-12 fonte-normal'>
                    <strong>Data da publicação:</strong> {dataTemplate(null, null, consolidadoDre.data_publicacao)}
                    <IconeMarcarPublicacaoNoDiarioOficial
                        consolidadoDre={consolidadoDre}
                        carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                    />
                </div>
            }
            {consolidadoDre && consolidadoDre?.eh_retificacao &&
            <div className='mb-0 fonte-12 fonte-normal'>
                    <strong style={{color: '#00585E', fontWeight: '600', fontSize: '14px', marginRight: '5px'}}>
                        Editar Retificação
                    </strong>
                    <Link
                        to={
                            {
                                pathname: `/dre-relatorio-consolidado-retificacao/${consolidadoDre.uuid}`,
                                state: {
                                    referencia_publicacao: consolidadoDre.titulo_relatorio,
                                    eh_edicao_retificacao: true
                                }
                            }
                        }
                    >
                        <FontAwesomeIcon
                            style={{marginRight: "0", color: '#00585E', fontSize: '18px'}}
                            icon={faEdit}
                        />
                    </Link>
            </div>
            }
        </>
    )
}

export default memo(InfoPublicacaoNoDiarioOficial)