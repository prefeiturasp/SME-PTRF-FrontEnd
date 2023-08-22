import React, {Fragment, useContext, useState} from "react";

import Loading from "../../../../utils/Loading";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {GestaoDeUsuariosListContext} from "../context/GestaoDeUsuariosListProvider";
import {TableTags} from "../../TableTags";
import Img404 from "../../../../assets/img/img-404.svg";
import {MsgImgCentralizada} from "../../Mensagens/MsgImgCentralizada";
import ReactTooltip from "react-tooltip";
import {useAcessoEmSuporteInfo} from "../../../../hooks/Globais/useAcessoEmSuporteInfo";
import {removerAcessosUnidadeBase} from "../../../../services/GestaoDeUsuarios.service";
import {ModalConfirmacao} from "./ModalConfirmacao";

const corTagSuporte = {
          1: 'tag-blue-support',
        }

const dataVisaoSuporteTag = {
            informacoes: [{
                tag_id: 1,
                tag_nome: "Visão de suporte",
                tag_hint: "Usuário com acesso de suporte"
            }]
        }

export const ListaUsuarios = ({usuarios, isLoading}) => {
    const {uuidUnidadeBase, visaoBase} = useContext(GestaoDeUsuariosListContext);
    const [expandedRows, setExpandedRows] = useState(null);
    const {unidadeEstaEmSuporte} = useAcessoEmSuporteInfo()

    const [showModalConfirmaRemoverAcesso, setShowModalConfirmaRemoverAcesso] = useState(false)
    const [userIdParaRemoverAcesso, setUserIdParaRemoverAcesso] = useState(null)

    const nomeUsuarioTemplate = (rowData) => {

        const unidadeLogada = rowData["unidades"].find(obj => {
                return obj.uuid === uuidUnidadeBase
            })
        return (
            <div>
                {rowData["name"]}
                {unidadeLogada?.acesso_de_suporte &&
                <div style={{marginLeft: -10, width:'30%'}}>
                    <TableTags data={dataVisaoSuporteTag} coresTags={corTagSuporte}/>
                </div>
                }
            </div>
        )
    }
    const tipoUsuarioTemplate = (rowData) =>{
        return rowData['e_servidor'] ? "Servidor" : "Não Servidor"
    };
    const grupoTemplate = (rowData) =>{
        if (rowData['groups'] && rowData['groups'].length > 0){
            return(
                rowData['groups'].map((grupo, index)=>(
                    <p key={index} className='mb-0'>{grupo.name} </p>
                ))
            )
        }
    };
    const acoesTemplate = (rowData) =>{
        return (
            <div>
                <span data-tip="Remover acesso" data-html={true}>
                    <button
                        onClick={() => {
                            setUserIdParaRemoverAcesso(rowData.id)
                            setShowModalConfirmaRemoverAcesso(true)
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        className="botao-acao-lista"
                    >
                        <FontAwesomeIcon
                            style={{ fontSize: '20px', marginRight: "0", color: "#B40C02" }}
                            icon={faTimesCircle}
                        />
                    </button>
                    <ReactTooltip/>
                </span>


                { ! unidadeEstaEmSuporte &&
                <span data-tip="Editar usuário" data-html={true}>
                    <Link
                        className="botao-acao-lista"
                        to={{
                            pathname: `/gestao-de-usuarios-form/${rowData.id}`,
                        }}
                    >
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                            icon={faEdit}
                        />
                    </Link>
                    <ReactTooltip/>
                </span>
                }

            </div>

        )
    };
    const rowExpansionTemplate = (data) => {
        const unidadesComAcesso = data?.unidades.filter(unidade => unidade.acesso_de_suporte === false)
        const temUnidadesComAcesso = unidadesComAcesso?.length > 0

        const unidadesComAcessoSuporte = data?.unidades.filter(unidade => unidade.acesso_de_suporte === true)
        const temUnidadesComAcessoSuporte = unidadesComAcessoSuporte?.length > 0

        return (
            <>
                <div className="pb-2">
                    <div className="row pl-3 pr-3">
                        <div className="col-6 p-2">
                            <p className='mb-0 font-weight-bold'>E-mail</p>
                            {data.email}
                        </div>
                        <div className="col-6 p-2">
                            <p className='mb-0 font-weight-bold'>ID do usuário</p>
                            {data.username}
                        </div>
                    </div>
                </div>

                {(visaoBase === 'DRE' || visaoBase === 'SME') && (temUnidadesComAcesso || temUnidadesComAcessoSuporte) &&
                <hr style={{margin: 0, padding: 0}}/>
                }

                {(visaoBase === 'DRE' || visaoBase === 'SME') && temUnidadesComAcesso &&
                <div className="pb-2">
                    <div className="row pl-3 pr-3">
                        <div className="col p-2">
                            <p className='mb-0 font-weight-bold'>Unidades com acesso</p>
                        </div>
                    </div>
                    <div className="row pl-3 pr-3">
                        {unidadesComAcesso
                            .map((unidade, index) => (
                        <div key={index} className="col-6 px-2">
                            <span>{unidade.nome}</span>
                        </div>))}
                    </div>
                </div>}

                {(visaoBase === 'DRE' || visaoBase === 'SME') && temUnidadesComAcessoSuporte &&
                <div className="pb-2">
                    <div className="row pl-3 pr-3">
                        <div className="col p-2">
                            <p className='mb-0 font-weight-bold'>Em suporte</p>
                        </div>
                    </div>
                    <div className="row pl-3 pr-3">
                        {unidadesComAcessoSuporte
                            .map((unidade, index) => (
                                <Fragment key={index} >
                                    <div className="col-6 px-2">
                                        <span>{unidade.nome}</span>
                                    </div>
                                    <div className="col-6" style={{marginLeft: -10, width:'30%'}}>
                                        <TableTags data={dataVisaoSuporteTag} coresTags={corTagSuporte}/>
                                    </div>
                                </Fragment>
                            ))}

                    </div>
                </div>}

            </>
        )
    };

    const handleCloseModalConfirmaRemoverAcesso = () => {
        setShowModalConfirmaRemoverAcesso(false);
    };

    const handleConfirmaRemoverAcesso = () => {
        setShowModalConfirmaRemoverAcesso(false)
        if (userIdParaRemoverAcesso){
            removerAcessosUnidadeBase(userIdParaRemoverAcesso, uuidUnidadeBase);
        }
    };

    return (
        <>
            {isLoading &&
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            }

            {!isLoading && usuarios && Object.entries(usuarios).length === 0 &&
                <MsgImgCentralizada
                    texto='Não há usuários que atendam aos filtros especificados.'
                    img={Img404}
                />
            }

            {!isLoading && usuarios && Object.entries(usuarios).length > 0 &&
                <div className="card">
                    <DataTable
                        value={usuarios}
                        className='tabela-lista-usuarios'
                        expandedRows={expandedRows}
                        rowExpansionTemplate={rowExpansionTemplate}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                    >

                        <Column expander style={{width: '3em', borderRight: 'none'}}/>

                        <Column
                            field="name"
                            header="Nome"
                            body={nomeUsuarioTemplate}
                            style={{width: '45%'}}
                        />

                        <Column
                            field="e_servidor"
                            header="Tipo de usuário"
                            body={tipoUsuarioTemplate}
                            style={{width: '20%'}}
                        />
                        <Column
                            field="groups"
                            header="Grupo de acesso"
                            body={grupoTemplate}
                            style={{width: '20%'}}
                        />
                        <Column
                            field="id"
                            header="Ação"
                            body={acoesTemplate}
                            className='coluna-acao'
                            style={{width: '15%', textAlign: 'center'}}
                        />
                    </DataTable>
                </div>
            }
            <section>
                <ModalConfirmacao
                    show={showModalConfirmaRemoverAcesso}
                    titulo="Remover acesso"
                    texto="<p>Tem certeza que deseja remover o acesso deste usuário nessa unidade?</p>"
                    botaoCancelarTexto="Cancelar"
                    botaoCancelarHandle={() => handleCloseModalConfirmaRemoverAcesso()}
                    botaoConfirmarTexto="Remover acesso"
                    botaoConfirmarHandle={() => handleConfirmaRemoverAcesso()}
                />
            </section>
        </>
    )
}