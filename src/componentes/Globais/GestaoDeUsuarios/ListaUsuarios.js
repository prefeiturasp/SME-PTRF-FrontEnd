import React, {useContext, useState} from "react";

import Loading from "../../../utils/Loading";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faKey, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {GestaoDeUsuariosContext} from "./context/GestaoDeUsuariosProvider";
import {TableTags} from "../TableTags";


export const ListaUsuarios = ({usuarios}) => {
    const {uuidUnidadeBase, visaoBase} = useContext(GestaoDeUsuariosContext);
    const [expandedRows, setExpandedRows] = useState(null);

    const loading = false;

    const nomeUsuarioTemplate = (rowData) => {
        const corTagSuporte = {
          1: 'tag-blue-support',
        }

        const dataTag = {
            informacoes: [{
                tag_id: 1,
                tag_nome: "Visão de suporte",
                tag_hint: "Usuário com acesso de suporte"
            }]
        }
        const unidadeLogada = rowData["unidades"].find(obj => {
                return obj.uuid === uuidUnidadeBase
            })
        return (
            <div>
                {rowData["name"]}
                {unidadeLogada?.acesso_de_suporte &&
                <div style={{marginLeft: -10, width:'50%'}}>
                    <TableTags data={dataTag} coresTags={corTagSuporte}/>
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
    const rowExpansionTemplate = (data) => {
        console.log(data)
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

                {(visaoBase === 'DRE' || visaoBase === 'SME') && data?.unidades.length > 0 &&
                <div className="pb-2">
                    <div className="row pl-3 pr-3">
                        <div className="col p-2">
                            <p className='mb-0 font-weight-bold'>Unidades com acesso</p>
                        </div>
                    </div>
                    <div className="row pl-3 pr-3">
                        {data.unidades
                            .filter(unidade => unidade.acesso_de_suporte === false)
                            .map((unidade, index) => (
                        <div className="col-6 px-2">
                            <span key={index}>{unidade.nome}</span>
                        </div>))}
                    </div>
                </div>}

            </>
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
        </>
    )
}