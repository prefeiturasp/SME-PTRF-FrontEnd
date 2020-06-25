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
    const init = [
        {id:"PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Presidente"},
        {id:"VICE_PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Vice Presidente"},
        {id:"SECRETARIO", cargo:"Secretário"},
        {id:"TESOUREIRO", cargo:"Tesoureiro"},
        {id:"VOGAL_1", cargo:"Vogal"},
        {id:"VOGAL_2", cargo:"Vogal"},
        {id:"VOGAL_3", cargo:"Vogal"},
        {id:"VOGAL_4", cargo:"Vogal"},
        {id:"VOGAL_5", cargo:"Vogal"},
    ];

    const [clickIconeToogle, setClickIconeToogle] = useState({});
    const [showEditarMembro, setShowEditarMembro] = useState(false);
    const [membros, setMembros] = useState({});
    const [initialValuesMembros, setInitialValuesMembros] = useState(init);
    const [stateFormEditarMembro, setStateFormEditarMembro] = useState({
        uuid:"",
        nome_completo:"",
        cargo_associacao:"",
        cargo_educacao:"",
        representacao:"",
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
        let info = membros.find(element => element.cargo_associacao === id_cargo);
        return info
    };

    const mesclaMembros = async ()=>{
        let cargos_diretoria_executiva = []
        if(membros && membros.length > 0){
            cargos_diretoria_executiva = [
                {id:"PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Presidente", infos: buscaDadosMembros('PRESIDENTE_DIRETORIA_EXECUTIVA')},
                {id:"VICE_PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Vice Presidente", infos: buscaDadosMembros('VICE_PRESIDENTE_DIRETORIA_EXECUTIVA')},
                {id:"SECRETARIO", cargo:"Secretário", infos: buscaDadosMembros('SECRETARIO')},
                {id:"TESOUREIRO", cargo:"Tesoureiro", infos: buscaDadosMembros('TESOUREIRO')},
                {id:"VOGAL_1", cargo:"Vogal", infos: buscaDadosMembros('VOGAL_1')},
                {id:"VOGAL_2", cargo:"Vogal", infos: buscaDadosMembros('VOGAL_2')},
                {id:"VOGAL_3", cargo:"Vogal", infos: buscaDadosMembros('VOGAL_3')},
                {id:"VOGAL_4", cargo:"Vogal", infos: buscaDadosMembros('VOGAL_4')},
                {id:"VOGAL_5", cargo:"Vogal", infos: buscaDadosMembros('VOGAL_5')},
            ];
        }
        setInitialValuesMembros(cargos_diretoria_executiva);
    };

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