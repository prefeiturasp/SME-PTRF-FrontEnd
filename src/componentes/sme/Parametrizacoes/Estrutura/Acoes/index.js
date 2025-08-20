import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getListaDeAcoes, getAcoesFiltradas, postAddAcao, putAtualizarAcao, deleteAcao} from "../../../../../services/sme/Parametrizacoes.service";
import '../parametrizacoes-estrutura.scss'
import { Tooltip as ReactTooltip } from "react-tooltip";
import {Filtros} from "./Filtros";
import {TabelaAcoes} from "./TabelaAcoes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faClipboardList, faTimesCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import {ModalFormAcoes} from "./ModalFormAcoes";
import { ModalConfirmarExclusao } from "../../componentes/ModalConfirmarExclusao";
import {ModalInfoNaoPodeExcluir} from "./ModalInfoNaoPodeExcluir";
import {ModalInfoNaoPodeGravar} from "./ModalInfoNaoPodeGravar";
import { BtnAdd } from "./BtnAdd";
import {Link} from "react-router-dom";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";

export const Acoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
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
    const handleSubmitFiltros = async (e) => {
        e.preventDefault()
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
                <button data-qa="botao-editar-acoes" className="btn-editar-membro"
                    onClick={() => handleEditarAcoes(rowData)}
                    >
                    <div data-tooltip-content="Editar ação" data-tooltip-id={`tooltip-id-${rowData.uuid}`}>
                        <ReactTooltip id={`tooltip-id-${rowData.uuid}`} />
                        <FontAwesomeIcon
                            style={{ fontSize: "20px", marginRight: "0", color: "#00585E" }}
                            icon={faEdit}
                        />
                    </div>
                </button>
            </div>
        )
    };

    const conferirUnidadesTemplate = (rowData) => {
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
        aceita_capital: false,
        aceita_custeio: false,
        aceita_livre: false,
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
    
    const handleChangeFormModal = (name, value) => {
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
            aceita_capital: rowData.aceita_capital,
            aceita_custeio: rowData.aceita_custeio,
            aceita_livre: rowData.aceita_livre,
            operacao: 'edit',
        });
        setShowModalForm(true)
    };
    const handleSubmitModalFormAcoes = async (stateFormModal) => {
        const payload = {
            nome: stateFormModal.nome,
            e_recursos_proprios: stateFormModal.e_recursos_proprios,
            posicao_nas_pesquisas: stateFormModal.posicao_nas_pesquisas,
            aceita_capital: stateFormModal.aceita_capital,
            aceita_custeio: stateFormModal.aceita_custeio,
            aceita_livre: stateFormModal.aceita_livre,
        };

        if (stateFormModal.operacao === 'create') {
            try {
                await postAddAcao(payload);
                setShowModalForm(false);
                console.log('Ação criada com sucesso');
                toastCustom.ToastCustomSuccess('Ação criada com sucesso');
                await carregaTodasAsAcoes();
            } catch (e) {
                console.log('Erro ao criar Ação!!! ', e.response.data)
                if (e.response.data && e.response.data.non_field_errors) {
                    setMensagemModalInfoNaoPodeGravar('Já existe uma ação com esse nome.');
                    setShowModalInfoNaoPodeGravar(true);
                } else {
                    setMensagemModalInfoNaoPodeGravar('Houve um erro ao tentar criar ação.');
                    setShowModalInfoNaoPodeGravar(true);
                }
            }
        } else {
            try {
                await putAtualizarAcao(stateFormModal.uuid, payload);
                setShowModalForm(false);
                console.log('Ação alterada com sucesso');
                toastCustom.ToastCustomSuccess('Ação alterada com sucesso');
                await carregaTodasAsAcoes();
            } catch (e) {
                console.log('Erro ao alterar Ação!! ', e)
                if (e.response.data && e.response.data.non_field_errors) {
                    setMensagemModalInfoNaoPodeGravar('Já existe uma ação com esse nome.');
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
            await deleteAcao(stateFormModal.uuid);
            setShowModalForm(false);
            console.log('Ação excluída com sucesso');
            toastCustom.ToastCustomSuccess('Ação excluída com sucesso');
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
    const booleanTemplate = (value) => {
        const opcoes = {
          true: { icone: faCheckCircle, cor: "#297805", texto: "Sim" },
          false: { icone: faTimesCircle, cor: "#B40C02", texto: "Não" },
        };
        const iconeData = opcoes[value];
        const estiloFlag = {
          fontSize: "14px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: iconeData.cor,
        };
        return (
          <div style={estiloFlag}>
            <FontAwesomeIcon
              style={{ fontSize: "16px", marginRight: "5px", color: iconeData.cor }}
              icon={iconeData.icone}
            />
          </div>
        );
      };
    const aceitaCapitalTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_capital);
    };
    const aceitaCusteioTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_custeio);
    };
    const aceitaLivreTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_livre);
    };
    const recursosPropriosTemplate = (rowData) => {
        return booleanTemplate(rowData.e_recursos_proprios);
    };

    const readOnlyMemo = useMemo(() => readOnly || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES, [readOnly]);

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
                        <BtnAdd
                            setShowModalForm={setShowModalForm}
                            initialStateFormModal={initialStateFormModal}
                            setStateFormModal={setStateFormModal}
                        />
                        <Filtros
                            stateFiltros={stateFiltros}
                            handleChangeFiltros={handleChangeFiltros}
                            handleSubmitFiltros={(e) => handleSubmitFiltros(e)}
                            limpaFiltros={limpaFiltros}
                        />
                        {(todasAsAcoes || []).length ? (
                            <>
                                <p>Exibindo <span className='total-acoes'>{totalDeAcoes}</span> ações</p>
                                <TabelaAcoes
                                    todasAsAcoes={todasAsAcoes}
                                    rowsPerPage={rowsPerPage}
                                    acoesTemplate={acoesTemplate}
                                    conferirUnidadesTemplate={conferirUnidadesTemplate}
                                    aceitaCapitalTemplate={aceitaCapitalTemplate}
                                    aceitaCusteioTemplate={aceitaCusteioTemplate}
                                    aceitaLivreTemplate={aceitaLivreTemplate}
                                    recursosPropriosTemplate={recursosPropriosTemplate}
                                />
                            </>
                        ) : (
                            <MsgImgCentralizada
                                data-qa="imagem-lista-sem-acoes"
                                texto="Nenhum resultado encontrado."
                                img={Img404}
                                />
                        )}
                    </>
                }
                <section>
                    <ModalFormAcoes
                        show={showModalForm}
                        handleClose={onHandleClose}
                        handleSubmitModalFormAcoes={handleSubmitModalFormAcoes}
                        handleChangeFormModal={handleChangeFormModal}
                        setShowModalConfirmDelete={setShowModalDeleteAcao}
                        stateFormModal={stateFormModal}
                        readOnly={readOnlyMemo}
                        serviceCrudAcoes={serviceCrudAcoes}
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
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
                <section>
                    <ModalConfirmarExclusao
                        open={showModalDeleteAcao}
                        onOk={onDeleteAcaoTrue}
                        okText="Excluir"
                        onCancel={handleCloseDeleteAcao}
                        cancelText="Cancelar"
                        cancelButtonProps={{ className: "btn-base-verde-outline" }}
                        titulo="Excluir Ação"
                        bodyText={
                        <p>Tem certeza que deseja excluir esta ação?</p>
                        }
                    />
                    </section>
            </div>
        </PaginasContainer>
    )
};