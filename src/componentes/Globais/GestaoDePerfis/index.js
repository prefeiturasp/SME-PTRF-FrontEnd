import React, {useState} from "react";
import "./gestao-de-perfis.scss"
import {AccordionInfo} from "./AccordionInfo";
import {FormFiltros} from "./FormFiltros";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {ModalPerfisForm} from "./ModalPerfisForm";

export const GestaoDePerfis = () => {

    const initialStateFiltros = {
        filtrar_por_nome: "",
        filtrar_por_grupo: "",
    };

    const initPerfisForm = {
        uuid: "",
        tipo_usuario: "",
        nome_usuario: "",
        nome_completo: "",
        email: "",
        grupo_acesso: [],
    };

    const objetoTabelaDinamica = [
        {uuid: '123', email:'email@email.com', tipo_usuario: 'servidor', nome_completo: 'Camila Coelho', nome_usuario: 'camila_coelho', grupo_acesso: 'Usuário membro', },
        {uuid: '123', email:'email@email.com', tipo_usuario: 'servidor', nome_completo: 'Marcelo Dantas de Noronha', nome_usuario: 'camila_coelho', grupo_acesso: 'Usuário membro', },
        {uuid: '123', email:'email@email.com', tipo_usuario: 'servidor', nome_completo: 'Fernanda Lemi Messina de Castro', nome_usuario: 'camila_coelho', grupo_acesso: 'Usuário membro', },
        {uuid: '123', email:'email@email.com', tipo_usuario: 'servidor', nome_completo: 'Caio Cesar Silva Nascimento', nome_usuario: 'camila_coelho', grupo_acesso: 'Usuário membro', },
        {uuid: '123', email:'email@email.com', tipo_usuario: 'servidor', nome_completo: 'Bruna Vecci Mascaranhas', nome_usuario: 'camila_coelho', grupo_acesso: 'Usuário membro', },
    ];

    const [clickBtnInfo, setClickBtnInfo] = useState(false);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [statePerfisForm, setStatePerfisForm] = useState(initPerfisForm);
    const [showPerfisForm, setShowPerfisForm] = useState(false);

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const limpaFiltros = async () => {
        await setStateFiltros(initialStateFiltros);
    };

    const handleSubmitFiltros = async (event) => {
        event.preventDefault();
        console.log("handleSubmitFiltros ", stateFiltros)
    };

    const acoesTemplate = (rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditarPerfisForm(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    };


    const handleEditarPerfisForm = (rowData) =>{
        console.log("Cliquei handleEditarPerfisForm ", rowData)
        const initFormPerfis = {
            uuid: rowData.uuid,
            tipo_usuario: rowData.tipo_usuario,
            nome_usuario: rowData.nome_usuario,
            nome_completo: rowData.nome_completo,
            email: rowData.email,
            grupo_acesso: rowData.grupo_acesso,
        };

        setStatePerfisForm(initFormPerfis)
        setShowPerfisForm(true)

    };

    const handleChangesPerfisForm = (name, value) => {
        setStatePerfisForm({
            ...statePerfisForm,
            [name]: value
        });
    };

    const handleSubmitPerfisForm = (values)=>{
        console.log('handleSubmitPerfisForm ', values)
    };

    const handleClose = () => {
        setShowPerfisForm(false);
    };

    return (
        <>
            <p>Faça a gestão dos seus usuários e determine seus perfis atrelando-os aos grupos de acesso.</p>
            <AccordionInfo
                clickBtnInfo={clickBtnInfo}
                setClickBtnInfo={setClickBtnInfo}
            />
            <FormFiltros
                handleChangeFiltros={handleChangeFiltros}
                limpaFiltros={limpaFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                stateFiltros={stateFiltros}
            />

            <div className="d-flex bd-highlight mt-4">
                <div className="flex-grow-1 bd-highlight mb-3"><h4>Lista de perfis com acesso  </h4></div>
                <div className="p-2 bd-highlight">
                    <a className="link-green float-right" onClick={()=>setShowPerfisForm(true)}>
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "0"}}
                            icon={faPlus}
                        />
                        <strong> adicionar</strong>
                    </a>
                </div>
            </div>
            <div>
                <div className="card">
                    <DataTable value={objetoTabelaDinamica} className='tabela-lista-perfis'>
                        <Column field="nome_completo" header="Nome completo"/>
                        <Column field="nome_usuario" header="Nome de usuário"/>
                        <Column field="grupo_acesso" header="Grupo de acesso"/>
                        <Column
                            field="uuid"
                            header="Editar"
                            body={acoesTemplate}
                            className='coluna-editar'
                        />
                    </DataTable>
                </div>
            </div>

            <section>
                <ModalPerfisForm
                    show={showPerfisForm}
                    handleClose={handleClose}
                    onSubmit={handleSubmitPerfisForm}
                    handleChange={handleChangesPerfisForm}
                    initialValues={statePerfisForm}
                    setStatePerfisForm={setStatePerfisForm}
                    primeiroBotaoTexto="Cancelar"
                    primeiroBotaoCss="outline-success"
                    segundoBotaoCss="success"
                    segundoBotaoTexto="Confirmar"
                />
            </section>

        </>
    );
};