import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";
import {useQueryClient} from '@tanstack/react-query';
import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from "../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios";

export const AddUsuario = () => {
    const TEM_PERMISSAO_EDICAO_GESTAO_USUARIOS = RetornaSeTemPermissaoEdicaoGestaoUsuarios()

    let history = useHistory();
    const queryClient = useQueryClient();
    
    const removeQuery = () => {
        queryClient.removeQueries('grupos-disponiveis-acesso-usuario')
    }

    return (
        <button onClick={() => {
            history.push('/gestao-de-usuarios-form')
            removeQuery()
        }
        } type="button" className="btn btn-success mt-2" disabled={!TEM_PERMISSAO_EDICAO_GESTAO_USUARIOS}>
            <FontAwesomeIcon
                style={{fontSize: '15px', marginRight: "5", color: "#fff"}}
                icon={faPlus}
            />
            Adicionar
        </button>
    )
}