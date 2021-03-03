import React from "react";
import {visoesService} from "../../../../../services/visoes.service";

export const TopoComBotoes = ({onSalvarTrue, contaConciliacao, showSalvar}) => {
    return (
        <>
            <div className="d-flex bd-highlight mt-3 mb-3">
                <div className="flex-grow-1 bd-highlight">
                    <p className='detalhe-das-prestacoes-titulo'>Demonstrativo financeiro da conta {contaConciliacao}</p>
                </div>
                {visoesService.getPermissoes(['add_despesa']) &&
                    <div className="bd-highlight">
                        <button type="button" onClick={()=>window.location.assign('/cadastro-de-despesa/tabela-de-lancamentos-despesas')} className="btn btn-outline-success mr-2 mt-2"><strong>Cadastrar despesa</strong></button>
                    </div>
                }
                {visoesService.getPermissoes(['add_receita']) &&
                    <div className="bd-highlight">
                        <button type="button" onClick={()=>window.location.assign('/cadastro-de-credito/tabela-de-lancamentos-receitas')} className="btn btn-outline-success mr-2 mt-2"><strong>Cadastrar receita</strong></button>
                    </div>
                }
                {visoesService.getPermissoes(['change_conciliacao_bancaria']) &&
                    <div className="bd-highlight">
                    <button type="button" onClick={() => onSalvarTrue()} className="btn btn-success mt-2" disabled={!showSalvar}><strong>Salvar</strong></button>
                    </div>
                }
            </div>
        </>
    );
};