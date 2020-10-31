import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

export const TrilhaDeStatus = ({itensDashboard, retornaQtdeStatus}) => {
    return (
        <>
            <div className='row mt-3 mb-3'>
                <div className='col-12'>
                    <h5>Prestações de contas das Associações</h5>
                </div>
            </div>
            <div className='row'>
                <div className="col-12">
                    <div id="timeline">&nbsp;</div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo-relatorio-consolidado'>{retornaQtdeStatus('NAO_RECEBIDA')}</span>
                            <p className='mt-2'><strong>Não recebido</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo-relatorio-consolidado'>{retornaQtdeStatus('RECEBIDA')}</span>
                            <p className='mt-2'><strong>Recebida e <br/> aguardando análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo-relatorio-consolidado'>{retornaQtdeStatus('DEVOLVIDA')}</span>
                            <p className='mt-2'><strong>Devolvido <br/>para acertos</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo-relatorio-consolidado'>{retornaQtdeStatus('EM_ANALISE')}</span>
                            <p className='mt-2'><strong>Em análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo-relatorio-consolidado-total'>358</span>
                            <p className='mt-2'><strong>Conclusão <br/> da análise</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};