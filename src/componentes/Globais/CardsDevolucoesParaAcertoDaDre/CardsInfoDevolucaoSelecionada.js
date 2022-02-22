import React, {memo} from "react";
import IconeDevolucaoVersao from "../../../assets/img/icone-devolucao-versao.svg"
import IconeDevolucaoData from "../../../assets/img/icone-devolucao-data.svg"
import IconeDevolucaoPrazoReenvio from "../../../assets/img/icone-devolucao-prazo-reenvio.svg"
import useDataTemplate from "../../../hooks/Globais/useDataTemplate";

const CardsInfoDevolucaoSelecionada = ({objetoConteudoCard}) => {

    const dataTemplate = useDataTemplate()

    return(
        <>
            <div className="card-deck mt-4">

                <div className="card">
                    <div className="card-body card-info-devolucao-para-acerto-dre pb-1">
                        <h5 className="card-title"><img src={IconeDevolucaoVersao} alt="" className="img-fluid"/></h5>
                        <p className="card-text fonte-16 mb-0"><strong>Versão da devolução:</strong> </p>
                        <p className="card-text texto-info pb-0">{objetoConteudoCard.versao_da_devolucao ? objetoConteudoCard.versao_da_devolucao :''}</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body card-info-devolucao-para-acerto-dre pb-1">
                        <h5 className="card-title"><img src={IconeDevolucaoData} alt="" className="img-fluid"/></h5>
                        <p className="card-text fonte-16 mb-0"><strong>Data de devolução da DRE:</strong> </p>
                        <p className="card-text texto-info pb-0">{objetoConteudoCard.devolucao_prestacao_conta && objetoConteudoCard.devolucao_prestacao_conta.data ? dataTemplate(null, null, objetoConteudoCard.devolucao_prestacao_conta.data) : ''}</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body card-info-devolucao-para-acerto-dre pb-1">
                        <h5 className="card-title"><img src={IconeDevolucaoPrazoReenvio} alt="" className="img-fluid"/></h5>
                        <p className="card-text fonte-16 mb-0"><strong>Prazo para reenvio:</strong> </p>
                        <p className="card-text texto-info pb-0">{objetoConteudoCard.devolucao_prestacao_conta && objetoConteudoCard.devolucao_prestacao_conta.data_limite_ue ? dataTemplate(null, null, objetoConteudoCard.devolucao_prestacao_conta.data_limite_ue) : ''}</p>
                    </div>
                </div>

                {objetoConteudoCard.devolucao_prestacao_conta && objetoConteudoCard.devolucao_prestacao_conta.data_retorno_ue &&
                    <div className="card">
                        <div className="card-body card-info-devolucao-para-acerto-dre pb-1">
                            <h5 className="card-title"><img src={IconeDevolucaoData} alt="" className="img-fluid"/></h5>
                            <p className="card-text fonte-16 mb-0"><strong>Data de devolução da UE:</strong> </p>
                            <p className="card-text texto-info pb-0">{dataTemplate(null, null, objetoConteudoCard.devolucao_prestacao_conta.data_retorno_ue)}</p>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}
export default memo(CardsInfoDevolucaoSelecionada)



