import React from "react";
import {LoginForm} from "./LoginForm"
import {LoginContainer} from "../LoginContainer";

export const Login = (props) => {
    return (
        <>
            <LoginContainer>
                <LoginForm
                    redefinicaoDeSenha={props.location.redefinicaoDeSenha}
                />
            </LoginContainer>
        </>
    )
}