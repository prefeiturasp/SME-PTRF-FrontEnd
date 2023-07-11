import React, {useContext} from "react";

import Loading from "../../../utils/Loading";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faKey, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {GestaoDeUsuariosContext} from "./context/GestaoDeUsuariosProvider";
import {TableTags} from "../TableTags";


export const ListaUsuarios = ({usuarios}) => {
    const {uuidUnidadeBase} = useContext(GestaoDeUsuariosContext);

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