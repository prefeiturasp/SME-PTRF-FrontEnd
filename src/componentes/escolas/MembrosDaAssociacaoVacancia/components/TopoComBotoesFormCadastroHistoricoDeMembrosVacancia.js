import React from "react";
import {Link} from "react-router-dom";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import {RetornaSeTemPermissaoEdicaoHistoricoDeMembros} from "../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";


export const TopoComBotoesFormCadastroHistoricoDeMembrosVacancia = ({
    mandato,
    isValid,
    onInformarSaida,
    ehEdicao,
    ocupanteVigente,
    podeCancelarSaida, onCancelarSaida,
    podeCancelarEntrada, onCancelarEntrada,
    marcoSelecionado
    }) => {

    const dataTemplate = useDataTemplate()
    const TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS = RetornaSeTemPermissaoEdicaoHistoricoDeMembros()

    return (
        <div className="d-flex align-items-end mt-0 TopoComBotoesFormCadastroHistoricoDeMembrosVacancia">
            <div className="p-2 pt-3 mr-auto">
                <h5 className="titulo-explicativo mb-0">{ehEdicao ? "Editar membro" : "Adicionar membro"}</h5>
                <p className='mb-0 fonte-16'>
                    <strong><span>Mandato: </span>{mandato ? dataTemplate('', '', mandato.data_inicial) : ""} até {mandato ? dataTemplate('', '', mandato.data_final) : ""}</strong>
                </p>
            </div>
            <div className="p-2 pt-3" data-qa='composicao-info'>
                {ehEdicao &&
                    <button
                        disabled={!ocupanteVigente || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                        type='button'
                        className="btn btn-success mr-2"
                        onClick={onInformarSaida}
                        title={!ocupanteVigente ? 'Cargo não é vigente' : 'Informar Saída de membro'}
                    >
                        Informar saída
                    </button>
                }
                {podeCancelarEntrada &&
                    <button
                        disabled={!TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                        type='button'
                        className="btn btn-outline-danger mr-2"
                        onClick={onCancelarEntrada}
                        title='Remove o cadastro deste ocupante, como se a entrada nunca tivesse acontecido'
                    >
                        Cancelar Entrada
                    </button>
                }
                {podeCancelarSaida &&
                    <button
                        disabled={!TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                        type='button'
                        className="btn btn-outline-danger mr-2"
                        onClick={onCancelarSaida}
                        title='Reverte a saída informada, o ocupante volta a ser vigente'
                    >
                        Cancelar Saída
                    </button>
                }
                <Link
                    to={`/membros-da-associacao`}
                    state={{marcoSelecionado}}
                    className="btn btn-outline-success mr-2"
                    data-qa='voltar-membro'
                >
                    Voltar
                </Link>
                <button
                    disabled={!isValid || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                    type='submit'
                    className="btn btn-success mr-2">
                    Salvar
                </button>
            </div>
        </div>
    )
}