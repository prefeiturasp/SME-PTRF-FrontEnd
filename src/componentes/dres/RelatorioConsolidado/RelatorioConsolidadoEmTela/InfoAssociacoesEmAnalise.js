import React from "react";

export const InfoAssociacoesEmAnalise = ({totalEmAnalise, periodoUuid}) =>{
    return(
        <>
            {totalEmAnalise > 0 &&
                <div className='row'>
                    <div className='col-12 mb-3'>
                        <h5><strong>Associações com pendências nas prestações de contas</strong></h5>
                        <div className="d-flex bd-highlight mb-3 border-bottom">
                            <div className="py-2 flex-grow-1 bd-highlight">
                                <p className='texto-aviso-associacoes-em-analise'><strong>{totalEmAnalise === 1 ? 'Existe ' + totalEmAnalise + ' associação ': 'Existem ' + totalEmAnalise + ' associações '}  ainda em análise nas prestações de contas</strong></p>
                            </div>
                            <div className="py-2 bd-highlight">
                                <button onClick={()=>window.location.assign(`/dre-lista-prestacao-de-contas/${periodoUuid}/EM_ANALISE`)} className="btn-ir-para-acompanhamento">Ir para painel de acompanhamento</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
};