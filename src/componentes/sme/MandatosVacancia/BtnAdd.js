import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const BtnAdd = ({ setShowModalForm, initialStateFormModal, setStateFormModal }) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
    return (
        <div className="d-flex justify-content-end pb-4 mt-2 BtnAdd">
            <button
                data-qa="botao-adicionar-mandato-vacancia"
                onClick={() => {
                    setStateFormModal(initialStateFormModal);
                    setShowModalForm(true);
                }}
                type="button"
                className="btn btn-success mt-2"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            >
                <FontAwesomeIcon
                    data-qa="botao-adicionar-mandato-vacancia-icone"
                    style={{ fontSize: '15px', marginRight: '5', color: '#fff' }}
                    icon={faPlus}
                />
                Adicionar período de mandato
            </button>
        </div>
    );
};
