import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getListaDeAcoes} from "../../../../../services/sme/Parametrizacoes.service";
import {Filtros} from "./Filtros";
import {TabelaLancamentos} from "../../PrestacaoContas/TiposAcertosLancamentos/TabelaLancamentos";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faEdit} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import {Link} from "react-router-dom";
import {ModalFormLancamentos} from "../../PrestacaoContas/TiposAcertosLancamentos/ModalFormLancamento";
import {ModalConfirmDeleteAcao} from "../../Estrutura/Acoes/ModalConfirmDeleteAcao";
import {ModalInfoNaoPodeExcluir} from "../../Estrutura/Acoes/ModalInfoNaoPodeExcluir";
import {ModalInfoNaoPodeGravar} from "../../Estrutura/Acoes/ModalInfoNaoPodeGravar";

export const ParametrizacoesTiposAcertosLancamentos = () =>{
    const initialStateFiltros = {
        FiltrarNome: "",
    };
    const initialStateFormModal = {
        nome: "",
        e_recursos_proprios: false,
        posicao_nas_pesquisas: "",
        uuid: "",
        id: "",
        operacao: 'create',
    };

    const [todosLancamentos, setTodosLancamentos] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalInfoNaoPodeGravar, setShowModalInfoNaoPodeGravar] = useState(false);
    const [mensagemModalInfoNaoPodeGravar, setMensagemModalInfoNaoPodeGravar] = useState("");
    const [showModalDeleteAcao, setShowModalDeleteAcao] = useState(false);
    const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
    const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");
    const [loading, setLoading] = useState(true);
    const [readOnly, setReadOnly] = useState(false);

    const carregaTodosLancamentos = useCallback(async () => {
        setLoading(true);
        let todosLancamentos = await getListaDeAcoes();
        setTodosLancamentos(todosLancamentos);
        setLoading(false);
    }, []);

    useEffect(() => {
        carregaTodosLancamentos();
    }, [carregaTodosLancamentos]);

    const totalDeAcoes = useMemo(() => todosLancamentos.length, [todosLancamentos]);

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleSubmitFiltros = async () => {
        setLoading(true);
        setLoading(false)
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
    };

    const rowsPerPage = 20;

    const lancamentosTemplate = (rowData) => {
        return (
            <div>
                <button onClick={() => alert("Goku")} className="btn-editar-membro">
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    };

    const onHandleClose = () => {
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    };

    const conferirUnidadesTemplate = (e) => {
        console.log("Adicionando")
    }

    const handleSubmitModalFormLancamentos = async () => {
        console.log("submit modal")
    }

    const serviceCrudAcoes = async () => {
        console.log("service crud")
    };

    const handleCloseDeleteAcao = () => {
        console.log("handle close delete acao")
    };

    const onDeleteAcaoTrue =  () => {
        console.log("on delete acao true")
    }

    const handleCloseInfoNaoPodeGravar = () => {
        setShowModalInfoNaoPodeGravar(false);
        setMensagemModalInfoNaoPodeGravar("");
    };

    const handleCloseInfoNaoPodeExcluir = () => {
        setShowModalInfoNaoPodeGravar(false);
        setMensagemModalInfoNaoPodeGravar("");
    };

    const handleChangeFormModal = (name, value) => {
        setStateFormModal({
            ...stateFormModal,
            [name]: value
        });
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Tipo de Acertos Lançamentos</h1>
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
                                Adicionar Tipo de Acerto Lançamentos
                            </Link>
                        </div>
                        <Filtros
                            stateFiltros={stateFiltros}
                            handleChangeFiltros={handleChangeFiltros}
                            handleSubmitFiltros={handleSubmitFiltros}
                            limpaFiltros={limpaFiltros}
                        />
                        <p>Exibindo <span className='total-acoes'>{totalDeAcoes}</span> ações</p>
                        <TabelaLancamentos
                            todosLancamentos={todosLancamentos}
                            rowsPerPage={rowsPerPage}
                            lancamentosTemplate={lancamentosTemplate}
                        />
                    </>
                }
                <section>
                    <ModalFormLancamentos
                        show={showModalForm}
                        handleClose={onHandleClose}
                        handleSubmitModalFormLancamentos={handleSubmitModalFormLancamentos}
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
