import React, {memo} from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from "react-tooltip";
import {Link} from 'react-router-dom';
import IconeMarcarPublicacaoNoDiarioOficial from "./IconeMarcarPublicacaoNoDiarioOficial";
import {visoesService} from "../../../../services/visoes.service";
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
            {consolidadoDre && consolidadoDre?.eh_retificacao && !consolidadoDre.ja_publicado &&
            <div className='mb-0 fonte-12 fonte-normal'>
                    <strong style={{color: '#00585E', fontWeight: '600', fontSize: '14px', marginRight: '8px'}}>
                        Editar Retificação
                    </strong>
                    <Link
                        onClick={e => !visoesService.getPermissoes(['change_relatorio_consolidado_dre']) && e.preventDefault()}
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


                        <button
                            className="btn btn-link p-0"
                            disabled={!visoesService.getPermissoes(['change_relatorio_consolidado_dre'])}
                        >
                            <FontAwesomeIcon
                                style={{marginRight: "0", color: '#00585E', fontSize: '18px'}}
                                icon={faEdit}
                            />
                        </button>

                    </Link>
            </div>
            }
        </>
    )
}

export default memo(InfoPublicacaoNoDiarioOficial)