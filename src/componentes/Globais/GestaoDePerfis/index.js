import React, {useCallback, useEffect, useState} from "react";
import "./gestao-de-perfis.scss"
import {AccordionInfo} from "./AccordionInfo";
import {FormFiltros} from "./FormFiltros";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {getGrupos, getUsuarios, getUsuariosFiltros} from "../../../services/GestaoDePerfis.service";
import {visoesService} from "../../../services/visoes.service";
import {Link} from "react-router-dom";

export const GestaoDePerfis = () => {

    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');

    const initialStateFiltros = {
        filtrar_por_nome: "",
        filtrar_por_grupo: "",
        filtrar_tipo_de_usuario: "",
        filtrar_por_nome_unidade: "",
    };

    const [clickBtnInfo, setClickBtnInfo] = useState(false);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [usuarios, setUsuarios] = useState({});
    const [grupos, setGrupos] = useState([]);

    const exibeGrupos = useCallback(async ()=>{
        let grupos = await getGrupos(visao_selecionada);
        setGrupos(grupos);
    }, [visao_selecionada]);

    const exibeUsuarios = useCallback(async () =>{
        let _usuarios = await getUsuarios(visao_selecionada);
        setUsuarios(_usuarios);
    }, [visao_selecionada]);

    useEffect(()=>{
        exibeGrupos();
        exibeUsuarios();
    }, [exibeGrupos, exibeUsuarios]);

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const limpaFiltros = async () => {
        await setStateFiltros(initialStateFiltros);
        await exibeUsuarios();
    };

    const handleSubmitFiltros = async (event) => {
        event.preventDefault();
        let retorno_filtros = await getUsuariosFiltros(visao_selecionada, stateFiltros.filtrar_por_nome, stateFiltros.filtrar_por_grupo, stateFiltros.filtrar_tipo_de_usuario, stateFiltros.filtrar_por_nome_unidade);
        setUsuarios(retorno_filtros)
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

    const unidadesTemplate = (rowData) =>{
        if (rowData['unidades'] && rowData['unidades'].length > 0){
            return(
                rowData['unidades'].map((unidade, index)=>(
                    <p key={index} className='mb-0'>{unidade.tipo_unidade} {unidade.nome} </p>
                ))
            )
        }
    };

    const tipoUsuarioTemplate = (rowData) =>{
        return rowData['e_servidor'] ? "Servidor" : "Não Servidor"
    };

    const acoesTemplate = (rowData) =>{
        return (
            <Link
                className="link-green text-center"
                to={{
                    pathname: `/gestao-de-perfis-form/${rowData.id}`,
                }}
            >
                <FontAwesomeIcon
                    style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                    icon={faEdit}
                />
            </Link>
        )
    };

    return (
        <>
            <p>Faça a gestão dos seus usuários e determine seus perfis atrelando-os aos grupos de acesso.</p>
            <AccordionInfo
                clickBtnInfo={clickBtnInfo}
                setClickBtnInfo={setClickBtnInfo}
                grupos={grupos}
            />
            <FormFiltros
                handleChangeFiltros={handleChangeFiltros}
                limpaFiltros={limpaFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                stateFiltros={stateFiltros}
                grupos={grupos}
                visao_selecionada={visao_selecionada}
            />
            <div className="d-flex bd-highlight mt-4">
                <div className="flex-grow-1 bd-highlight mb-3"><h4>Lista de perfis com acesso</h4></div>
                <div className="p-2 bd-highlight">
                    <Link
                        className="link-green float-right"
                        to={{
                            pathname: "/gestao-de-perfis-form/",
                        }}
                    >
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "0"}}
                            icon={faPlus}
                        />
                        <strong> adicionar</strong>
                    </Link>
                </div>
            </div>
            {usuarios && Object.entries(usuarios).length > 0 &&
                <div className="card">
                    <DataTable value={usuarios} className='tabela-lista-perfis'>
                        <Column field="name" header="Nome completo"/>
                        <Column field="username" header="Id. de usuário"/>
                        {(visao_selecionada === "DRE" || visao_selecionada === "SME") &&
                            <Column
                                field="unidades"
                                header="Unid. correspondente"
                                body={unidadesTemplate}
                            />
                        }
                        <Column
                            field="e_servidor"
                            header="Tipo de usuário"
                            body={tipoUsuarioTemplate}
                        />
                        <Column
                            field="groups"
                            header="Grupo de acesso"
                            body={grupoTemplate}
                        />
                        <Column
                            field="id"
                            header="Editar"
                            body={acoesTemplate}
                            className='coluna-editar'
                        />
                    </DataTable>
                </div>
            }
        </>
    );
};