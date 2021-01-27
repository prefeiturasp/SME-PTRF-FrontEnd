import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getListaDeAcoes, getAcoesFiltradas, postAddAcao, putAtualizarAcao, deleteAcao} from "../../../../../services/sme/Parametrizacoes.service";
import '../parametrizacoes-estrutura.scss'
import {Filtros} from "./Filtros";
import {TabelaAcoes} from "./TabelaAcoes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faEdit, faClipboardList, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import {ModalFormAcoes} from "./ModalFormAcoes";
import {ModalConfirmDeleteAcao} from "./ModalConfirmDeleteAcao";
import {ModalInfoNaoPodeExcluir} from "./ModalInfoNaoPodeExcluir";
import {ModalInfoNaoPodeGravar} from "./ModalInfoNaoPodeGravar";
import {Link} from "react-router-dom";


export const Acoes = () => {

    const initialStateFiltros = {
        filtrar_por_nome: "",
    };

    const [todasAsAcoes, setTodasAsAcoes] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [loading, setLoading] = useState(true);

    const carregaTodasAsAcoes = useCallback(async () => {
        setLoading(true);
        let todas_acoes = await getListaDeAcoes();
        setTodasAsAcoes(todas_acoes);

        setLoading(false);
    }, []);

    useEffect(() => {
        carregaTodasAsAcoes();
    }, [carregaTodasAsAcoes]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeAcoes = useMemo(() => todasAsAcoes.length, [todasAsAcoes]);

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };
    const handleSubmitFiltros = async () => {
        setLoading(true);
        let acoes_filtradas = await getAcoesFiltradas(stateFiltros.filtrar_por_nome);
        setTodasAsAcoes(acoes_filtradas);
        setLoading(false)
    };
    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsAcoes();
    };

    //Para a Tabela
    const rowsPerPage = 20;

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

    const conferirUnidadesTemplate = (rowData, column) => {
        return (
            <div>
                <Link to={`/associacoes-da-acao/${rowData['uuid']}`} className="link-green" onClick={() => {}}>
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "0"}}
                        icon={faClipboardList}
                    />
                    <span> Ver UEs vinculadas</span>
                </Link>
            </div>
        )
    };

    // Para o ModalForm
    const initialStateFormModal = {
        nome: "",
        e_recursos_proprios: false,
        posicao_nas_pesquisas: "",
        uuid: "",
        id: "",
        operacao: 'create',
    };
    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalDeleteAcao, setShowModalDeleteAcao] = useState(false);
    const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
    const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");
    const [showModalInfoNaoPodeGravar, setShowModalInfoNaoPodeGravar] = useState(false);
    const [mensagemModalInfoNaoPodeGravar, setMensagemModalInfoNaoPodeGravar] = useState("");

    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [readOnly, setReadOnly] = useState(false);

    const onHandleClose = () => {
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    };
    const handleCloseDeleteAcao = () => {
        setShowModalDeleteAcao(false)
    };
    const handleCloseInfoNaoPodeExcluir = () => {
        setShowModalInfoNaoPodeExcluir(false);
        setMensagemModalInfoNaoPodeExcluir("");
    };
    const handleCloseInfoNaoPodeGravar = () => {
        setShowModalInfoNaoPodeGravar(false);
        setMensagemModalInfoNaoPodeGravar("");
    };
    const handleChangeFormModal = (name, value, e=null) => {
        setStateFormModal({
            ...stateFormModal,
            [name]: value
        });
    };
    const handleEditarAcoes = (rowData) => {
        setReadOnly(false);
        setStateFormModal({
            uuid: rowData.uuid,
            id: rowData.id,
            nome: rowData.nome,
            e_recursos_proprios: rowData.e_recursos_proprios,
            posicao_nas_pesquisas: rowData.posicao_nas_pesquisas,
            operacao: 'edit',
        });
        setShowModalForm(true)
    };
    const handleSubmitModalFormAcoes = async (stateFormModal) => {
        const payload = {
            nome: stateFormModal.nome,
            e_recursos_proprios: stateFormModal.e_recursos_proprios,
            posicao_nas_pesquisas: stateFormModal.posicao_nas_pesquisas,
        };

        if (stateFormModal.operacao === 'create') {
            try {
                await postAddAcao(payload);
                setShowModalForm(false);
                console.log('Ação criada com sucesso');
                await carregaTodasAsAcoes();
            } catch (e) {
                console.log('Erro ao criar Ação!!! ', e.response.data)
                if (e.response.data && e.response.data.non_field_errors) {
                    setMensagemModalInfoNaoPodeGravar('Ja existe uma ação com esse nome.');
                    setShowModalInfoNaoPodeGravar(true);
                } else {
                    setMensagemModalInfoNaoPodeGravar('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoNaoPodeGravar(true);
                }

            }
        } else {
            try {
                await putAtualizarAcao(stateFormModal.uuid, payload);
                setShowModalForm(false);
                console.log('Ação alterada com sucesso', payload);
                await carregaTodasAsAcoes();
            } catch (e) {
                console.log('Erro ao alterar Ação!! ', e)
                if (e.response.data && e.response.data.non_field_errors) {
                    setMensagemModalInfoNaoPodeGravar('Ja existe uma ação com esse nome.');
                    setShowModalInfoNaoPodeGravar(true);
                } else {
                    setMensagemModalInfoNaoPodeGravar('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoNaoPodeGravar(true);
                }
            }
        }
    };
    const serviceCrudAcoes = async () => {
        setShowModalDeleteAcao(true)
    };

    const onDeleteAcaoTrue = async () => {
        try {
            setShowModalDeleteAcao(false);
            const result = await deleteAcao(stateFormModal.uuid);
            setShowModalForm(false);
            console.log('Ação excluída com sucesso');
            await carregaTodasAsAcoes();
        } catch (e) {
            if (e.response && e.response.data && e.response.data.mensagem){
                setMensagemModalInfoNaoPodeExcluir(e.response.data.mensagem);
                setShowModalInfoNaoPodeExcluir(true);
                console.log(e.response.data.mensagem)
            }
            console.log('Erro ao excluir Ação!! ', e.response)
        }
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Ações</h1>
            <div className="page-content-inner">

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
                        <div className="p-2 bd-highlight pt-3 justify-content-end d-flex">
                            <Link
                                onClick={() => {
                                    setStateFormModal(initialStateFormModal);
                                    setShowModalForm(true);
                                }}
                                className="btn btn-success ml-2"
                            >
                                <FontAwesomeIcon
                                    style={{marginRight: "5px", color: '#fff'}}
                                    icon={faPlus}
                                />
                                Adicionar ação
                            </Link>
                        </div>
                        <Filtros
                            stateFiltros={stateFiltros}
                            handleChangeFiltros={handleChangeFiltros}
                            handleSubmitFiltros={handleSubmitFiltros}
                            limpaFiltros={limpaFiltros}
                        />
                        <p>Exibindo <span className='total-acoes'>{totalDeAcoes}</span> ações</p>
                        <TabelaAcoes
                            todasAsAcoes={todasAsAcoes}
                            rowsPerPage={rowsPerPage}
                            acoesTemplate={acoesTemplate}
                            conferirUnidadesTemplate={conferirUnidadesTemplate}
                        />
                    </>
                }
                <section>
                    <ModalFormAcoes
                        show={showModalForm}
                        handleClose={onHandleClose}
                        handleSubmitModalFormAcoes={handleSubmitModalFormAcoes}
                        handleChangeFormModal={handleChangeFormModal}
                        stateFormModal={stateFormModal}
                        readOnly={readOnly}
                        serviceCrudAcoes={serviceCrudAcoes}
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                    />
                </section>
                <section>
                    <ModalConfirmDeleteAcao
                        show={showModalDeleteAcao}
                        handleClose={handleCloseDeleteAcao}
                        onDeleteAcaoTrue={onDeleteAcaoTrue}
                        titulo="Excluir Ação"
                        texto="<p>Deseja realmente excluir esta ação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Excluir"
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
                    <ModalInfoNaoPodeGravar
                        show={showModalInfoNaoPodeGravar}
                        handleClose={handleCloseInfoNaoPodeGravar}
                        titulo="Atualização não permitida"
                        texto={mensagemModalInfoNaoPodeGravar}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
            </div>
        </PaginasContainer>
    )
};