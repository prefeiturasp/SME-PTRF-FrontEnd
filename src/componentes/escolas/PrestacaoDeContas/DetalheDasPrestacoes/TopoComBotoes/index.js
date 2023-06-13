import React from "react";
import {visoesService} from "../../../../../services/visoes.service";
import {Link} from "react-router-dom";

export const TopoComBotoes = ({contaConciliacao, periodoFechado, origem}) => {
    return (
        <>
            <div className="d-flex bd-highlight mt-3 mb-3">
                <div className="flex-grow-1 bd-highlight">
                    <p className='detalhe-das-prestacoes-titulo'>Demonstrativo financeiro da conta {contaConciliacao}</p>
                </div>
                {visoesService.getPermissoes(['add_despesa']) &&
                    <div className="bd-highlight">
                        <button type="button" onClick={()=>window.location.assign('/cadastro-de-despesa/tabela-de-lancamentos-despesas')} className="btn btn-outline-success mr-2 mt-2" disabled={periodoFechado}><strong>Cadastrar despesa</strong></button>
                    </div>
                }
                {visoesService.getPermissoes(['add_receita']) &&
                    <div className="bd-highlight">
                        <button type="button" onClick={()=>window.location.assign('/cadastro-de-credito/tabela-de-lancamentos-receitas')} className="btn btn-outline-success mr-2 mt-2" disabled={periodoFechado}><strong>Cadastrar receita</strong></button>
                    </div>
                }
                {origem && origem === 'concluir-periodo' &&
                    <div className="bd-highlight">
                        <Link
                            to={'/prestacao-de-contas'}
                            className="btn btn-outline-success mr-2 mt-2"
                        >
                            <strong>Voltar</strong>
                        </Link>
                    </div>
                }
            </div>
        </>
    );
};