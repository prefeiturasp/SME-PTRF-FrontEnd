import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {
    postContasAssociacoes,
    patchContasAssociacoes,
    deleteContasAssociacoes,
    getAssociacoes,
    getContasAssociacoesFiltros,
    getFiltrosDadosContasAssociacoes
} from "../../../../../services/sme/Parametrizacoes.service";
import '../parametrizacoes-estrutura.scss'
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {Filtros} from "./Filtros";
import {BtnAdd} from "./BtnAdd";
import {Tabela} from "./Tabela";
import {UrlsMenuInterno} from "./UrlsMenuInterno";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faEdit} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import ModalForm from "./ModalForm";
import {ModalConfirmDelete} from "./ModalConfirmDelete";
import {ModalInfoUpdateNaoPermitido} from "./ModalInfoUpdateNaoPermitido";
import {ModalInfoNaoPodeExcluir} from "../../Estrutura/Acoes/ModalInfoNaoPodeExcluir";
import { toastCustom } from "../../../../Globais/ToastCustom";
import Img404 from "../../../../../assets/img/img-404.svg"
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";

export const ContasDasAssociacoes = () => {

    const initialStateFiltros = {
        filtrar_por_associacao_nome: "",
        filtrar_por_tipo_conta: "",
        filtrar_por_status: ""
    };

    const [todasAsContas, setTodasAsContas] = useState({results: [], count: 0});
    const [todasAsAssociacoesAutoComplete, setTodasAsAssociacoesAutoComplete] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [listaTiposDeConta, setListaTiposDeConta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);
    const [loadingAssociacoes, setLoadingAssociacoes] = useState(true);

    const carregaTodasAsContas = useCallback(async (page=1, filtrar_associacao='', filtrar_por_tipo_conta='', filtrar_por_status='') => {
        setLoading(true);
        let todas_contas = await getContasAssociacoesFiltros(page, filtrar_associacao, filtrar_por_tipo_conta, filtrar_por_status);
        setTodasAsContas(todas_contas);
        setLoading(false);
    }, []);

    const fetchAssociacoes = async () => {
        let todas_associacoes = await getAssociacoes();
        setLoadingAssociacoes(false);
        setTodasAsAssociacoesAutoComplete(todas_associacoes);
    };

    const fetchFiltrosContas = async () => {
        let filtros_contas = await getFiltrosDadosContasAssociacoes();
        setListaTiposDeConta(filtros_contas?.tipos_contas);
    };

    useEffect(() => {
        fetchAssociacoes();
        fetchFiltrosContas();
    }, [])

    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)

        carregaTodasAsContas(
            event.page + 1,
            stateFiltros.filtrar_por_associcao_nome,
            stateFiltros.filtrar_por_tipo_conta,
            stateFiltros.filtrar_por_status
        )
    };

    useEffect(() => {
        carregaTodasAsContas();
    }, [carregaTodasAsContas]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeContas = useMemo(() => todasAsContas?.count || 0, [todasAsContas]);

    // Para os Filtros
    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };
    const handleSubmitFiltros = async () => {
        setCurrentPage(1);
        setFirstPage(1);
        setLoading(true);

        let contas_filtradas = await getContasAssociacoesFiltros(1,
            stateFiltros.filtrar_por_associacao_nome, 
            stateFiltros.filtrar_por_tipo_conta, 
            stateFiltros.filtrar_por_status
        );
        setTodasAsContas(contas_filtradas);
        setLoading(false)
    };
    const limpaFiltros = async () => {
        setCurrentPage(1);
        setFirstPage(1);
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsContas();
    };

    //Para a Tabela
    const rowsPerPage = 20;
    const statusTemplate = (rowData) => {
        return rowData.status && rowData.status === 'ATIVA' ? 'Ativa' : 'Inativa'
    };
    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button onClick={() => handleEditarAcoes(rowData)} className="btn-editar-membro">
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    };

    // const UrlsMenuInterno = [
    //     {label: "Ações das associações", url: "parametro-acoes-associacoes"},
    //     {label: "Cargas de arquivo", url: "undefined"},
    // ];

    // Para o ModalForm
    const initialStateFormModal = {
        associacao: "",
        associacao_nome: "",
        tipo_conta: "",
        status: "",
        uuid: "",
        id: "",
        banco_nome: "",
        agencia: "",
        numero_conta: "",
        numero_cartao: "",
        operacao: 'create',
    };
    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalDeleteAcao, setShowModalDeleteAcao] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState('');
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [showModalInfoExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida] = useState(false);
    const [showModalInfoUpdateNaoPermitido, setShowModalInfoUpdateNaoPermitido] = useState(false);
    const [associacaoAutocomplete, setAssociacaoAutocomplete] = useState(null);
    const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
    const [readOnly, setReadOnly] = useState(true);

    const recebeAutoComplete = (selectAssociacao) => {
        setAssociacaoAutocomplete(selectAssociacao);
        if (selectAssociacao) {
            setStateFormModal({
                ...stateFormModal,
                associacao: selectAssociacao.uuid,
                associacao_nome: selectAssociacao.nome,
                uuid: selectAssociacao.acao && selectAssociacao.acao.uuid ? selectAssociacao.acao.uuid : "",
                id: selectAssociacao.acao && selectAssociacao.acao.id ? selectAssociacao.acao.id : "",
            });
            setReadOnly(false)
        }
    };
    const onHandleClose = () => {
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    };
    const handleCloseDeleteAcao = () => {
        setShowModalDeleteAcao(false)
    };
    const handleCloseModalInfoExclusaoNaoPermitida = () => {
        setShowModalInfoExclusaoNaoPermitida(false);
    };
    const handleCloseModalInfoUpdateNaoPermitido = useCallback(()=>{
        setShowModalInfoUpdateNaoPermitido(false);
    }, []);

    const handleCloseInfoNaoPodeExcluir = () => {
        setShowModalInfoNaoPodeExcluir(false);
        setMensagemModalInfoNaoPodeExcluir("");
    };

    const handleCloseConfirmDelete = useCallback(()=>{
        setShowModalConfirmDelete(false)
    }, []);

    const handleChangeFormModal = (name, value) => {
        setStateFormModal({
            ...stateFormModal,
            [name]: value
        });
    };
    const handleEditarAcoes = (rowData) => {
        setStateFormModal({
            associacao: rowData.associacao,
            tipo_conta: rowData.tipo_conta,
            status: rowData.status,
            uuid: rowData.uuid,
            id: rowData.id,
            banco_nome: rowData.banco_nome,
            agencia: rowData.agencia,
            numero_conta: rowData.numero_conta,
            numero_cartao: rowData.numero_cartao,
            operacao: 'edit',
        });
        setShowModalForm(true)
    };
    const handleSubmitModalForm = async (stateFormModal) => {
        const payload = {
            associacao: stateFormModal.associacao,
            tipo_conta: stateFormModal.tipo_conta,
            status: stateFormModal.status,
            uuid: stateFormModal.uuid,
            banco_nome: stateFormModal.banco_nome,
            agencia: stateFormModal.agencia,
            numero_conta: stateFormModal.numero_conta,
            numero_cartao: stateFormModal.numero_cartao,
        };
        if (stateFormModal.operacao === 'create') {
            try {
                await postContasAssociacoes(payload);
                setShowModalForm(false);
                toastCustom.ToastCustomSuccess('Inclusão de conta da associação realizada com sucesso.', 'A conta da associação foi adicionada ao sistema com sucesso.')
                await carregaTodasAsContas();
            } catch (e) {
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida(e.response.data.non_field_errors);
                    setShowModalInfoUpdateNaoPermitido(true)
                } else {
                    setErroExclusaoNaoPermitida('Erro ao criar conta de associacao. Tente novamente.');
                    setShowModalInfoUpdateNaoPermitido(true)
                }
            }
        } else {
            try {
                await patchContasAssociacoes(stateFormModal.uuid, payload);
                setShowModalForm(false);
                toastCustom.ToastCustomSuccess('Edição da ação da associação realizada com sucesso.', `A ação da associação foi editada no sistema com sucesso.`)
                await carregaTodasAsContas();
            } catch (e) {
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida(e.response.data.non_field_errors);
                    setShowModalInfoUpdateNaoPermitido(true);
                } else {
                    setErroExclusaoNaoPermitida('Erro ao atualizar conta de associacao. Tente novamente.');
                    setShowModalInfoUpdateNaoPermitido(true);
                }
            }
        }
    };
    const onDeleteAcaoTrue = async () => {
        try {
            await deleteContasAssociacoes(stateFormModal.uuid);
            setShowModalDeleteAcao(false);
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess('Remoção da ação da associação efetuada com sucesso.', `A ação da associação foi removida do sistema com sucesso.`)
            await carregaTodasAsContas();
        } catch (e) {
            if (e.response.data && e.response.data.mensagem){
                setMensagemModalInfoNaoPodeExcluir(e.response.data.mensagem);
                setShowModalInfoNaoPodeExcluir(true);
            }else{
                setMensagemModalInfoNaoPodeExcluir('Houve um problema ao realizar esta operação, tente novamente.');
                setShowModalInfoNaoPodeExcluir(true);
            }
        }
    };

    const handleOnChangeMultipleSelectStatus =  async (value) => {
        let name = "filtro_informacoes"

        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Contas das Associações</h1>
            <div className="page-content-inner">
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
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
                    <>
                        <BtnAdd
                            FontAwesomeIcon={FontAwesomeIcon}
                            faPlus={faPlus}
                            setShowModalForm={setShowModalForm}
                            initialStateFormModal={initialStateFormModal}
                            setStateFormModal={setStateFormModal}
                        />
                        {
                            (todasAsContas?.results || []).length ? 
                            <>
                                <Filtros
                                    stateFiltros={stateFiltros}
                                    handleChangeFiltros={handleChangeFiltros}
                                    handleSubmitFiltros={handleSubmitFiltros}
                                    limpaFiltros={limpaFiltros}
                                    listaTiposDeConta={listaTiposDeConta}
                                    tabelaAssociacoes={tabelaAssociacoes}
                                />
                                <p>Exibindo <span className='total-acoes'>{totalDeContas}</span> contas de associações</p>
                                <Tabela
                                    todasAsContas={todasAsContas}
                                    rowsPerPage={rowsPerPage}
                                    statusTemplate={statusTemplate}
                                    acoesTemplate={acoesTemplate}
                                    onPageChange={onPageChange}
                                    firstPage={firstPage}
                                />
                            </> :
                            <MsgImgCentralizada
                                data-qa="imagem-lista-sem-tipos-documentos"
                                texto='Não existem contas de associações cadastradas, clique no botão "Adicionar conta de associação" para começar.'
                                img={Img404}
                                dataQa=""
                            />
                        }   
                    </>
                }
                <section>
                    <ModalForm
                        show={showModalForm}
                        handleClose={onHandleClose}
                        handleSubmitModalForm={handleSubmitModalForm}
                        recebeAutoComplete={recebeAutoComplete}
                        stateFormModal={stateFormModal}
                        readOnly={readOnly}
                        listaTiposDeConta={listaTiposDeConta}
                        setShowModalDelete={setShowModalDeleteAcao}
                        todasAsAssociacoesAutoComplete={todasAsAssociacoesAutoComplete}
                        loadingAssociacoes={loadingAssociacoes}
                    />
                </section>
                <section>
                    <ModalInfoUpdateNaoPermitido
                        show={showModalInfoUpdateNaoPermitido}
                        handleClose={handleCloseModalInfoUpdateNaoPermitido}
                        titulo={
                            stateFormModal.operacao === 'create' ? 'Inclusão não permitida' :
                                stateFormModal.operacao === 'edit' ? 'Alteração não permitida' :
                                    'Exclusão não permitida'
                        }
                        texto={`<p class="mb-0"> ${erroExclusaoNaoPermitida}</p>`}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
                <section>
                    <ModalInfoNaoPodeExcluir
                        show={showModalInfoNaoPodeExcluir}
                        handleClose={handleCloseInfoNaoPodeExcluir}
                        titulo="Exclusão não permitida"
                        texto={mensagemModalInfoNaoPodeExcluir}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
                <section>
                    <ModalConfirmDelete
                        show={showModalDeleteAcao}
                        handleClose={handleCloseDeleteAcao}
                        onDeleteAcaoTrue={onDeleteAcaoTrue}
                        titulo="Excluir Conta de Associação"
                        texto="<p>Deseja realmente excluir esta conta de associação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Excluir"
                    />
                </section>
            </div>
        </PaginasContainer>
    )
};