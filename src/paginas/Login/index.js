import React from "react";
import {LoginForm} from "./LoginForm"
import {LoginContainer} from "../LoginContainer";
import { useLocation } from "react-router-dom";

export const Login = () => {
    const location = useLocation();
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