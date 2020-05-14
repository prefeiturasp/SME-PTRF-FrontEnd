import React from "react";
import {CancelarPrestacaoDeContas} from "../../../../utils/Modais";

export const TopoComBotoes = ({handleClickCadastrar, btnCadastrarTexto, showCancelar, onHandleClose, onCancelarTrue, onShowCancelar}) => {

    return (
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='detalhe-das-prestacoes-titulo'>Demonstrativo financeiro da conta cheque</p>
            </div>

            <div className='col-12 col-md-7 text-right'>
                <button onClick={handleClickCadastrar} type="button" className="btn btn-outline-success mr-2 mt-2"><strong>{btnCadastrarTexto}</strong></button>
                <button type="button" onClick={onShowCancelar} className="btn btn-outline-success mr-2 mt-2"><strong>Cancelar</strong></button>
                <button type="button" className="btn btn-outline-success mt-2"><strong>Salvar</strong></button>
                <button disabled="" type="button" className="btn btn-success btn-readonly ml-2 mt-2"><strong>Concluir a conciliação</strong></button>
            </div>

            <section>
                <CancelarPrestacaoDeContas show={showCancelar} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>

        </div>
    );
}