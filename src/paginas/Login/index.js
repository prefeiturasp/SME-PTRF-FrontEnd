import React, { useEffect } from "react";
import {LoginForm} from "./LoginForm"
import {LoginContainer} from "../LoginContainer";
import { useLocation } from "react-router-dom";
import { recursoSelecionadoStorageService } from "../../services/storages/RecursoSelecionado.storage.service";

export const Login = () => {
    const location = useLocation();

    useEffect(() => recursoSelecionadoStorageService.clearAutomaticallyDataExpiredRecursoSelecionado(), [])

    return (
        <>
            <LoginContainer>
                <LoginForm
                    redefinicaoDeSenha={location.state?.redefinicaoDeSenha}
                />
            </LoginContainer>
        </>
    )
}