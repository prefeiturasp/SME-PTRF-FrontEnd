import React, {useContext, useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Img404 from "../../../../assets/img/img-404.svg";
import { MsgImgCentralizada } from "../../Mensagens/MsgImgCentralizada";
import { GestaoDeUsuariosAdicionarUnidadeContext } from "../context/GestaoUsuariosAdicionarUnidadeProvider";
import { useUnidadesDisponiveisInclusao } from "../hooks/useUnidadesDisponiveisInclusao";
import { useIncluirUnidade } from "../hooks/useIncluirUnidade";
import { useUsuario } from "../../GestaoDeUsuariosForm/hooks/useUsuario";
import Loading from "../../../../utils/Loading";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import { TableTags } from "../../TableTags";
import { coresTagsAssociacoes } from "../../../../utils/CoresTags";
import { LegendaInformacao } from "../../ModalLegendaInformacao/LegendaInformacao";
import { Paginacao } from "./Paginacao";


export const ListaDeUnidades = () => {
    const { search, setSearch, submitFiltro, setSubmitFiltro, showModalLegendaInformacao, setShowModalLegendaInformacao, currentPage } = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
    const { id_usuario } = useParams();
    
    const { data: usuario } = useUsuario(id_usuario);
    const { isLoading, data, isFetching } = useUnidadesDisponiveisInclusao(usuario);

    const { mutationIncluirUnidade } = useIncluirUnidade();

    const unidadeEscolarTemplate = (rowData) => {
        return (
            <div>
                {rowData['nome_com_tipo'] ? <strong>{rowData['nome_com_tipo']}</strong> : ''}
            </div>
        )
    };

    const acoesTemplate = (rowData) =>{
        return (
                <>

                    <button
                        onClick={()=>handleAcaoEscolher(rowData)}
                        className="btn btn-link link-green"
                    >
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "0"}}
                            icon={faKey}
                        />
                        <span> Habilitar acesso </span>

                    </button>

                </>
        )
    };

    const handleAcaoEscolher = (rowData) => {
        let payload = {
            username: usuario.username,
            uuid_unidade: rowData.uuid
        }

        mutationIncluirUnidade.mutate({payload: payload});
    };

    const retornaMensagem = () => {
        if(submitFiltro === false && isLoading){
            return 'Use parte do nome ou código EOL para localizar a unidade para qual você deseja viabilizar o acesso.'
        }else if(data.count === 0){
            return 'Não encontramos resultados, verifique o filtro e tente novamente.'
        }
    }

    if(isFetching){
        return(
            <Loading 
                corGrafico="black" 
                corFonte="dark" 
                marginTop="0" 
                marginBottom="0"
            />
        )
    }

    if(isFetching === false && data.count > 0){
        return(
            <>
                <LegendaInformacao
                    showModalLegendaInformacao={showModalLegendaInformacao}
                    setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                    entidadeDasTags="associacao"
                    excludedTags={["Encerramento de conta pendente"]}
                />

                <DataTable
                    value={data.results}
                    className="mt-3"
                    autoLayout={true}
                >
                    <Column
                        field="codigo_eol"
                        header="Código Eol"
                        className="text-center"
                        style={{width: '15%'}}
                    />
                    <Column
                        field="nome_com_tipo"
                        header="Unidade educacional"
                        body={unidadeEscolarTemplate}
                    />
                    <Column
                        field="informacao"
                        header="Informações"
                        className="align-middle text-center"
                        body={(rowData) => <TableTags data={rowData} coresTags={coresTagsAssociacoes} excludeTags={["Encerramento de conta pendente"]}/>}
                        style={{width: '15%'}}
                    />
                    <Column
                        field="uuid"
                        header="Ação"
                        body={acoesTemplate}
                        className="text-center"
                        style={{width: '20%'}}
                    />
                </DataTable>

                <Paginacao
                    count={data.count}
                />
            </>
        )
    }

    return(
        <MsgImgCentralizada
            texto={retornaMensagem()}
            img={Img404}
        />
    )
}