import React, {useEffect, useState} from "react";
import "./gestao-de-perfis.scss"
import {AccordionInfo} from "./AccordionInfo";
import {FormFiltros} from "./FormFiltros";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {ModalConfirmDeletePerfil} from "./ModalConfirmDeletePerfil";
import {getGrupos, getUsuarios, deleteUsuario, getUsuariosFiltros} from "../../../services/GestaoDePerfis.service";
import {visoesService} from "../../../services/visoes.service";
import {Link} from "react-router-dom";

export const GestaoDePerfis = () => {

    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');

    const initialStateFiltros = {
        filtrar_por_nome: "",
        filtrar_por_grupo: "",
    };

    const initPerfisForm = {
        id: "",
        tipo_usuario: "",
        nome_usuario: "",
        nome_completo: "",
        email: "",
        grupo_acesso: [],
    };

    const [clickBtnInfo, setClickBtnInfo] = useState(false);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [statePerfisForm, setStatePerfisForm] = useState(initPerfisForm);
    const [showPerfisForm, setShowPerfisForm] = useState(false);
    const [showModalDeletePerfil, setShowModalDeletePerfil] = useState(false);
    const [usuarios, setUsuarios] = useState({});
    const [grupos, setGrupos] = useState([]);

    useEffect(()=>{
        exibeGrupos();
        exibeUsuarios();
    }, []);

    const exibeGrupos = async ()=>{
        let grupos = await getGrupos(visao_selecionada);
        setGrupos(grupos);
    };

    const exibeUsuarios = async () =>{
        let _usuarios = await getUsuarios(visao_selecionada);
        setUsuarios(_usuarios);

        console.log("EXIBE USUARIOS ", _usuarios)
    };

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
        let retorno_filtros = await getUsuariosFiltros(visao_selecionada, stateFiltros.filtrar_por_nome, stateFiltros.filtrar_por_grupo);
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

    const acoesTemplate = (rowData) =>{
        return (
            <div>
                <Link
                    className="link-green float-right"
                    to={{
                        pathname: `/gestao-de-perfis-form/${rowData.id}`,
                        // pathname: "/gestao-de-perfis-form/id_usuario=",
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

    const onDeletePerfilTrue = async () =>{
        setShowPerfisForm(false);
        setShowModalDeletePerfil(false);
        try {
            await deleteUsuario(statePerfisForm.id);
            console.log('Usuário deletado com sucesso');
        }catch (e) {
            console.log('Erro ao deletar usuário ', e);
        }
        await exibeUsuarios()
    };

    const handleCloseDeletePerfil = () => {
        setShowModalDeletePerfil(false);
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
            />

            <div className="d-flex bd-highlight mt-4">
                <div className="flex-grow-1 bd-highlight mb-3"><h4>Lista de perfis com acesso  </h4></div>
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
                        <Column field="username" header="Nome de usuário"/>
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
            <section>
                <ModalConfirmDeletePerfil
                    show={showModalDeletePerfil}
                    handleClose={handleCloseDeletePerfil}
                    onDeletePerfilTrue={onDeletePerfilTrue}
                    titulo="Excluir Perfil"
                    texto="<p>Deseja realmente excluir este perfil?</p>"
                    primeiroBotaoTexto="Cancelar"
                    primeiroBotaoCss="outline-success"
                    segundoBotaoCss="danger"
                    segundoBotaoTexto="Excluir"
                />
            </section>
        </>
    );
};