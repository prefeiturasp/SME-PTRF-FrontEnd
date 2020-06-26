import React, {useEffect, useState} from "react";
import {MenuInterno} from "../../MenuInterno";
import {TabelaMembros} from "../TabelaMembros";
import {EditarMembro} from "../../../utils/Modais";
import {getMembrosAssociacao, criarMembroAssociacao, editarMembroAssociacao, consultarRF, consultarCodEol} from "../../../services/Associacao.service";
import {ASSOCIACAO_UUID} from '../../../services/auth.service';

export const MembrosDaAssociacao = () =>{

    const caminhos_menu_interno = [
        {label: "Dados da Associação", url:"dados-da-associacao"},
        {label: "Membros", url:"membros-da-associacao"},
        {label: "Dados das contas", url:"lista-de-receitas"},
    ];
    const initDiretoria = [
        {id:"PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Presidente", cargo_exibe_form: "Presidente da Diretoria Executiva"},
        {id:"VICE_PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Vice Presidente", cargo_exibe_form: "Vice Presidente da Diretoria Executiva"},
        {id:"SECRETARIO", cargo:"Secretário", cargo_exibe_form: "Secretário da Diretoria Executiva"},
        {id:"TESOUREIRO", cargo:"Tesoureiro", cargo_exibe_form: "Tesoureiro da Diretoria Executiva"},
        {id:"VOGAL_1", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
        {id:"VOGAL_2", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
        {id:"VOGAL_3", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
        {id:"VOGAL_4", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
        {id:"VOGAL_5", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
    ];

    const initConselho = [
        {id:"PRESIDENTE_CONSELHO_FISCAL", cargo:"Presidente"},
        {id:"CONSELHEIRO_1", cargo:"Conselheiro"},
        {id:"CONSELHEIRO_2", cargo:"Conselheiro"},
        {id:"CONSELHEIRO_3", cargo:"Conselheiro"},
        {id:"CONSELHEIRO_4", cargo:"Conselheiro"},
    ];

    const initFormMembro = {
        uuid:"",
        nome:"",
        cargo_associacao:"",
        cargo_educacao:"",
        representacao:"",
        codigo_identificacao:"",
    };

    const [clickIconeToogle, setClickIconeToogle] = useState({});
    const [showEditarMembro, setShowEditarMembro] = useState(false);
    const [membros, setMembros] = useState({});
    const [initialValuesMembrosDiretoria, setInitialValuesMembrosDiretoria] = useState(initDiretoria);
    const [initialValuesMembrosConselho, setInitialValuesMembrosConselho] = useState(initConselho);
    const [infosMembroSelecionado, setInfosMembroSelecionado] = useState(null);
    const [stateFormEditarMembro, setStateFormEditarMembro] = useState(initFormMembro);

    useEffect(()=>{
        carregaMembros();
    }, []);

    useEffect(()=>{
        mesclaMembros();
    }, [membros]);

    const carregaMembros = async ()=>{
        let membros = await getMembrosAssociacao();
        setMembros(membros)
    };

    const buscaDadosMembros = (id_cargo) =>{
        return membros.find(element => element.cargo_associacao === id_cargo);
    };

    const mesclaMembros = async ()=>{
        let cargos_e_infos_diretoria = [];
        let cargos_e_infos_conselho = [];
        if(membros && membros.length > 0){
            cargos_e_infos_diretoria = [
                {id:"PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Presidente", cargo_exibe_form: "Presidente da Diretoria Executiva",  infos: buscaDadosMembros('PRESIDENTE_DIRETORIA_EXECUTIVA')},
                {id:"VICE_PRESIDENTE_DIRETORIA_EXECUTIVA", cargo:"Vice Presidente", cargo_exibe_form: "Vice Presidente da Diretoria Executiva", infos: buscaDadosMembros('VICE_PRESIDENTE_DIRETORIA_EXECUTIVA')},
                {id:"SECRETARIO", cargo:"Secretário", cargo_exibe_form: "Secretário da Diretoria Executiva", infos: buscaDadosMembros('SECRETARIO')},
                {id:"TESOUREIRO", cargo:"Tesoureiro", cargo_exibe_form: "Tesoureiro da Diretoria Executiva", infos: buscaDadosMembros('TESOUREIRO')},
                {id:"VOGAL_1", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva", infos: buscaDadosMembros('VOGAL_1')},
                {id:"VOGAL_2", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva", infos: buscaDadosMembros('VOGAL_2')},
                {id:"VOGAL_3", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva", infos: buscaDadosMembros('VOGAL_3')},
                {id:"VOGAL_4", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva", infos: buscaDadosMembros('VOGAL_4')},
                {id:"VOGAL_5", cargo:"Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva", infos: buscaDadosMembros('VOGAL_5')},
            ];

            cargos_e_infos_conselho = [
                {id:"PRESIDENTE_CONSELHO_FISCAL", cargo:"Presidente", infos: buscaDadosMembros('PRESIDENTE_CONSELHO_FISCAL')},
                {id:"CONSELHEIRO_1", cargo:"Conselheiro", infos: buscaDadosMembros('CONSELHEIRO_1')},
                {id:"CONSELHEIRO_2", cargo:"Conselheiro", infos: buscaDadosMembros('CONSELHEIRO_2')},
                {id:"CONSELHEIRO_3", cargo:"Conselheiro", infos: buscaDadosMembros('CONSELHEIRO_3')},
                {id:"CONSELHEIRO_4", cargo:"Conselheiro", infos: buscaDadosMembros('CONSELHEIRO_4')},
            ];
            setInitialValuesMembrosDiretoria(cargos_e_infos_diretoria);
            setInitialValuesMembrosConselho(cargos_e_infos_conselho);
        }
    };

    const converteNomeRepresentacao = (id_representacao) =>{
        switch (id_representacao) {
            case 'SERVIDOR':
                return "Servidor";
            case 'ESTUDANTE':
                return "Estudante";
            case 'PAI_RESPONSAVEL':
                return "Pai ou responsável";
            default:
                return ""
        }
    };

    const retornaDadosAdicionaisTabela = (infos) => {
        if(infos.representacao === "SERVIDOR"){
            return (
                <p className="texto-dados-adicionais-tabela-membros">
                    <span className="mr-5"><strong>Registro funcional:</strong> {infos.codigo_identificacao}</span>
                    <span><strong>Cargo na educação: </strong> {infos.cargo_educacao}</span>
                </p>
            )
        }else if (infos.representacao === "ESTUDANTE" || infos.representacao === "PAI_RESPONSAVEL"){
            return (
                <p className="texto-dados-adicionais-tabela-membros">
                    <span className="mr-5"><strong>Código Eol do Aluno: </strong> {infos.codigo_identificacao}</span>
                </p>
            )
        }
    };

    const onShowEditarMembro = (infoMembroSelecionado)=>{
        setShowEditarMembro(true);

        let init;
        if (infoMembroSelecionado && infoMembroSelecionado.infos){
             init = {
                uuid: infoMembroSelecionado.infos.uuid ? infoMembroSelecionado.infos.uuid : "",
                nome: infoMembroSelecionado.infos.nome ? infoMembroSelecionado.infos.nome : "",
                cargo_associacao: infoMembroSelecionado.cargo_exibe_form ? infoMembroSelecionado.cargo_exibe_form : "",
                cargo_educacao: infoMembroSelecionado.infos.cargo_educacao ? infoMembroSelecionado.infos.cargo_educacao : "",
                representacao: infoMembroSelecionado.infos.representacao ? infoMembroSelecionado.infos.representacao : "",
                codigo_identificacao: infoMembroSelecionado.infos.codigo_identificacao ? infoMembroSelecionado.infos.codigo_identificacao : "",
            };
        }else {
            init = {
                uuid: "",
                nome: "",
                cargo_associacao: infoMembroSelecionado.cargo_exibe_form ? infoMembroSelecionado.cargo_exibe_form : "",
                cargo_educacao: "",
                representacao: "",
                codigo_identificacao: "",
            };
        }

        setStateFormEditarMembro(init);
        setInfosMembroSelecionado(infoMembroSelecionado)
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

    const handleBlurCodigoIdentificacao = (errors, values) => {
        console.log("handleBlurCodigoIdentificacao errors ", errors);

        errors.codigo_identificacao = "AQUI O ERRO";
        console.log("handleBlurCodigoIdentificacao value ", values);
    };

    const onSubmitEditarMembro = async () =>{
        setShowEditarMembro(false);
        console.log("Submit stateFormEditarMembro ", stateFormEditarMembro);

        let payload = {};

        if(stateFormEditarMembro && stateFormEditarMembro.representacao === "SERVIDOR"){
            payload = {
                'nome': stateFormEditarMembro.nome,
                'associacao': localStorage.getItem(ASSOCIACAO_UUID),
                'cargo_associacao': infosMembroSelecionado.id,
                'cargo_educacao': stateFormEditarMembro.cargo_educacao ? stateFormEditarMembro.cargo_educacao : "",
                'representacao': stateFormEditarMembro.representacao ? stateFormEditarMembro.representacao : "",
                'codigo_identificacao': stateFormEditarMembro.codigo_identificacao ? stateFormEditarMembro.codigo_identificacao : ""
            };
        }else if(stateFormEditarMembro && stateFormEditarMembro.representacao === "ESTUDANTE"){
            payload = {
                'nome': stateFormEditarMembro.nome,
                'associacao': localStorage.getItem(ASSOCIACAO_UUID),
                'cargo_associacao': infosMembroSelecionado.id,
                'cargo_educacao': "",
                'representacao': stateFormEditarMembro.representacao ? stateFormEditarMembro.representacao : "",
                'codigo_identificacao': stateFormEditarMembro.codigo_identificacao ? stateFormEditarMembro.codigo_identificacao : ""
            };
        }else if (stateFormEditarMembro && stateFormEditarMembro.representacao === "PAI_RESPONSAVEL"){
            payload = {
                'nome': stateFormEditarMembro.nome,
                'associacao': localStorage.getItem(ASSOCIACAO_UUID),
                'cargo_associacao': infosMembroSelecionado.id,
                'cargo_educacao': "",
                'representacao': stateFormEditarMembro.representacao ? stateFormEditarMembro.representacao : "",
                'codigo_identificacao': ""
            };
        }
        console.log("payload ", payload);

        if (stateFormEditarMembro.uuid){
            try {
                const response = await editarMembroAssociacao(payload, stateFormEditarMembro.uuid);
                if (response.status === 200 || response.status === 201){
                    console.log("Response ", response);
                    console.log("Operação realizada com sucesso!");
                    await carregaMembros();
                }else {
                    console.log("Erro ao criar Membro")
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            try {
                const response = await criarMembroAssociacao(payload);
                if (response.status === 200 || response.status === 201) {
                    console.log("Response ", response);
                    console.log("Operação realizada com sucesso!");
                    await carregaMembros();
                }else {
                    console.log("Erro ao editar Membro")
                }

            } catch (error) {
                console.log(error)
            }
        }
    };

    return(
        <div className="row">
            <div className="col-12">
                <>
                    <MenuInterno
                        caminhos_menu_interno={caminhos_menu_interno}
                    />
                    <TabelaMembros
                        titulo="Diretoria Executiva"
                        clickIconeToogle={clickIconeToogle}
                        toggleIcon={toggleIcon}
                        onShowEditarMembro={onShowEditarMembro}
                        cargos={initialValuesMembrosDiretoria}
                        converteNomeRepresentacao={converteNomeRepresentacao}
                        retornaDadosAdicionaisTabela={retornaDadosAdicionaisTabela}
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
                    handleBlurCodigoIdentificacao={handleBlurCodigoIdentificacao}
                    stateFormEditarMembro={stateFormEditarMembro}
                    infosMembroSelecionado={infosMembroSelecionado}
                />
            </section>

        </div>
    );
};