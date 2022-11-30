import React from 'react';
import IconeDevolucaoVersao from "../../../../../assets/img/icone-devolucao-versao.svg"
import IconeDevolucaoData from "../../../../../assets/img/icone-devolucao-data.svg"
import IconeDevolucaoPrazoReenvio from "../../../../../assets/img/icone-devolucao-prazo-reenvio.svg"
import { Ordinais } from '../../../../../utils/ValidacoesNumeros'
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import './styles.scss'

export const CardsInfoDevolucaoSelecionada = ({cardDataDevolucao, tabAtual}) => {
    const dataTemplate = useDataTemplate()

    if (tabAtual !== 'historico'){
        return null
    }

    return (
            <div className="card-deck mt-4">

                <div className="card">
                    <div className="card-body card-info-devolucao-para-acerto-dre pb-1">
                        <h5 className="card-title"><img src={IconeDevolucaoVersao} alt="" className="img-fluid"/></h5>
                        <p className="card-text fonte-16 mb-0"><strong>Versão da devolução:</strong> </p>
                        <p className="card-text texto-info pb-0">{Ordinais(0)}</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body card-info-devolucao-para-acerto-dre pb-1">
                        <h5 className="card-title"><img src={IconeDevolucaoData} alt="" className="img-fluid"/></h5>
                        <p className="card-text fonte-16 mb-0"><strong>Data de devolução da DRE:</strong> </p>
                        <p className="card-text texto-info pb-0">{dataTemplate(null, null, cardDataDevolucao.data_devolucao)}</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body card-info-devolucao-para-acerto-dre pb-1">
                        <h5 className="card-title"><img src={IconeDevolucaoPrazoReenvio} alt="" className="img-fluid"/></h5>
                        <p className="card-text fonte-16 mb-0"><strong>Prazo para reenvio:</strong> </p>
                        <p className="card-text texto-info pb-0">{dataTemplate(null, null, cardDataDevolucao.data_limite)}</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body card-info-devolucao-para-acerto-dre pb-1">
                        <h5 className="card-title"><img src={IconeDevolucaoPrazoReenvio} alt="" className="img-fluid"/></h5>
                        <p className="card-text fonte-16 mb-0"><strong>Data de retorno para análise:</strong> </p>
                        <p className="card-text texto-info pb-0">{dataTemplate(null, null, cardDataDevolucao.data_retorno_analise)}</p>
                    </div>
                </div>
            </div>
        )
}