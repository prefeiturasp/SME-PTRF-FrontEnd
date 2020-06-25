import React, {useState} from "react";
import {MenuInterno} from "../../MenuInterno";
import {TabelaMembrosDiretoriaExecutiva} from "../TabelaMembrosDiretoriaExecutiva";
import {TabelaMembrosConselhoFiscal} from "../TabelaMembrosConselhoFiscal";
import {TabelaMembros} from "../TabelaMembros";

import {EditarMembro} from "../../../utils/Modais";

export const MembrosDaAssociacao = () =>{

    const [clickIconeToogle, setClickIconeToogle] = useState({});
    const [showEditarMembro, setShowEditarMembro] = useState(false);
    const [stateFormEditarMembro, setStateFormEditarMembro] = useState({
        cargo_associacao:"",
        representacao_associacao:"",
        rf:"",
        nome_completo:"",
        cargo_educacao:"",
    });

    const caminhos_menu_interno = [
        {label: "Dados da Associação", url:"dados-da-associacao"},
        {label: "Membros", url:"membros-da-associacao"},
        {label: "Dados das contas", url:"lista-de-receitas"},
    ];

    const cargos_diretoria_executiva = [
        {cargo:"Presidente", nome:"Presidente da Diretoria Executiva"},
        {cargo:"Vice Presidente", nome:"Vice Presidente da Diretoria Executiva"},
        {cargo:"Secretário", nome:"Secretário da Diretoria Executiva"},
        {cargo:"Tesoureiro", nome:"Tesoureiro da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
    ];

    const toggleIcon = (id) => {
        setClickIconeToogle({
            ...clickIconeToogle,
            [id]: !clickIconeToogle[id]
        });
    };

    const onHandleClose = () => {
        setShowEditarMembro(false);
    };

    const handleChangeEditarMembro = (name, value) => {
        setStateFormEditarMembro({
            ...stateFormEditarMembro,
            [name]: value
        });
    };

    const onSubmitEditarMembro = () =>{
        setShowEditarMembro(false);
        console.log("onSubmitEditarMembro ", stateFormEditarMembro)
    };

    return(
        <div className="row">
            <div className="col-12">
                <>
                    <MenuInterno
                        caminhos_menu_interno={caminhos_menu_interno}
                    />
                    <TabelaMembros
                        clickIconeToogle={clickIconeToogle}
                        toggleIcon={toggleIcon}
                        setShowEditarMembro={setShowEditarMembro}
                        cargos={cargos_diretoria_executiva}
                        titulo="Diretoria Executiva"
                    />

                    <hr/>

                </>
            </div>

            <section>
                <EditarMembro
                    show={showEditarMembro}
                    handleClose={onHandleClose}
                    onSubmitEditarMembro={onSubmitEditarMembro}
                    handleChangeEditarMembro={handleChangeEditarMembro}
                    stateFormEditarMembro={stateFormEditarMembro}
                    //tabelas={tabelas}
                />
            </section>

        </div>
    );
};