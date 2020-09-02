import React from "react";
import {CancelarPrestacaoDeContas, SalvarPrestacaoDeContas, ConcluirPrestacaoDeContas} from "../../../../../utils/Modais";

export const TopoComBotoes = ({handleClickCadastrar, btnCadastrarTexto, showCancelar, setShowSalvar, showSalvar, showConcluir, onHandleClose, onShowCancelar, onShowSalvar, onShowConcluir, onCancelarTrue, onSalvarTrue,  onConcluirTrue, contaConciliacao}) => {

    return (
        <div className="row mt-3">
            <div className='col-12 col-md-6 mt-2'>
                <p className='detalhe-das-prestacoes-titulo'>Demonstrativo financeiro da conta {contaConciliacao}</p>
            </div>
            {btnCadastrarTexto &&
                <div className='col-12 col-md-6 text-right'>
                    <button type="button" onClick={handleClickCadastrar} className="btn btn-outline-success mr-2 mt-2"> <strong>{btnCadastrarTexto}</strong></button>
                    <button type="button" onClick={()=>setShowSalvar(true)} className="btn btn-outline-success mt-2"><strong>Salvar</strong></button>
                </div>
            }
            <section>
                <SalvarPrestacaoDeContas show={showSalvar} handleClose={onHandleClose} onSalvarTrue={onSalvarTrue}/>
            </section>
        </div>
    );
};