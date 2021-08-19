import React, {useContext, useEffect, useState} from "react";
import {useHistory } from "react-router-dom";
import "./cabecalho.scss"
import LogoPtrf from "../../../assets/img/logo-ptrf-verde.png"
import IconeSair from "../../../assets/img/sair.svg"
import IconeMenuMeuPerfil from "../../../assets/img/icone-menu-meu-perfil.png"
import { authService, USUARIO_LOGIN } from '../../../services/auth.service';
import {visoesService} from "../../../services/visoes.service";
import {NotificacaoContext} from "../../../context/Notificacoes";
import {CentralDeDownloadContext} from "../../../context/CentralDeDownloads"
import {ModalConfirmaLogout} from "./ModalConfirmaLogout";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faChevronDown, faTrash, faUser, faFileDownload} from "@fortawesome/free-solid-svg-icons";

export const Cabecalho = () => {

    const history = useHistory();
    const logout = async () => {
        await authService.logout()
    };
    let login_usuario = localStorage.getItem(USUARIO_LOGIN);
    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado(login_usuario);

    const notificacaoContext = useContext(NotificacaoContext);
    const centralDownloadContext = useContext(CentralDeDownloadContext)

    const [exibeMenu, setExibeMenu] = useState(true);
    const [show, setShow] = useState(false);

    useEffect(()=>{
        qtdeNotificacoesNaoLidas()
    }, []);

    useEffect(()=>{
        qtdeCentralDeDownloadNaoLidas()
    }, []);

    const qtdeNotificacoesNaoLidas = async () =>{
        await notificacaoContext.getQtdeNotificacoesNaoLidas()
    };

    const qtdeCentralDeDownloadNaoLidas = async () => {
        await centralDownloadContext.getQtdeNotificacoesNaoLidas()
    }

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
        if (visao === "DRE" || visao === "SME"){
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

    const redirectCentralDeNotificacoes = () =>{
        let path = `/central-de-notificacoes`;
        history.push(path);
    };

    const redirectCentralDeDownloads = () => {
        let path = `/central-de-downloads`;
        history.push(path);
    }

    const onShow = async () =>{
        let qtde = await notificacaoContext.getQtdeNotificacoesNaoLidas();
        if(qtde > 0){
            setShow(true);
        }else {
            await logout();
        }
    };

    const onLogoutTrue = async () =>{
        setShow(false);
        await logout();
    };

    const onHandleClose = () => {
        setShow(false);
    };

    const onRedirectNotificacoes = () => {
        setShow(false);
        window.location.assign('/central-de-notificacoes')
    };

    return (
        <>
            {authService.isLoggedIn() &&
                <>
                    <div className="col-12 cabecalho fixed-top pb-0">
                        <div className="row">
                            <div className='col col-md-2 col-lg-3 col-xl-2 '>
                                <div className="p-3">
                                    <img className="logo-cabecalho ml-3" src={LogoPtrf} alt=""/>
                                </div>
                            </div>
                            <div className="col col-md-3 col-lg-5 col-xl-6 mt-2 pl-lg-0 pl-xl-2">
                                {exibeMenu &&
                                <div className="pt-2 container-select-visoes">
                                    <div className="d-flex mb-3 w-100">
                                        <div className="p-2 bd-highlight"><span className='span-label-visao-selecionada'>{visoesService.getItemUsuarioLogado('visao_selecionada.nome')}</span></div>

                                        <div className="p-0 bd-highlight w-100">
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
                                                                unidade.tipo_unidade === "DRE" || unidade.tipo_unidade === "SME" ? unidade.nome : unidade.associacao.nome,
                                                                unidade.tipo_unidade,
                                                                unidade.nome,
                                                            )}
                                                    >
                                                        {unidade.tipo_unidade} - {unidade.nome}
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                            <div className="col col-md-5 col-lg-4">
                                <div className="row">
                                    <div className="col-3 p-0 m-0 text-right pt-4">
                                        <button
                                            onClick={()=>redirectCentralDeDownloads()}
                                            className="btn-sair">
                                            <span className="span-icone-verde">
                                                <FontAwesomeIcon
                                                    style={{fontSize: '16px', color:'#fff'}}
                                                    icon={faFileDownload}
                                                />
                                            <span className={centralDownloadContext.qtdeNotificacoesNaoLidas && centralDownloadContext.qtdeNotificacoesNaoLidas >= 10 ? `span-notificacoes-maior-que-10` : 'span-notificacoes-menor-que-10'} >{centralDownloadContext.qtdeNotificacoesNaoLidas ? centralDownloadContext.qtdeNotificacoesNaoLidas : 0}</span>
                                            </span>
                                        </button>

                                        <button
                                            onClick={()=>redirectCentralDeNotificacoes()}
                                            className="btn-sair">
                                            <span className="span-icone-verde">
                                                <FontAwesomeIcon
                                                    style={{fontSize: '16px', color:'#fff'}}
                                                    icon={faBell}
                                                />
                                            <span className={notificacaoContext.qtdeNotificacoesNaoLidas && notificacaoContext.qtdeNotificacoesNaoLidas >= 10 ? `span-notificacoes-maior-que-10` : 'span-notificacoes-menor-que-10'} >{notificacaoContext.qtdeNotificacoesNaoLidas ? notificacaoContext.qtdeNotificacoesNaoLidas : 0}</span>
                                            </span>
                                        </button>
                                    </div>


                                    <div className="col text-left pt-xl-3 m-0">
                                    <li className="link-acoes nav-link dropdown">
                                        <a href="#" id="linkDropdownAcoes" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <button className="btn-sair">
                                            <span className="span-icone-verde">
                                            <FontAwesomeIcon
                                                style={{fontSize: '16px', color:'#fff'}}
                                                icon={faUser}
                                            />
                                            </span>
                                            <span className="span-text-dropdown">
                                                {dados_usuario_logado
                                                    .usuario_logado
                                                    .nome
                                                    .toLowerCase()
                                                    .replace(/(?:^|\s|['`‘’.-])[^\x00-\x60^\x7B-\xDF](?!(\s|$))/g, function (a) {
                                                        return a.toUpperCase();
                                                    })
                                                }
                                            </span>
                                            <FontAwesomeIcon
                                                style={{fontSize: '16px', color:'#0'}}
                                                icon={faChevronDown}
                                            />
                                            </button>
                                        </a>

                                        <div className={`dropdown-menu dropdown-menu-opcoes`}aria-labelledby="linkDropdownAcoes">
                                            <button className="btn-sair" onClick={()=>history.push(`/meus-dados`)}>Meus dados</button><br />
                                            <button className="btn-sair" onClick={()=>onShow()}>Sair</button>
                                        </div>
                                    </li>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>
                    <section>
                        <ModalConfirmaLogout
                            show={show}
                            handleClose={onHandleClose}
                            onRedirectNotificacoes={onRedirectNotificacoes}
                            onLogoutTrue={onLogoutTrue}
                            titulo="Existem notificações não lidas"
                            texto="<p>Deseja ver as notificações ou sair do sistema</p>"
                        />
                    </section>
                </>

            }

        </>
    );
};

