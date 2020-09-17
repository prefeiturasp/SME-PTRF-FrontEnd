import React, {useEffect, useState} from "react";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {TabelaMembros} from "../TabelaMembros";
import {EditarMembro} from "../../../../utils/Modais";
import {getMembrosAssociacao, criarMembroAssociacao, editarMembroAssociacao, consultarRF, consultarCodEol} from "../../../../services/escolas/Associacao.service";
import {ASSOCIACAO_UUID} from '../../../../services/auth.service';
import Loading from "../../../../utils/Loading";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {ExportaDadosDaAsssociacao} from "../ExportaDadosAssociacao";

export const MembrosDaAssociacao = () =>{

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
        {id:"PRESIDENTE_CONSELHO_FISCAL", cargo:"Presidente", cargo_exibe_form: "Presidente do Conselho Fiscal"},
        {id:"CONSELHEIRO_1", cargo:"Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal"},
        {id:"CONSELHEIRO_2", cargo:"Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal"},
        {id:"CONSELHEIRO_3", cargo:"Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal"},
        {id:"CONSELHEIRO_4", cargo:"Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal"},
    ];

    const initFormMembro = {
        uuid:"",
        nome:"",
        cargo_associacao:"",
        cargo_educacao:"",
        representacao:"",
        codigo_identificacao:"",
        email:"",
    };

    const [clickIconeToogle, setClickIconeToogle] = useState({});
    const [showEditarMembro, setShowEditarMembro] = useState(false);
    const [membros, setMembros] = useState({});
    const [initialValuesMembrosDiretoria, setInitialValuesMembrosDiretoria] = useState(initDiretoria);
    const [initialValuesMembrosConselho, setInitialValuesMembrosConselho] = useState(initConselho);
    const [infosMembroSelecionado, setInfosMembroSelecionado] = useState(null);
    const [stateFormEditarMembro, setStateFormEditarMembro] = useState(initFormMembro);
    const [btnSalvarReadOnly, setBtnSalvarReadOnly] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        carregaMembros();
    }, []);

    useEffect(()=>{
        mesclaMembros();
    }, [membros]);

    useEffect(()=>{
        setLoading(false)
    }, [])

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
                {id:"PRESIDENTE_CONSELHO_FISCAL", cargo:"Presidente", cargo_exibe_form: "Presidente do Conselho Fiscal", infos: buscaDadosMembros('PRESIDENTE_CONSELHO_FISCAL')},
                {id:"CONSELHEIRO_1", cargo:"Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal", infos: buscaDadosMembros('CONSELHEIRO_1')},
                {id:"CONSELHEIRO_2", cargo:"Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal", infos: buscaDadosMembros('CONSELHEIRO_2')},
                {id:"CONSELHEIRO_3", cargo:"Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal", infos: buscaDadosMembros('CONSELHEIRO_3')},
                {id:"CONSELHEIRO_4", cargo:"Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal", infos: buscaDadosMembros('CONSELHEIRO_4')},
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
                    <span className="mr-5"><strong>Cargo na educação: </strong> {infos.cargo_educacao}</span>
                    <span><strong>Email: </strong> {infos.email}</span>
                </p>
            )
        }else if (infos.representacao === "ESTUDANTE"){
            return (
                <p className="texto-dados-adicionais-tabela-membros">
                    <span className="mr-5"><strong>Código Eol do Aluno: </strong> {infos.codigo_identificacao}</span>
                    <span><strong>Email: </strong> {infos.email}</span>
                </p>
            )
        }else if(infos.representacao === "PAI_RESPONSAVEL"){
            return (
                <p className="texto-dados-adicionais-tabela-membros">
                    <span><strong>Email: </strong> {infos.email}</span>
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
                email: infoMembroSelecionado.infos.email ? infoMembroSelecionado.infos.email : "",
            };
        }else {
            init = {
                uuid: "",
                nome: "",
                cargo_associacao: infoMembroSelecionado.cargo_exibe_form ? infoMembroSelecionado.cargo_exibe_form : "",
                cargo_educacao: "",
                representacao: "",
                codigo_identificacao: "",
                email: "",
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

    const validateFormMembros = async (values) => {
        const errors = {};
        if (values.representacao === "SERVIDOR"){
            setBtnSalvarReadOnly(true);
            try {
                let rf = await consultarRF(values.codigo_identificacao.trim());
                if (rf.status === 200 || rf.status === 201) {
                    const init = {
                        ...stateFormEditarMembro,
                        nome: rf.data[0].nm_pessoa,
                        codigo_identificacao: values.codigo_identificacao,
                        cargo_associacao: values.cargo_associacao,
                        cargo_educacao: rf.data[0].cargo,
                        representacao: values.representacao,
                        email: values.email,
                    };
                    setStateFormEditarMembro(init);
                    setBtnSalvarReadOnly(false);
                }
            }catch (e) {
                errors.codigo_identificacao = "RF inválido"
            }
        }else if(values.representacao === "ESTUDANTE"){
            setBtnSalvarReadOnly(true);
            try {
                let cod_eol = await consultarCodEol(values.codigo_identificacao);
                if (cod_eol.status === 200 || cod_eol.status === 201){
                    const init = {
                        ...stateFormEditarMembro,
                        nome: cod_eol.data.nm_aluno,
                        codigo_identificacao: values.codigo_identificacao,
                        cargo_associacao: values.cargo_associacao,
                        cargo_educacao: "",
                        representacao: values.representacao,
                        email: values.email,
                    };
                    setStateFormEditarMembro(init);
                    setBtnSalvarReadOnly(false);
                }
            }catch (e) {
                errors.codigo_identificacao = "Código Eol inválido"
            }
        }else {
            setBtnSalvarReadOnly(false)
        }
        return errors
    };

    const onSubmitEditarMembro = async () =>{
        setLoading(true)
        setShowEditarMembro(false);
        let payload = {};
        if(stateFormEditarMembro && stateFormEditarMembro.representacao === "SERVIDOR"){
            payload = {
                'nome': stateFormEditarMembro.nome,
                'associacao': localStorage.getItem(ASSOCIACAO_UUID),
                'cargo_associacao': infosMembroSelecionado.id,
                'cargo_educacao': stateFormEditarMembro.cargo_educacao ? stateFormEditarMembro.cargo_educacao : "",
                'representacao': stateFormEditarMembro.representacao ? stateFormEditarMembro.representacao : "",
                'codigo_identificacao': stateFormEditarMembro.codigo_identificacao ? stateFormEditarMembro.codigo_identificacao : "",
                'email': stateFormEditarMembro.email ? stateFormEditarMembro.email : ""
            };
        }else if(stateFormEditarMembro && stateFormEditarMembro.representacao === "ESTUDANTE"){
            payload = {
                'nome': stateFormEditarMembro.nome,
                'associacao': localStorage.getItem(ASSOCIACAO_UUID),
                'cargo_associacao': infosMembroSelecionado.id,
                'cargo_educacao': "",
                'representacao': stateFormEditarMembro.representacao ? stateFormEditarMembro.representacao : "",
                'codigo_identificacao': stateFormEditarMembro.codigo_identificacao ? stateFormEditarMembro.codigo_identificacao : "",
                'email': stateFormEditarMembro.email ? stateFormEditarMembro.email : "",
            };
        }else if (stateFormEditarMembro && stateFormEditarMembro.representacao === "PAI_RESPONSAVEL"){
            payload = {
                'nome': stateFormEditarMembro.nome,
                'associacao': localStorage.getItem(ASSOCIACAO_UUID),
                'cargo_associacao': infosMembroSelecionado.id,
                'cargo_educacao': "",
                'representacao': stateFormEditarMembro.representacao ? stateFormEditarMembro.representacao : "",
                'codigo_identificacao': "",
                'email': stateFormEditarMembro.email ? stateFormEditarMembro.email : "",
            };
        }

        if (stateFormEditarMembro.uuid){
            try {
                const response = await editarMembroAssociacao(payload, stateFormEditarMembro.uuid);
                if (response.status === 200 || response.status === 201){
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
                    console.log("Operação realizada com sucesso!");
                    await carregaMembros();
                }else {
                    console.log("Erro ao editar Membro")
                }
            } catch (error) {
                console.log(error)
            }
        }

        setLoading(false)
    };

    return(
        <div className="row">
                <div className="col-12">
                    {loading ? (
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        ) :
                    <>
                        <MenuInterno
                            caminhos_menu_interno={UrlsMenuInterno}
                        />
                        <ExportaDadosDaAsssociacao/>
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

                        <TabelaMembros
                            titulo="Conselho Fiscal"
                            clickIconeToogle={clickIconeToogle}
                            toggleIcon={toggleIcon}
                            onShowEditarMembro={onShowEditarMembro}
                            cargos={initialValuesMembrosConselho}
                            converteNomeRepresentacao={converteNomeRepresentacao}
                            retornaDadosAdicionaisTabela={retornaDadosAdicionaisTabela}
                        />
                    </>
                    }
                </div>


            <section>
                <EditarMembro
                    show={showEditarMembro}
                    handleClose={onHandleClose}
                    onSubmitEditarMembro={onSubmitEditarMembro}
                    handleChangeEditarMembro={handleChangeEditarMembro}
                    validateFormMembros={validateFormMembros}
                    stateFormEditarMembro={stateFormEditarMembro}
                    infosMembroSelecionado={infosMembroSelecionado}
                    btnSalvarReadOnly={btnSalvarReadOnly}
                />
            </section>

        </div>
    );
};