import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const Cabecalho = ({prestacaoDeContas, exibeSalvar, metodoSalvarAnalise}) => {
    console.log('Cabecalho ', prestacaoDeContas)
    return (
        <>
            {Object.entries(prestacaoDeContas).length > 0 &&
            <>
                <div className="d-flex bd-highlight mt-3 mb-3 container-cabecalho">
                    <div className="flex-grow-1 bd-highlight">
                        <p className='titulo-explicativo'>{prestacaoDeContas.associacao.nome}</p>
                    </div>
                    <div className="p-2 bd-highlight">
                        <Link
                            to={`/dre-lista-prestacao-de-contas/${prestacaoDeContas.periodo_uuid}/${prestacaoDeContas.status}`}
                            className="btn btn-outline-success btn-ir-para-listagem ml-2"
                        >
                            <FontAwesomeIcon
                                style={{marginRight: "5px", color: '#00585E'}}
                                icon={faArrowLeft}
                            />
                            Ir para a listagem
                        </Link>
                    </div>
                    {exibeSalvar &&
                        <div className="p-2 bd-highlight">
                            <button
                                onClick={metodoSalvarAnalise}
                                className="btn btn-success"
                            >
                                Salvar
                            </button>
                        </div>
                    }

                </div>
                <div className="row">
                    <div className='col-12 col-md-6'>
                        <p><strong>Código Eol: </strong>{prestacaoDeContas.associacao.unidade.codigo_eol}</p>
                    </div>
                    <div className='col-12 col-md-6'>
                        <p><strong>Presidente da APM: </strong> {prestacaoDeContas.associacao.presidente_associacao.nome}</p>
                    </div>
                    <div className='col-12 col-md-6'>
                        <p><strong>Número do CNPJ: </strong> {prestacaoDeContas.associacao.cnpj}</p>
                    </div>
                    <div className='col-12 col-md-6'>
                        <p><strong>Presidente do Conselho Fiscal: </strong> {prestacaoDeContas.associacao.presidente_conselho_fiscal.nome}</p>
                    </div>
                    <div className='col-12'>
                        <hr className='mt-2 mb-2'/>
                    </div>
                </div>
            </>
            }
        </>
    );
};