import React from "react";
import {visoesService} from "../../../../../services/visoes.service";

export const TopoComBotoes = ({handleClickCadastrar, btnCadastrarTexto, onSalvarTrue, contaConciliacao, showSalvar}) => {
    console.log("TopoComBotoes ", btnCadastrarTexto)
    return (
        <div className="row mt-3">
            <div className='col-12 col-md-6 mt-2'>
                <p className='detalhe-das-prestacoes-titulo'>Demonstrativo financeiro da conta {contaConciliacao}</p>
            </div>
            {btnCadastrarTexto &&
                <div className='col-12 col-md-6 text-right'>
                    {(btnCadastrarTexto.includes('Receita') & visoesService.getPermissoes(['add_receita'])) | (btnCadastrarTexto.includes('Despesa') & visoesService.getPermissoes(['add_despesa']))
                    ? <button type="button" onClick={handleClickCadastrar} className="btn btn-outline-success mr-2 mt-2"> <strong>{btnCadastrarTexto}</strong></button>
                    : null}
                    {visoesService.getPermissoes(['change_conciliacao_bancaria'])
                     ?  <button type="button" onClick={()=>onSalvarTrue()} className="btn btn-outline-success mt-2" disabled={!showSalvar}><strong>Salvar</strong></button>
                     : null}
                </div>
            }
        </div>
    );
};