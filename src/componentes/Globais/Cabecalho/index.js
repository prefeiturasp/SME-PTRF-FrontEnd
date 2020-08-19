import React from "react";
import "./cabecalho.scss"
import LogoPtrf from "../../../assets/img/logo-ptrf-verde.png"
import IconeSair from "../../../assets/img/sair.svg"
import { authService, USUARIO_LOGIN } from '../../../services/auth.service';
import {visoesService} from "../../../services/visoes.service";

export const Cabecalho = () => {

    const logout = () => {
        authService.logout()
    };

    let login_usuario = localStorage.getItem(USUARIO_LOGIN);
    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado(login_usuario);

    const onChangeVisao = (e) =>{
        let obj = JSON.parse(e.target.value);
        visoesService.alternaVisoes(
            obj.visao,
            obj.uuid_unidade,
            obj.uuid_associacao,
            obj.nome_associacao,
            obj.unidade_tipo,
            obj.unidade_nome,
        );
    };

    const retornaVisaoConvertida = (visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome) =>{
        let visao_convertida = visoesService.converteNomeVisao(visao);
        let obj;
        if (visao === "DRE"){
            obj = JSON.stringify({
                visao: visao_convertida ,
                uuid_unidade:uuid_unidade,
                uuid_associacao:uuid_unidade,
                nome_associacao:nome_associacao,
                unidade_tipo:unidade_tipo,
                unidade_nome:unidade_nome,
            })
        }else {
            obj = JSON.stringify({
                visao: visao_convertida ,
                uuid_unidade:uuid_unidade,
                uuid_associacao:uuid_associacao,
                nome_associacao:nome_associacao,
                unidade_tipo:unidade_tipo,
                unidade_nome:unidade_nome,
            })
        }
        return obj
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
                            value={
                                retornaVisaoConvertida(
                                    dados_usuario_logado.visao_selecionada.nome,
                                    dados_usuario_logado.unidade_selecionada.uuid,
                                    dados_usuario_logado.associacao_selecionada.uuid,
                                    dados_usuario_logado.associacao_selecionada.nome,
                                    dados_usuario_logado.unidade_selecionada.tipo_unidade,
                                    dados_usuario_logado.unidade_selecionada.nome
                                )}
                            onChange={(e)=>onChangeVisao(e)}
                            className="form-control"
                        >
                            {dados_usuario_logado.unidades.map((unidade, index)=>
                                <option
                                    key={index}
                                    value={
                                        retornaVisaoConvertida(
                                            unidade.tipo_unidade,
                                            unidade.uuid,
                                            unidade.associacao.uuid,
                                            unidade.tipo_unidade === "DRE" ? unidade.nome : unidade.associacao.nome,
                                            unidade.tipo_unidade,
                                            unidade.nome,
                                        )}
                                >
                                    {visoesService.converteNomeVisao(unidade.tipo_unidade)} - {unidade.nome}
                                </option>
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
};