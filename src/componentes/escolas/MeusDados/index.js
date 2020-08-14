import React, {useState} from "react";
import "./meus-dados.scss"
import {USUARIO_NOME, USUARIO_LOGIN, USUARIO_EMAIL, USUARIO_CPF, ASSOCIACAO_NOME, ASSOCIACAO_NOME_ESCOLA} from "../../../services/auth.service";
import {AlterarSenhaMeusDados, AlterarEmailMeusDados} from "../../../utils/Modais";
import {FormInicialEditar} from "./formInicialEditar";

export const MeusDados = () => {
    const [showEditarEmail, setShowEditarEmail] = useState(false);
    const [showEditarSenha, setShowEditarSenha] = useState(false);

    const onHandleClose = () => {
        setShowEditarSenha(false);
        setShowEditarEmail(false);
    };
    return (
        <>
            <div className="row container-meus-dados">
                <div className="col-12 col-md-4 align-self-center container-meus-dados-esquerda">
                    <p className="nome-usuario mb-5">{localStorage.getItem(USUARIO_NOME)}</p>
                    <p className="dados-complentares mb-0"><strong>RF: </strong>{localStorage.getItem(USUARIO_LOGIN)}</p>
                    <p className="dados-complentares mb-0"><strong>Associação:</strong> {localStorage.getItem(ASSOCIACAO_NOME_ESCOLA)}</p>
                    <p className="dados-complentares mb-0"><strong>Email:</strong> {localStorage.getItem(USUARIO_EMAIL)}</p>
                </div>
                <div className="col-12 col-md-8 px-5 py-4 align-self-center container-meus-dados-direita">
                    <FormInicialEditar
                        setShowEditarEmail={setShowEditarEmail}
                        setShowEditarSenha={setShowEditarSenha}
                    />
                </div>
                <section>
                    <AlterarEmailMeusDados
                        show={showEditarEmail}
                        handleClose={onHandleClose}
                    />
                </section>
                <section>
                    <AlterarSenhaMeusDados
                        show={showEditarSenha}
                        handleClose={onHandleClose}
                    />
                </section>
            </div>
        </>
    );
};