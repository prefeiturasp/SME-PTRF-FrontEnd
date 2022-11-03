import React  from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {exibeDataPT_BR} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import {Link} from "react-router-dom";
import './Cabecalho.scss'

export const Cabecalho = ({relatorioConsolidado}) => {
    return (
        <>
        <div className="d-flex bd-highlight mt-3 mb-0 container-cabecalho">
            <div className="flex-grow-1 bd-highlight">
                <p className='titulo-explicativo mb-0'>{relatorioConsolidado?.dre?.nome}</p>
            </div>

            <div className="p-2 bd-highlight">
                <Link
                    to={`/listagem-relatorios-consolidados-dre/${relatorioConsolidado?.periodo?.uuid}/TODOS`}
                    className="btn btn-outline-success btn-ir-para-listagem ml-2"
                    >
                    <FontAwesomeIcon
                        style={{marginRight: "5px", color: '#00585E'}}
                        icon={faArrowLeft}
                        />
                    Ir para a listagem
                </Link>
            </div>
        </div>
        { relatorioConsolidado.periodo && 
            <div className="info-cabecalho">
                <div className='periodo-info-cabecalho'>
                    <p>Período: <strong>{relatorioConsolidado?.periodo?.referencia} - {exibeDataPT_BR(relatorioConsolidado?.periodo?.data_inicio_realizacao_despesas)} até {exibeDataPT_BR(relatorioConsolidado?.periodo?.data_fim_realizacao_despesas)}</strong></p>
                </div>
                <div className='tipo-relatorio-info-cabecalho'>
                    <p>Tipo de Publicação: <strong>{relatorioConsolidado?.tipo_relatorio}</strong></p>
                </div>
            </div>
        }
        <div className='col-12'>
            <hr className='mt-2 mb-2'/>
        </div>
    </>
        
    )

}
