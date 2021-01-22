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
} from "../../../../../services/sme/Parametrizacoes.service";
import {TabelaAssociacoes} from "./TabelaAssociacoes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Filtros} from "./Filtros";
import ModalFormAssociacoes from "./ModalFormAssociacoes";
import {BtnAddAssociacoes} from "./BtnAddAssociacoes";

export const Associacoes = () => {

    const [count, setCount] = useState(0);
    const [listaDeAssociacoes, setListaDeAssociacoes] = useState([]);
    const [listaDeAssociacoesFiltrarCpf, setListaDeAssociacoesFiltrarCpf] = useState([]);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState([]);

    const carregaTodasAsAssociacoes = useCallback(async () => {
        let todas_associacoes = await getAssociacoes();
        console.log("Associacoes ", todas_associacoes);
        setListaDeAssociacoes(todas_associacoes);
        setListaDeAssociacoesFiltrarCpf(todas_associacoes);
    }, []);

    useEffect(() => {
        carregaTodasAsAssociacoes();
    }, [carregaTodasAsAssociacoes]);

    const carregaTabelasAssociacoes = useCallback(async () => {
        let tabela = await getTabelaAssociacoes();
        console.log("tabela ", tabela);
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
        let associacoes_filtradas = await getFiltrosAssociacoes(stateFiltros.filtrar_por_tipo_ue, stateFiltros.filtrar_por_dre, stateFiltros.filtrar_por_associacao);
        console.log("handleSubmitFiltros ", associacoes_filtradas);
        setListaDeAssociacoes(associacoes_filtradas);
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsAssociacoes();
    };

    // Modais
    const initialStateFormModal = {
        nome: '',
        codigo_eol_unidade: '',
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
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [listaDePeriodos, setListaDePeriodos] = useState([]);
    const [errosCodigoEol, setErrosCodigoEol] = useState('');

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

    const handleEditFormModalAssociacoes = useCallback( async (rowData) =>{
        let associacao_por_uuid = await getAssociacaoPorUuid(rowData.uuid);
        console.log("Associacao por UUID ", associacao_por_uuid);
        setStateFormModal({
            ...stateFormModal,
            nome: associacao_por_uuid.nome,
            codigo_eol_unidade: associacao_por_uuid.unidade.codigo_eol,
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
        });
        setShowModalForm(true)
    }, [stateFormModal]);

    const carregaUnidadePeloCodigoEol = async (codigo_eol_unidade, setFieldValue) =>{

        try {
            let unidade = await getUnidadePeloCodigoEol(codigo_eol_unidade);
            console.log("carregaUnidadePeloCodigoEol unidade ", unidade);

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

    const handleSubmitModalFormAssociacoes = useCallback(async (values,{setErrors})=>{
        console.log("handleSubmitModalFormAssociacoes values ", values);
        console.log("handleSubmitModalFormAssociacoes erros ", errosCodigoEol);
        console.log("handleSubmitModalFormAssociacoes listaDeAssociacoesFiltrarCpf ", listaDeAssociacoesFiltrarCpf);

        let cnpj_existente = listaDeAssociacoesFiltrarCpf.find(element=> element.cnpj === values.cnpj);
        console.log("cpf_existente ", cnpj_existente)

        if (Object.entries(cnpj_existente).length > 0){
            setErrors({ cnpj: 'Associação com este CNPJ já existe.' });
        }

        if (!errosCodigoEol){

            let payload = {
                nome: values.nome,
                cnpj: values.cnpj,
                periodo_inicial: values.periodo_inicial,
                ccm: values.ccm,
                email: values.email,
                processo_regularidade: values.processo_regularidade,
                unidade: {
                   codigo_eol: values.codigo_eol_unidade,
                   nome: '',
                   email: '',
                   telefone: '',
                   numero: '',
                   tipo_logradouro: '',
                   logradouro: '',
                   bairro: '',
                   cep: ''
                }
            };

            if (values.operacao === 'create'){

                try {
                    let criar_associacao = await postCriarAssociacao(payload);
                    console.log("CRIAR ASSOCIACAO ", criar_associacao);
                    console.log('Associação criada com sucesso.');
                }catch (e) {
                    console.log('Erro ao criar associação ', e.response)
                }
            }

        }

    }, [errosCodigoEol, listaDeAssociacoesFiltrarCpf]);
    
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
                <button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback - {count}</button>
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
                    />
                </section>
            </div>
        </PaginasContainer>
    )
};