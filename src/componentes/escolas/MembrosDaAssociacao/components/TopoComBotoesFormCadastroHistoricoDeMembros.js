import React from "react";
import {Link} from "react-router-dom";
import {useGetComposicao} from "../hooks/useGetComposicao";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import {RetornaSeTemPermissaoEdicaoHistoricoDeMembros} from "../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";

export const TopoComBotoesFormCadastroHistoricoDeMembros = ({composicaoUuid, cargo, isValid, retornaSeEhComposicaoVigente, onInformarSaida}) => {

    const {data} = useGetComposicao(composicaoUuid)
    const dataTemplate = useDataTemplate()

    const TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS = RetornaSeTemPermissaoEdicaoHistoricoDeMembros()

    return(
        <div className="d-flex align-items-end mt-0">
            <div className="p-2 pt-3 mr-auto">
                <h5 className="titulo-explicativo mb-0">{cargo && cargo.uuid ? "Editar membro" : "Adicionar membro"}</h5>
                <p className='mb-0 fonte-16'>
                    <strong><span>Mandato: </span>{data && data.mandato ? dataTemplate('', '', data.mandato.data_inicial) : ""} até {data && data.mandato ? dataTemplate('', '', data.mandato.data_final) : ""}</strong>
                </p>
            </div>
            <div className="p-2 pt-3" data-qa='composicao-info'>
                {
                    cargo.uuid ? (
                        <button
                            disabled={!isValid || !retornaSeEhComposicaoVigente() || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                            type='button'
                            className="btn btn-success mr-2"
                            onClick={onInformarSaida}
                        >
                            Informar saída
                        </button>   
                    ) : null
                }              
                <Link
                    to={{
                        pathname: `/membros-da-associacao`,
                    }}
                    className="btn btn-outline-success mr-2"
                    data-qa='editar-membro'
                >
                    Voltar
                </Link>
                <button
                    disabled={!isValid || !retornaSeEhComposicaoVigente() || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                    type='submit'
                    className="btn btn-success mr-2"
                >
                    Salvar
                </button>
            </div>
        </div>
    )

}