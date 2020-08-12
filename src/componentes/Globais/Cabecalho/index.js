import React from "react";
import "./cabecalho.scss"
import LogoPtrf from "../../../assets/img/logo-ptrf-verde.png"
import IconeSair from "../../../assets/img/sair.svg"

import { authService, USUARIO_LOGIN } from '../../../services/auth.service';
import {DADOS_USUARIO_LOGADO, visoesService} from "../../../services/visoes.service";

export const Cabecalho = () => {

    const logout = () => {
        authService.logout()
    };

    let login_usuario = localStorage.getItem(USUARIO_LOGIN)
    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado(login_usuario);

    const onChangeVisao = (value) =>{
        console.log("onChangeVisao ", value);
        visoesService.alternaVisoes(value)
    };

    return (
        <>
            <div className="col-12 cabecalho fixed-top pb-0">

                <div className="d-flex justify-content-between bd-highlight align-items-center">
                    <div className="p-2 bd-highlight">
                        <img className="img-fluid logo-cabecalho ml-3" src={LogoPtrf} alt=""/>
                    </div>
                    <div className="p-2 bd-highlight container-select-visoes">
                        <select
                            value={dados_usuario_logado.visao_selecionada.tipo}
                            onChange={(e)=>onChangeVisao(e.target.value)}
                            className="form-control"
                        >
                            <option value="" className="dropdown-item">Escolha uma opção</option>
                            {dados_usuario_logado.visoes.map((visao, index)=>
                                <option value={visao.tipo} key={index} className="dropdown-item">{visao.label}</option>
                            )}
                        </select>
                    </div>
                    <div className="p-2 bd-highlight text-center ">
                        <button className="btn-sair" onClick={logout}><img className="img-fluid icone-sair" src={IconeSair} alt=""/></button>
                        <p className="mb-">Sair</p>
                    </div>
                </div>
            </div>
        </>
    );
}