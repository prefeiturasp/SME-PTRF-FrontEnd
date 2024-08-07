import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {
    getParametrizacoesAcoesAssociacoes,
    getListaDeAcoes,
    postAddAcaoAssociacao,
    putAtualizarAcaoAssociacao,
    deleteAcaoAssociacao,
    getAssociacoes
} from "../../../../../services/sme/Parametrizacoes.service";
import '../parametrizacoes-estrutura.scss'
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "./UrlsMenuInterno";
import {Filtros} from "./Filtros";
import {BtnAddAcoes} from "./BtnAddAcoes";
import {TabelaAcoesDasAssociacoes} from "./TabelaAcoesDasAssociacoes";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faEdit} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import {ModalFormAcoesDaAssociacao} from "./ModalFormAcoesDasAssociacoes";
import {ModalConfirmDeleteAcaoAssociacao} from "./ModalConfirmDeleteAcaoAssociacao";
import {ModalInfoQtdeRateiosReceitasAcao} from "./ModalInfoQtdeRateiosReceitasAcao";
import { getTabelaAssociacoes } from "../../../../../services/dres/Associacoes.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const AcoesDasAssociacoes = () => {

    const initialStateFiltros = {
        filtrar_por_nome_cod_eol: "",
        filtrar_por_acao: "",
        filtrar_por_status: "",
        filtro_informacoes: []
    };

    const [todasAsAcoes, setTodasAsAcoes] = useState([]);
    const [todasAsAcoesAutoComplete, setTodasAsAcoesAutoComplete] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [listaTiposDeAcao, setListaTiposDeAcao] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);
    const [loadingAssociacoes, setLoadingAssociacoes] = useState(true);

    const carregaTodasAsAcoes = useCallback(async (page=1, filtrar_por_nome_cod_eol='', filtrar_por_acao='', filtrar_por_status='', filtro_informacoes='') => {
        setLoading(true);
        let todas_acoes = await getParametrizacoesAcoesAssociacoes(page, filtrar_por_nome_cod_eol, filtrar_por_acao, filtrar_por_status, filtro_informacoes);
        setTodasAsAcoes(todas_acoes);
        setLoading(false);
    }, []);

    const fetchAssociacoes = async () => {
        let todas_associacoes = await getAssociacoes();
        setLoadingAssociacoes(false);
        setTodasAsAcoesAutoComplete(todas_associacoes);
    };

    const fetchTabelasAssociacoes = async () => {
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    useEffect(() => {
        fetchAssociacoes();
        fetchTabelasAssociacoes();
    }, [])

    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)

        carregaTodasAsAcoes(
            event.page + 1,
            stateFiltros.filtrar_por_nome_cod_eol,
            stateFiltros.filtrar_por_acao,
            stateFiltros.filtrar_por_status,
            stateFiltros.filtro_informacoes
        )
    };

    useEffect(() => {
        carregaTodasAsAcoes();
    }, [carregaTodasAsAcoes]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeAcoes = useMemo(() => todasAsAcoes.count, [todasAsAcoes]);

    const carregaListaTiposDeAcao = useCallback(async () => {
        const resp = await getListaDeAcoes();
        setListaTiposDeAcao(resp);
    }, []);

    useEffect(() => {
        carregaListaTiposDeAcao();
    }, [carregaListaTiposDeAcao]);

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
        let acoes_filtradas = await getParametrizacoesAcoesAssociacoes(1,
            stateFiltros.filtrar_por_nome_cod_eol, 
            stateFiltros.filtrar_por_acao, 
            stateFiltros.filtrar_por_status, 
            stateFiltros.filtro_informacoes
        );
        setTodasAsAcoes(acoes_filtradas);
        setLoading(false)
    };
    const limpaFiltros = async () => {
        setCurrentPage(1);
        setFirstPage(1);
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsAcoes();
    };

    //Para a Tabela
    const rowsPerPage = 20;
    const statusTemplate = (rowData) => {
        return rowData.status && rowData.status === 'ATIVA' ? 'Ativa' : 'Inativa'
    };
    const dataTemplate = (rowData) => {
        return rowData.criado_em ? moment(rowData.criado_em).format("DD/MM/YYYY [às] HH[h]mm") : '';
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

    // Para o ModalForm
    const initialStateFormModal = {
        associacao: "",
        acao: "",
        status: "",
        codigo_eol: "",
        uuid: "",
        id: "",
        nome_unidade: "",
        operacao: 'create',
    };
    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalDeleteAcao, setShowModalDeleteAcao] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState('');
    const [showModalInfoExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida] = useState(false);
    const [associacaoAutocomplete, setAssociacaoAutocomplete] = useState(null);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [readOnly, setReadOnly] = useState(true);

    const recebeAcaoAutoComplete = (selectAcao) => {
        setAssociacaoAutocomplete(selectAcao);
        if (selectAcao) {
            setStateFormModal({
                ...stateFormModal,
                associacao: selectAcao.uuid,
                codigo_eol: selectAcao.unidade.codigo_eol,
                uuid: selectAcao.acao && selectAcao.acao.uuid ? selectAcao.acao.uuid : "",
                id: selectAcao.acao && selectAcao.acao.id ? selectAcao.acao.id : "",
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
    const handleChangeFormModal = (name, value) => {
        setStateFormModal({
            ...stateFormModal,
            [name]: value
        });
    };
    const handleEditarAcoes = (rowData) => {
        if(rowData.data_de_encerramento_associacao) {
            setReadOnly(true);
        } else {
            setReadOnly(false);
        }
        setStateFormModal({
            associacao: rowData.associacao.uuid,
            acao: rowData.acao.uuid,
            status: rowData.status,
            codigo_eol: rowData.associacao.unidade.codigo_eol,
            uuid: rowData.uuid,
            id: rowData.id,
            nome_unidade: rowData.associacao.unidade.nome_com_tipo,
            operacao: 'edit',
        });
        setShowModalForm(true)
    };
    const handleSubmitModalFormAcoesDasAssociacoes = async (stateFormModal) => {
        const payload = {
            associacao: stateFormModal.associacao,
            acao: stateFormModal.acao,
            status: stateFormModal.status,
        };
        if (stateFormModal.operacao === 'create') {
            try {
                await postAddAcaoAssociacao(payload);
                setShowModalForm(false);
                toastCustom.ToastCustomSuccess('Inclusão de ação da associação realizada com sucesso.', `A ação da associação foi adicionada ao sistema com sucesso.`)
                await carregaTodasAsAcoes();
            } catch (e) {
                console.log('Erro ao criar Ação Associação!', e)
            }
        } else {
            try {
                await putAtualizarAcaoAssociacao(stateFormModal.uuid, payload);
                setShowModalForm(false);
                toastCustom.ToastCustomSuccess('Edição da ação da associação realizada com sucesso.', `A ação da associação foi editada no sistema com sucesso.`)
                await carregaTodasAsAcoes();
            } catch (e) {
                console.log('Erro ao alterar Ação Associação!', e)
            }
        }
    };
    const onDeleteAcaoTrue = async () => {
        try {
            await deleteAcaoAssociacao(stateFormModal.uuid);
            setShowModalDeleteAcao(false);
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess('Remoção da ação da associação efetuada com sucesso.', `A ação da associação foi removida do sistema com sucesso.`)
            await carregaTodasAsAcoes();
        } catch (e) {
            console.log('Erro ao excluir ação associação ', e.response.data);
            if (e.response.data && e.response.data.mensagem){
                setErroExclusaoNaoPermitida(e.response.data.mensagem);
                setShowModalDeleteAcao(false);
                setShowModalInfoExclusaoNaoPermitida(true)
            }else{
                setErroExclusaoNaoPermitida('Houve um problema ao realizar esta operação, tente novamente.');
                setShowModalDeleteAcao(false);
                setShowModalInfoExclusaoNaoPermitida(true)
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
            <h1 className="titulo-itens-painel mt-5">Ações das Associações</h1>
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
                        <BtnAddAcoes
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
                            listaTiposDeAcao={listaTiposDeAcao}
                            handleOnChangeMultipleSelectStatus={handleOnChangeMultipleSelectStatus}
                            tabelaAssociacoes={tabelaAssociacoes}
                        />
                        <p>Exibindo <span className='total-acoes'>{totalDeAcoes}</span> ações de associações</p>
                        <TabelaAcoesDasAssociacoes
                            todasAsAcoes={todasAsAcoes}
                            rowsPerPage={rowsPerPage}
                            statusTemplate={statusTemplate}
                            dataTemplate={dataTemplate}
                            acoesTemplate={acoesTemplate}
                            showModalLegendaInformacao={showModalLegendaInformacao}
                            setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                            onPageChange={onPageChange}
                            firstPage={firstPage}
                        />
                    </>
                }
                <section>
                    <ModalFormAcoesDaAssociacao
                        show={showModalForm}
                        handleClose={onHandleClose}
                        handleSubmitModalFormAcoes={handleSubmitModalFormAcoesDasAssociacoes}
                        recebeAcaoAutoComplete={recebeAcaoAutoComplete}
                        associacaoAutocomplete={associacaoAutocomplete}
                        handleChangeFormModal={handleChangeFormModal}
                        stateFormModal={stateFormModal}
                        readOnly={readOnly}
                        listaTiposDeAcao={listaTiposDeAcao}
                        setShowModalDeleteAcao={setShowModalDeleteAcao}
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        todasAsAcoesAutoComplete={todasAsAcoesAutoComplete}
                        loadingAssociacoes={loadingAssociacoes}
                    />
                </section>
                <section>
                    <ModalConfirmDeleteAcaoAssociacao
                        show={showModalDeleteAcao}
                        handleClose={handleCloseDeleteAcao}
                        onDeleteAcaoTrue={onDeleteAcaoTrue}
                        titulo="Excluir Ação de Associação"
                        texto="<p>Deseja realmente excluir esta ação de associação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Excluir"
                    />
                </section>
                <section>
                    <ModalInfoQtdeRateiosReceitasAcao
                        show={showModalInfoExclusaoNaoPermitida}
                        handleClose={handleCloseModalInfoExclusaoNaoPermitida}
                        titulo="Exclusão não permitida"
                        texto={`<p class="mb-0"> ${erroExclusaoNaoPermitida}</p>`}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
            </div>
        </PaginasContainer>
    )
};