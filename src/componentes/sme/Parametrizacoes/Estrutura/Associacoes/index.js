import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {UrlsMenuInterno} from "./UrlsMenuInterno";
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {
    getAssociacoes,
    getTabelaAssociacoes,
    getFiltrosAssociacoes,
    getAssociacaoPorUuid,
    getTodosPeriodos,
    getUnidadePeloCodigoEol,
    postCriarAssociacao,
    patchUpdateAssociacao,
    deleteAssociacao,
    getAcoesAssociacao,
    getContasAssociacao,
    validarDataDeEncerramento
} from "../../../../../services/sme/Parametrizacoes.service";
import {TabelaAssociacoes} from "./TabelaAssociacoes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Filtros} from "./Filtros";
import ModalFormAssociacoes from "./ModalFormAssociacoes";
import {BtnAddAssociacoes} from "./BtnAddAssociacoes";
import {ModalConfirmDeleteAssociacao} from "./ModalConfirmDeleteAssociacao";
import {ModalInfoExclusaoNaoPermitida} from "./ModalInfoExclusaoNaoPermitida";
import Loading from "../../../../../utils/Loading";

export const Associacoes = () => {

    const [listaDeAssociacoes, setListaDeAssociacoes] = useState([]);
    const [listaDeAssociacoesFiltrarCnpj, setListaDeAssociacoesFiltrarCnpj] = useState([]);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensagemExcluirAssociacao, setMensagemExcluirAssociacao] = useState('<p>Deseja realmente excluir esta associação?<p/>')

    const carregaTodasAsAssociacoes = useCallback(async () => {
        setLoading(true);
        let todas_associacoes = await getAssociacoes();
        setListaDeAssociacoes(todas_associacoes);
        setListaDeAssociacoesFiltrarCnpj(todas_associacoes);
        setLoading(false);
    }, []);

    useEffect(() => {
        carregaTodasAsAssociacoes();
    }, [carregaTodasAsAssociacoes]);

    const carregaTabelasAssociacoes = useCallback(async () => {
        let tabela = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela);
    }, []);

    useEffect(() => {
        carregaTabelasAssociacoes();
    }, [carregaTabelasAssociacoes]);

    // Quando a state de listaDeAssociacoes sofrer alteração
    const totalDeAssociacoes = useMemo(() => listaDeAssociacoes.length, [listaDeAssociacoes]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_associacao: "",
        filtrar_por_dre: "",
        filtrar_por_tipo_ue: "",
    };
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        setLoading(true);
        let associacoes_filtradas = await getFiltrosAssociacoes(stateFiltros.filtrar_por_tipo_ue, stateFiltros.filtrar_por_dre, stateFiltros.filtrar_por_associacao);
        setListaDeAssociacoes(associacoes_filtradas);
        setLoading(false);
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsAssociacoes();
        setLoading(false);
    };

    // Modais
    const initialStateFormModal = {
        nome: '',
        uuid_unidade: '',
        codigo_eol_unidade: '',
        observacao: '',
        tipo_unidade: '',
        nome_unidade: '',
        cnpj: '',
        periodo_inicial: '' ,
        ccm: '',
        email: '',
        status_regularidade: '',
        processo_regularidade: '',
        uuid:"",
        id:"",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalConfirmDeleteAssociacao, setShowModalConfirmDeleteAssociacao] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalInfoExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida] = useState(false);
    const [listaDePeriodos, setListaDePeriodos] = useState([]);
    const [errosCodigoEol, setErrosCodigoEol] = useState('');
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState('');

    const carregaTodosPeriodos =  useCallback( async ()=>{
        let periodos = await getTodosPeriodos();
        setListaDePeriodos(periodos);
    }, []);

    useEffect(()=>{
        carregaTodosPeriodos();
    }, [carregaTodosPeriodos]);

    const handleCloseFormModal = useCallback(()=>{
        setStateFormModal(initialStateFormModal);
        setErrosCodigoEol('');
        setShowModalForm(false)
    }, [initialStateFormModal]);

    const handleCloseConfirmDeleteAssociacao = useCallback(()=>{
        setShowModalConfirmDeleteAssociacao(false);
    }, []);

    const handleCloseModalInfoExclusaoNaoPermitida = useCallback(()=>{
        setShowModalInfoExclusaoNaoPermitida(false);
        setErroExclusaoNaoPermitida('');
        setShowModalConfirmDeleteAssociacao(false)
    }, []);

    const handleEditFormModalAssociacoes = useCallback( async (rowData) =>{
        let associacao_por_uuid = await getAssociacaoPorUuid(rowData.uuid);
        setStateFormModal({
            ...stateFormModal,
            nome: associacao_por_uuid.nome,
            uuid_unidade: associacao_por_uuid.unidade.uuid,
            codigo_eol_unidade: associacao_por_uuid.unidade.codigo_eol,
            observacao: associacao_por_uuid.unidade.observacao,
            tipo_unidade: associacao_por_uuid.unidade.tipo_unidade,
            nome_unidade: associacao_por_uuid.unidade.nome,
            cnpj: associacao_por_uuid.cnpj,
            periodo_inicial: associacao_por_uuid.periodo_inicial && associacao_por_uuid.periodo_inicial.uuid ? associacao_por_uuid.periodo_inicial.uuid : '' ,
            ccm: associacao_por_uuid.ccm ? associacao_por_uuid.ccm : "",
            email: associacao_por_uuid.email ? associacao_por_uuid.email : "",
            status_regularidade: associacao_por_uuid.status_regularidade,
            processo_regularidade: associacao_por_uuid.processo_regularidade ? associacao_por_uuid.processo_regularidade : "-",
            uuid: associacao_por_uuid.uuid,
            id: associacao_por_uuid.id,
            operacao: 'edit',
            data_de_encerramento: associacao_por_uuid.data_de_encerramento.data,
            data_de_encerramento_help_text: associacao_por_uuid.data_de_encerramento.help_text,
            retorna_se_pode_editar_periodo_inicial: associacao_por_uuid.retorna_se_pode_editar_periodo_inicial
        });
        setShowModalForm(true)
    }, [stateFormModal]);


    const carregaUnidadePeloCodigoEol = async (codigo_eol_unidade, setFieldValue) =>{

        try {
            let unidade = await getUnidadePeloCodigoEol(codigo_eol_unidade);
            if (Object.entries(unidade).length > 0){
                setFieldValue('tipo_unidade', unidade.tipo_unidade.trim());
                setFieldValue('nome_unidade', unidade.nome.trim());
                setErrosCodigoEol('');
            }else {
                setErrosCodigoEol('Unidade não encontrada.');
            }
        }catch (e) {
            if (e.response.data && e.response.data.mensagem){
                setErrosCodigoEol(e.response.data.mensagem);
            }
        }
    };

    const verifica_alteracao_cnpj =  useMemo(() => stateFormModal.cnpj, [stateFormModal.cnpj]);

    const handleSubmitModalFormAssociacoes = useCallback(async (values,{setErrors})=>{
        let cnpj_existente=false;
        if (verifica_alteracao_cnpj !== values.cnpj.trim() || !values.cnpj.trim()){
            cnpj_existente = listaDeAssociacoesFiltrarCnpj.find(element=> element.cnpj === values.cnpj);
        }
        if (cnpj_existente){
            setErrors({ cnpj: 'Associação com este CNPJ já existe.' });
        }else {
            let payload;
            if (!errosCodigoEol){
                setLoading(true);
                if (values.operacao === 'create'){
                    payload = {
                        nome: values.nome,
                        cnpj: values.cnpj,
                        periodo_inicial: values.periodo_inicial,
                        ccm: values.ccm,
                        email: values.email,
                        status_regularidade: values.status_regularidade,
                        processo_regularidade: values.processo_regularidade,
                        unidade: {
                            codigo_eol: values.codigo_eol_unidade,
                            nome: values.nome_unidade,
                            tipo_unidade: values.tipo_unidade,
                            email: '',
                            telefone: '',
                            numero: '',
                            tipo_logradouro: '',
                            logradouro: '',
                            bairro: '',
                            cep: ''
                        },
                        observacao: values.observacao,
                        data_de_encerramento: values.data_de_encerramento
                    };
                    try {
                        if(values.data_de_encerramento) {
                            await validarDataDeEncerramento(values.uuid, values.data_de_encerramento, values.periodo_inicial)
                        }
                        await postCriarAssociacao(payload);
                        console.log('Associação criada com sucesso.');
                        setShowModalForm(false);
                        await carregaTodasAsAssociacoes();
                    }catch (e) {
                        console.log('Erro ao criar associação ', e.response.data)
                    }
                    setLoading(false);
                }else {
                    setLoading(true);
                    payload = {
                        nome: values.nome,
                        cnpj: values.cnpj,
                        periodo_inicial: values.periodo_inicial,
                        ccm: values.ccm,
                        email: values.email,
                        status_regularidade: values.status_regularidade,
                        processo_regularidade: values.processo_regularidade,
                        unidade: values.uuid_unidade,
                        observacao: values.observacao,
                        data_de_encerramento: values.data_de_encerramento
                    };
                    try {
                        if(values.data_de_encerramento) {
                            await validarDataDeEncerramento(values.uuid, values.data_de_encerramento, values.periodo_inicial)
                        }
                        await patchUpdateAssociacao(values.uuid, payload);
                        console.log('Associação editada com sucesso.');
                        setShowModalForm(false);
                        await carregaTodasAsAssociacoes();
                    }catch (e) {
                        console.log('Erro ao editar associação ', e.response.data)
                    }
                    setLoading(false);
                }
            }
        }
    }, [errosCodigoEol, listaDeAssociacoesFiltrarCnpj, verifica_alteracao_cnpj, carregaTodasAsAssociacoes]);

    const onDeleteAssocicacaoTratamento = useCallback(async (values) => {
        let acoes = await getAcoesAssociacao(values.uuid)
        let contas = await getContasAssociacao(values.uuid)

        if ((acoes && acoes.length > 0) || (contas && contas.length > 0) ){
            let memsagem_complementar = '<p><strong>Atenção!</strong> Essa associação possui informações cadastradas. Todas as informações digitadas no cadastro da Associação serão perdidas.</p>'
            setMensagemExcluirAssociacao(mensagemExcluirAssociacao + memsagem_complementar)
        }else {
            setMensagemExcluirAssociacao(mensagemExcluirAssociacao)
        }
        setShowModalConfirmDeleteAssociacao(true)
    }, [])

    const onDeleteAssociacaoTrue = useCallback(async ()=>{
        setLoading(true);
        try {
            await deleteAssociacao(stateFormModal.uuid);
            console.log('Associação excluída com sucesso.');
            setShowModalConfirmDeleteAssociacao(false);
            setShowModalForm(false);
            await carregaTodasAsAssociacoes();
        }catch (e) {
            console.log('Erro ao excluir associação ', e.response.data);
            if (e.response.data && e.response.data.mensagem){
                setShowModalConfirmDeleteAssociacao(false)
                setErroExclusaoNaoPermitida(e.response.data.mensagem);
                setShowModalInfoExclusaoNaoPermitida(true)
            }else {
                setShowModalConfirmDeleteAssociacao(false)
                setErroExclusaoNaoPermitida('Houve um problema ao realizar esta operação, tente novamente.');
                setShowModalInfoExclusaoNaoPermitida(true)
            }
        }
        setLoading(false);
    }, [stateFormModal.uuid, carregaTodasAsAssociacoes]);
    
    // Tabela Associacoes
    const rowsPerPage = 20;

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditFormModalAssociacoes(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    }, [handleEditFormModalAssociacoes]);
    

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Associações</h1>
            {loading ? (
                    <div className="mt-5">
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    </div>
                ) :
                <div className="page-content-inner">
                    <MenuInterno
                        caminhos_menu_interno={UrlsMenuInterno}
                    />
                    <BtnAddAssociacoes
                        FontAwesomeIcon={FontAwesomeIcon}
                        faPlus={faPlus}
                        setShowModalForm={setShowModalForm}
                        initialStateFormModal={initialStateFormModal}
                        setStateFormModal={setStateFormModal}
                    />
                    <Filtros
                        stateFiltros={stateFiltros}
                        handleChangeFiltros={handleChangeFiltros}
                        handleSubmitFiltros={handleSubmitFiltros}
                        limpaFiltros={limpaFiltros}
                        tabelaAssociacoes={tabelaAssociacoes}
                    />
                    <p>Exibindo <span className='total-acoes'>{totalDeAssociacoes}</span> associações</p>
                    <TabelaAssociacoes
                        rowsPerPage={rowsPerPage}
                        listaDeAssociacoes={listaDeAssociacoes}
                        acoesTemplate={acoesTemplate}
                    />
                    <section>
                        <ModalFormAssociacoes
                            show={showModalForm}
                            stateFormModal={stateFormModal}
                            listaDePeriodos={listaDePeriodos}
                            tabelaAssociacoes={tabelaAssociacoes}
                            carregaUnidadePeloCodigoEol={carregaUnidadePeloCodigoEol}
                            errosCodigoEol={errosCodigoEol}
                            handleClose={handleCloseFormModal}
                            handleSubmitModalFormAssociacoes={handleSubmitModalFormAssociacoes}
                            onDeleteAssocicacaoTratamento={onDeleteAssocicacaoTratamento}
                        />
                    </section>
                    <section>
                        <ModalConfirmDeleteAssociacao
                            show={showModalConfirmDeleteAssociacao}
                            handleClose={handleCloseConfirmDeleteAssociacao}
                            onDeleteAssociacaoTrue={onDeleteAssociacaoTrue}
                            titulo="Excluir Associação"
                            texto={mensagemExcluirAssociacao}
                            primeiroBotaoTexto="Cancelar"
                            primeiroBotaoCss="outline-success"
                            segundoBotaoCss="danger"
                            segundoBotaoTexto="Excluir"
                        />
                    </section>
                    <section>
                        <ModalInfoExclusaoNaoPermitida
                            show={showModalInfoExclusaoNaoPermitida}
                            handleClose={handleCloseModalInfoExclusaoNaoPermitida}
                            titulo="Exclusão não permitida"
                            texto={`<p class="mb-0"> ${erroExclusaoNaoPermitida}</p>`}
                            primeiroBotaoTexto="Fechar"
                            primeiroBotaoCss="success"
                        />
                    </section>
                </div>
            }
        </PaginasContainer>
    )
};