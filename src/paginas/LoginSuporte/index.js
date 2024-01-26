import React from "react";
import {LoginSuporteForm} from "./components/LoginSuporteForm"
import { LoginSuporteContainer } from "./components/LoginSuporteContainer";

export const LoginSuporte = (props) => {
    return (
        <>
            <LoginSuporteContainer>
                <LoginSuporteForm
                    redefinicaoDeSenha={props.location.redefinicaoDeSenha}
                />
            </LoginSuporteContainer>
        </>
    )
}