import React from "react";
import {CancelarPrestacaoDeContas, SalvarPrestacaoDeContas, ConcluirPrestacaoDeContas} from "../../../../../utils/Modais";

export const TopoComBotoes = ({handleClickCadastrar, btnCadastrarTexto, showCancelar, setShowSalvar, showSalvar, showConcluir, onHandleClose, onShowCancelar, onShowSalvar, onShowConcluir, onCancelarTrue, onSalvarTrue,  onConcluirTrue, contaConciliacao}) => {

    return (
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='detalhe-das-prestacoes-titulo'>Conciliação Bancária da Conta {contaConciliacao}</p>
            </div>
            {/*{btnCadastrarTexto &&*/}
                <div className='col-12 col-md-7 text-right'>
                    <button type="button" className="btn btn-outline-success mr-2 mt-2"> <strong>{/*{btnCadastrarTexto}*/} Cadastrar Alguma coisa</strong></button>
                    <button type="button" onClick={()=>setShowSalvar(true)} className="btn btn-outline-success mt-2"><strong>Salvar</strong></button>
                </div>
          {/*  }*/}
            <section>
                <SalvarPrestacaoDeContas show={showSalvar} handleClose={onHandleClose} onSalvarTrue={onSalvarTrue}/>
            </section>
        </div>
    );
}