import React from "react";

export const FormInicialEdiar = ({setShowEditarEmail, setShowEditarSenha}) => {

    return(
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
                        <button onClick={()=>setShowEditarEmail(true)} type="button" className="btn btn-outline-success">Editar</button>
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
    );
};