import React, {Fragment} from "react";

export const ResumoFinanceiroSeletorDeContas = ({infoAta, clickBtnEscolheConta, toggleBtnEscolheConta, exibeAtaPorConta}) => {
    return(
        <>
                {infoAta && infoAta.contas && infoAta.contas.length > 0 &&
                    <>
                        <hr className='mt-4 mb-3'/>
                        <h4 className='mb-4'>Resumo Financeiro</h4>
                        <nav className="nav mb-3 mt-2 menu-interno">
                            {infoAta && infoAta.contas && infoAta.contas.length > 0 && infoAta.contas.map((conta, index)=>
                                <Fragment key={index}>
                                    <li className="nav-item">
                                        <button
                                            type='button'
                                            onClick={()=>{
                                                toggleBtnEscolheConta(index);
                                                exibeAtaPorConta(conta.conta_associacao.nome)
                                            }}
                                            className={`nav-link btn-escolhe-acao mr-3 ${clickBtnEscolheConta[index] ? "btn-escolhe-acao-active" : ""}`}
                                        >
                                            Conta {conta.conta_associacao.nome}
                                        </button>
                                    </li>
                                </Fragment>
                            )}
                        </nav>
                    </>
                }

        </>
    )
};