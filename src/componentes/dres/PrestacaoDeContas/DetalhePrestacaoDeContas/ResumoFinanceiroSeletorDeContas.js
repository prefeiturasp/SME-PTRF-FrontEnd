import React, {Fragment} from "react";

export const ResumoFinanceiroSeletorDeContas = ({infoAta, infoAtaPorConta, clickBtnEscolheConta, toggleBtnEscolheConta, exibeAtaPorConta}) => {
    //console.log("Info Ata ", infoAta)
    console.log("infoAtaPorConta ", infoAtaPorConta)
    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-4'>Resumo Financeiro</h4>
            <nav className="nav mb-4 mt-2 menu-interno">
            {infoAta && infoAta.contas && infoAta.contas.length && infoAta.contas.map((conta, index)=>
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
    )
};