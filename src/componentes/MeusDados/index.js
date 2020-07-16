import React, {useState} from "react";
import "./meus-dados.scss"
import {USUARIO_NOME, USUARIO_LOGIN, USUARIO_EMAIL, USUARIO_CPF} from "../../services/auth.service";
import {AlterarSenhaMeusDados, EditarMembro} from "../../utils/Modais";

export const MeusDados = () => {
    const [showEditarSenha, setShowEditarSenha] = useState(false);
    const onHandleClose = () => {
        setShowEditarSenha(false);
    };
    return (
        <>
            <div className="row container-meus-dados">
                <div className="col-12 col-md-4 align-self-center container-meus-dados-esquerda">
                    <p className="nome-usuario mb-5">{localStorage.getItem(USUARIO_NOME)}</p>
                    <p className="dados-complentares mb-0">RF: {localStorage.getItem(USUARIO_LOGIN)}</p>
                    <p className="dados-complentares mb-0">CPF: {localStorage.getItem(USUARIO_CPF)}</p>
                </div>

                <div className="col-12 col-md-8 px-5 py-4 align-self-center container-meus-dados-direita">
                    <form>
                        <div className="row">
                            <div className="col-12 mt-3">
                                <label htmlFor="email"><strong>Email</strong></label>
                            </div>
                            <div className='col-10'>
                                <div className="form-group">
                                    <input readOnly={true} name="email" type="email" className="form-control" id="email" placeholder="Clique em editar para inserir um e-mail"/>
                                </div>
                            </div>
                            <div className='col-2'>
                                <div className="form-group">
                                    <button type="button" className="btn btn-outline-success">Editar</button>
                                </div>
                            </div>

                            <div className="col-12 mt-5">
                                <label htmlFor="senha"><strong>Senha</strong></label>
                            </div>

                            <div className='col-10'>
                                <div className="form-group">
                                    <input readOnly={true} name="senha" type="password" className="form-control" id="senha" placeholder="************"/>
                                </div>
                            </div>
                            <div className='col-2'>
                                <div className="form-group">
                                    <button onClick={()=>setShowEditarSenha(true)}  type="button" className="btn btn-outline-success">Editar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
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