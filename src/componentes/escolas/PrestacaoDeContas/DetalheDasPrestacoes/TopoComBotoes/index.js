import React from "react";
import {CancelarPrestacaoDeContas, SalvarPrestacaoDeContas, ConcluirPrestacaoDeContas} from "../../../../../utils/Modais";

export const TopoComBotoes = ({handleClickCadastrar, btnCadastrarTexto, showCancelar, showSalvar, showConcluir, onHandleClose, onShowCancelar, onShowSalvar, onShowConcluir, onCancelarTrue, onSalvarTrue,  onConcluirTrue, contaConciliacao}) => {

    return (
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='detalhe-das-prestacoes-titulo'>Conciliação Bancária da Conta {contaConciliacao}</p>
            </div>
            {btnCadastrarTexto &&
                <div className='col-12 col-md-7 text-right'>
                    <button onClick={handleClickCadastrar} type="button" className="btn btn-outline-success mr-2 mt-2"> <strong>{btnCadastrarTexto}</strong></button>
                    <button type="button" onClick={onShowCancelar} className="btn btn-outline-success mr-2 mt-2"><strong>Cancelar</strong></button>
                    <button type="button" onClick={onShowSalvar} className="btn btn-outline-success mt-2"><strong>Salvar</strong></button>
                    <button disabled="" onClick={onShowConcluir} type="button" className="btn btn-success ml-2 mt-2"><strong>Concluir a conciliação</strong></button>
                </div>
            }
            <section>
                <CancelarPrestacaoDeContas show={showCancelar} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
            <section>
                <SalvarPrestacaoDeContas show={showSalvar} handleClose={onHandleClose} onSalvarTrue={onSalvarTrue}/>
            </section>
            <section>
                <ConcluirPrestacaoDeContas show={showConcluir} handleClose={onHandleClose} onConcluirTrue={onConcluirTrue}/>
            </section>
        </div>
    );
}