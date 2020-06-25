import React, {useEffect, useState} from "react";
import {MenuInterno} from "../../MenuInterno";
import {TabelaMembros} from "../TabelaMembros";
import {EditarMembro} from "../../../utils/Modais";
import {getMembrosAssociacao} from "../../../services/Associacao.service";

export const MembrosDaAssociacao = () =>{

    const caminhos_menu_interno = [
        {label: "Dados da Associação", url:"dados-da-associacao"},
        {label: "Membros", url:"membros-da-associacao"},
        {label: "Dados das contas", url:"lista-de-receitas"},
    ];


    const cargos_diretoria_executiva = [
        {id:"PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Presidente", nome:""},
        {id:"VICE_PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Vice Presidente", nome:""},
        {id:"SECRETARIO", cargo:"Secretário", nome:""},
        {id:"VOGAL_1", cargo:"Tesoureiro", nome:""},
        {id:"VOGAL_2", cargo:"Vogal", nome:""},
        {id:"VOGAL_3", cargo:"Vogal", nome:""},
        {id:"VOGAL_4", cargo:"Vogal", nome:""},
        {id:"VOGAL_5", cargo:"Vogal", nome:""},
    ];

    const [clickIconeToogle, setClickIconeToogle] = useState({});
    const [showEditarMembro, setShowEditarMembro] = useState(false);
    const [membros, setMembros] = useState({});
    const [initialValuesMembros, setInitialValuesMembros] = useState({});
    const [stateFormEditarMembro, setStateFormEditarMembro] = useState({
        uuid:"",
        nome_completo:"",
        cargo_associacao:"",
        cargo_educacao:"",
        representacao_associacao:"",
        codigo_identificacao:"",
    });

    useEffect(()=>{
        const carregaMembros = async ()=>{
            let membros = await getMembrosAssociacao();
            console.log("getMembros ", membros)
            setMembros(membros)
        };
        carregaMembros();
    }, []);

    useEffect(()=>{
        mesclaMembros();
    }, [membros])


    const buscaDadosMembros = (id_cargo) =>{
        //despesasTabelas.tipos_transacao.find(element => element.id === Number(values.tipo_transacao))
        let info = membros.find(element => element.cargo_associacao === id_cargo);
        //return nome.nome

        return info

    }

    const mesclaMembros = async ()=>{

        let cargos_diretoria_executiva = []
        if(membros && membros.length > 0){
            console.log("Info ", buscaDadosMembros('PRESIDENTE_DIRETORIA_EXECUTIVA').nome)

            cargos_diretoria_executiva = [
                {id:"PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Presidente", infos: buscaDadosMembros('PRESIDENTE_DIRETORIA_EXECUTIVA'),  nome:buscaDadosMembros('PRESIDENTE_DIRETORIA_EXECUTIVA').nome},
                {id:"VICE_PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Vice Presidente", nome:""},
                {id:"SECRETARIO", cargo:"Secretário", nome:""},
                {id:"VOGAL_1", cargo:"Tesoureiro", nome:""},
                {id:"VOGAL_2", cargo:"Vogal", nome:""},
                {id:"VOGAL_3", cargo:"Vogal", nome:""},
                {id:"VOGAL_4", cargo:"Vogal", nome:""},
                {id:"VOGAL_5", cargo:"Vogal", nome:""},
            ];

        }else{
            cargos_diretoria_executiva = [
                {id:"PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Presidente", nome: ""},
                {id:"VICE_PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Vice Presidente", nome:""},
                {id:"SECRETARIO", cargo:"Secretário", nome:""},
                {id:"VOGAL_1", cargo:"Tesoureiro", nome:""},
                {id:"VOGAL_2", cargo:"Vogal", nome:""},
                {id:"VOGAL_3", cargo:"Vogal", nome:""},
                {id:"VOGAL_4", cargo:"Vogal", nome:""},
                {id:"VOGAL_5", cargo:"Vogal", nome:""},
            ];
        }

        setInitialValuesMembros(cargos_diretoria_executiva);

    }




    /*const cargos_diretoria_executiva = [
        {cargo:"Presidente", nome:"Presidente da Diretoria Executiva"},
        {cargo:"Vice Presidente", nome:"Vice Presidente da Diretoria Executiva"},
        {cargo:"Secretário", nome:"Secretário da Diretoria Executiva"},
        {cargo:"Tesoureiro", nome:"Tesoureiro da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
        {cargo:"Vogal", nome:"Vogal da Diretoria Executiva"},
    ];*/

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
                        cargos={initialValuesMembros}
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