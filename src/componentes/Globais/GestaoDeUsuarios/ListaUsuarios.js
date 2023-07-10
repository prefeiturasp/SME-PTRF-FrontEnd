import React from "react";

import Loading from "../../../utils/Loading";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faKey, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import {Link} from "react-router-dom";


export const ListaUsuarios = ({usuarios}) => {
    const loading = false;

    const nomeUsuarioComIconeDeAcessoSuporteTemplate = (rowData) => {
        const unidade_selecionada = null
        const unidadeLogada = rowData["unidades"].find(obj => {
                return obj.uuid === unidade_selecionada
            })
        return (
            <div>
                {unidadeLogada?.acesso_de_suporte &&
                <>
                    <span data-html={true} data-tip='Acesso de suporte'>
                        <FontAwesomeIcon
                            style={{marginLeft: "3px", marginRight: "3px", color: '#086397'}}
                            icon={faKey}
                        />
                    </span>
                    <ReactTooltip html={true}/>
                </>
                }
                {rowData["name"]}
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
                <Link
                    style={{pointerEvents: 'none'}}  //TODO: remover quando estiver pronto
                    className="botao-acao-lista"
                    to={{
                        pathname: `/gestao-de-usuarios-form/${rowData.id}`,
                    }}
                >
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#B40C02"}}
                        icon={faTimesCircle}
                    />
                </Link>
                <Link
                    style={{pointerEvents: 'none'}}  //TODO: remover quando estiver pronto
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
            </div>

        )
    };

    return (
        <>
            {loading ? (
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            ) :
                usuarios && Object.entries(usuarios).length > 0 &&
                <div className="card">
                    <DataTable value={usuarios} className='tabela-lista-usuarios'>

                        <Column
                            field="name"
                            header="Nome completo"
                            body={nomeUsuarioComIconeDeAcessoSuporteTemplate}
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
                            header="Editar"
                            body={acoesTemplate}
                            className='coluna-editar'
                            style={{width: '15%'}}
                        />
                    </DataTable>
                </div>
            }
        </>
    )
}