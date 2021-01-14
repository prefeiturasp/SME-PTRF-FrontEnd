import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodasAcoesDasAssociacoes, getListaDeAcoes, getFiltros, postAddAcaoAssociacao} from "../../../../../services/sme/Parametrizacoes.service";
import '../parametrizacoes-estrutura.scss'
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {Filtros} from "./Filtros";
import {BtnAddAcoes} from "./BtnAddAcoes";
import {TabelaAcoesDasAssociacoes} from "./TabelaAcoesDasAssociacoes";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faEdit} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import {ModalFormAcoesDaAssociacao} from "./ModalFormAcoesDasAssociacoes";

export const AcoesDasAssociacoes = () => {

    const initialStateFiltros = {
        filtrar_por_nome_cod_eol: "",
        filtrar_por_acao: "",
        filtrar_por_status: "",
    };

    const [todasAsAcoes, setTodasAsAcoes] = useState([]);
    const [todasAsAcoesAutoComplete, setTodasAsAcoesAutoComplete] = useState([]);
    const [count, setCount] = useState(0);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [listaTiposDeAcao, setListaTiposDeAcao] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModalForm, setShowModalForm] = useState(false);

    const carregaTodasAsAcoes = useCallback(async () => {
        setLoading(true);
        let todas_acoes = await getTodasAcoesDasAssociacoes();
        console.log('carregaTodasAsAcoes ', todas_acoes);
        setTodasAsAcoes(todas_acoes);

        // Setando sempre todas as ações retornadas para o autocomplete.
        // Nesessário para quando se usa os filtros.
        // Senão o objeto retornado para o autocomplete serão só os elementos filtrados.
        setTodasAsAcoesAutoComplete(todas_acoes);

        setLoading(false);
    }, []);

    useEffect(() => {
        carregaTodasAsAcoes();
    }, [carregaTodasAsAcoes]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeAcoes = useMemo(() => todasAsAcoes.length, [todasAsAcoes]);

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
        setLoading(true);
        let acoes_filtradas = await getFiltros(stateFiltros.filtrar_por_nome_cod_eol, stateFiltros.filtrar_por_acao, stateFiltros.filtrar_por_status);
        setTodasAsAcoes(acoes_filtradas);
        setLoading(false)
    };

    const limpaFiltros = async () => {
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
        codigo_eol:"",
        uuid:"",
        id:"",
        nome_unidade:"",
        operacao:'create',
    };
    const [associacaoAutocomplete, setAssociacaoAutocomplete] = useState(null);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [readOnly, setReadOnly] = useState(true);

    const recebeAcaoAutoComplete = (selectAcao) =>{
        setAssociacaoAutocomplete(selectAcao);
        if (selectAcao){
            setStateFormModal({
                ...stateFormModal,
                associacao: selectAcao.associacao.uuid,
                codigo_eol: selectAcao.associacao.unidade.codigo_eol,
                uuid: selectAcao.uuid,
                id: selectAcao.id,
            });
            setReadOnly(false)
        }
    };

    const onHandleClose = () => {
       setShowModalForm(false)
    };

    const handleChangeFormModal = (name, value) => {
        setStateFormModal({
            ...stateFormModal,
            [name]: value
        });
    };

    const handleEditarAcoes = (rowData) => {
        console.log('handleEditarAcoes', rowData)
        setReadOnly(false);
        setStateFormModal({
            associacao:rowData.associacao.uuid,
            acao: rowData.acao.uuid,
            status: rowData.status,
            codigo_eol: rowData.associacao.unidade.codigo_eol,
            uuid: rowData.uuid,
            id: rowData.id,
            nome_unidade: rowData.associacao.unidade.nome_com_tipo,
            operacao:'edit',
        });
        setShowModalForm(true)

    };
    const handleSubmitModalFormAcoesDasAssociacoes = async (stateFormModal) =>{
        console.log('handleSubmitModalFormAcoesDasAssociacoes stateForm ', stateFormModal);

        const payload = {
            associacao: stateFormModal.associacao,
            acao: stateFormModal.acao,
            status: stateFormModal.status,
        };

        if(stateFormModal.operacao === 'create'){
            try {
                await postAddAcaoAssociacao(payload);
                setShowModalForm(false);
                console.log('Ação Associação criada com sucesso');
                await carregaTodasAsAcoes();
            }catch (e) {
                console.log('Erro ao criar Ação Associação!! ', e)
            }
        }


    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Ações das Associações</h1>
            <div className="page-content-inner">
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
                <BtnAddAcoes
                    FontAwesomeIcon={FontAwesomeIcon}
                    faPlus={faPlus}
                    setShowModalForm={setShowModalForm}
                    initialStateFormModal={initialStateFormModal}
                    setStateFormModal={setStateFormModal}
                />

                <button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback: {count}</button>

                <Filtros
                    stateFiltros={stateFiltros}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                    listaTiposDeAcao={listaTiposDeAcao}
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
                        <p>Exibindo <span className='total-acoes'>{totalDeAcoes}</span> ações de associações</p>
                        <TabelaAcoesDasAssociacoes
                            todasAsAcoes={todasAsAcoes}
                            rowsPerPage={rowsPerPage}
                            statusTemplate={statusTemplate}
                            dataTemplate={dataTemplate}
                            acoesTemplate={acoesTemplate}
                        />
                    </>
                }
                <section>
                    <ModalFormAcoesDaAssociacao
                        show={showModalForm}
                        handleClose={onHandleClose}
                        handleSubmitModalFormAcoesDasAssociacoes={handleSubmitModalFormAcoesDasAssociacoes}
                        recebeAcaoAutoComplete={recebeAcaoAutoComplete}
                        associacaoAutocomplete={associacaoAutocomplete}
                        handleChangeFormModal={handleChangeFormModal}
                        stateFormModal={stateFormModal}
                        readOnly={readOnly}
                        listaTiposDeAcao={listaTiposDeAcao}
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        todasAsAcoesAutoComplete={todasAsAcoesAutoComplete}
                    />
                </section>
            </div>
        </PaginasContainer>
    )
};