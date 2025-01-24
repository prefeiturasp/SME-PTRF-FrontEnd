import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import ReactTooltip from "react-tooltip";
import {
    getTodosMotivosPagamentoAntecipado,
    getFiltrosMotivosPagamentoAntecipado,
    postCreateMotivoPagamentoAntecipado,
    patchAlterarMotivoPagamentoAntecipado,
    deleteMotivoPagamentoAntecipado,
} from "../../../../../services/sme/Parametrizacoes.service";
import Tabela from "./Tabela";
import {Filtros} from "./Filtros";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import Img404 from "../../../../../assets/img/img-404.svg"
import ModalForm from "./ModalForm";
import {ModalInfoUpdateNaoPermitido} from "./ModalInfoUpdateNaoPermitido";
import {ModalConfirmDelete} from "./ModalConfirmDelete";
import {BtnAdd} from "./BtnAdd";
import Loading from "../../../../../utils/Loading";
import {ModalInfoNaoPodeExcluir} from "../../Estrutura/Acoes/ModalInfoNaoPodeExcluir";
import {toastCustom} from "../../../../Globais/ToastCustom";
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";

export const MotivosPagamentoAntecipado = ()=>{

    const [listaDeMotivos, setListaDeMotivos] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregaTodos = useCallback(async ()=>{
        setLoading(true);
        let todos = await getTodosMotivosPagamentoAntecipado();
        setListaDeMotivos(todos);
        setLoading(false);
    }, []);

    useEffect(()=>{
        carregaTodos()
    }, [carregaTodos]);

    // Quando a state da lista sofrer alteração
    const totalDeMotivos = useMemo(() => (listaDeMotivos||[]).length, [listaDeMotivos]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_motivo: "",
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
        let filtrados = await getFiltrosMotivosPagamentoAntecipado(stateFiltros.filtrar_por_motivo);
        setListaDeMotivos(filtrados);
        setLoading(false);
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await carregaTodos();
        setLoading(false);
    };

    // Tabela
    const rowsPerPage = 20;

    // Modal
    const initialStateFormModal = {
        motivo: "",
        id:"",
        uuid: "",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalInfoUpdateNaoPermitido, setShowModalInfoUpdateNaoPermitido] = useState(false);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState('');
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
    const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");
    const handleEditFormModal = useCallback( async (rowData) =>{
        setStateFormModal({
            ...stateFormModal,
            motivo: rowData.motivo,
            uuid: rowData.uuid,
            id: rowData.id,
            operacao: 'edit',
        });
        setShowModalForm(true)
    }, [stateFormModal]);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button data-qa="botao-editar-motivo-pagamento-antecipado"
                    className="btn-editar-membro" onClick={()=>handleEditFormModal(rowData)}>
                    <div data-tip="Editar" data-for={`tooltip-id-${rowData.uuid}`}>
                        <ReactTooltip id={`tooltip-id-${rowData.uuid}`}/>
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                            icon={faEdit}
                        />
                    </div>
                </button>
            </div>
        )
    }, [handleEditFormModal]);

    const handleSubmitModalForm = useCallback(async (values)=>{
        let payload = {
            ...values
        };

        if (values.operacao === 'create'){
            try{
                await postCreateMotivoPagamentoAntecipado(payload);
                toastCustom.ToastCustomSuccess(
                    'Inclusão de motivo de pagamento antecipado realizado com sucesso.',
                    'O motivo de pagamento antecipado foi adicionado ao sistema com sucesso.')
                setShowModalForm(false);
                await carregaTodos();
            }catch (e) {
                console.log('Erro ao criar Motivo de pagamento antecipado ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Este motivo de pagamento antecipado já existe.');
                    setShowModalInfoUpdateNaoPermitido(true)
                } else {
                    console.log(e.response)
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoUpdateNaoPermitido(true)
                }
            }
        }else {
            try {
                await patchAlterarMotivoPagamentoAntecipado(values.uuid, payload);
                toastCustom.ToastCustomSuccess('Edição do motivo de pagamento antecipado realizado com sucesso.', 
                    'O motivo de pagamento antecipado foi editado no sistema com sucesso.')
                setShowModalForm(false);
                await carregaTodos();
            }catch (e) {
                console.log('Erro ao alterar motivo de pagamento antecipado ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Este motivo de pagamento antecipado já existe.');
                    setShowModalInfoUpdateNaoPermitido(true);
                } else {
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoUpdateNaoPermitido(true);
                }
            }
            setLoading(false);
        }
    }, [carregaTodos]);

    const onDeleteTrue = useCallback(async ()=>{
        setLoading(true);
        try {
            setShowModalConfirmDelete(false);
            await deleteMotivoPagamentoAntecipado(stateFormModal.uuid);
            toastCustom.ToastCustomSuccess('Remoção do motivo de pagamento antecipado efetuado com sucesso.', 
                'O motivo de pagamento antecipado foi removido do sistema com sucesso.')
            setShowModalForm(false);
            await carregaTodos();
        }catch (e) {
            if (e.response && e.response.data && e.response.data.mensagem){
                setMensagemModalInfoNaoPodeExcluir(e.response.data.mensagem);
                setShowModalInfoNaoPodeExcluir(true);
                console.log(e.response.data.mensagem)
            }else {
                setMensagemModalInfoNaoPodeExcluir('Houve um erro ao tentar fazer essa atualização.');
                setShowModalInfoNaoPodeExcluir(true);
            }
        }
        setLoading(false);
    }, [stateFormModal, carregaTodos]);

    const handleCloseFormModal = useCallback(()=>{
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    }, [initialStateFormModal]);

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

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Motivo de pagamento antecipado</h1>
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
                    <div className="page-content-inner">
                        <BtnAdd
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
                            />
                        {
                            (listaDeMotivos || []).length ?
                            <>
                                <p>Exibindo <span className='total-acoes'>{totalDeMotivos}</span> motivos(s) de pagamento antecipado</p>
                                <Tabela
                                    rowsPerPage={rowsPerPage}
                                    lista={listaDeMotivos}
                                    acoesTemplate={acoesTemplate}
                                />
                            </>
                        :
                            <MsgImgCentralizada
                                data-qa="imagem-lista-sem-motivos-pagamento-antecipado"
                                texto='Nenhum resultado encontrado.'
                                img={Img404}
                            />
                        }
                    </div>
                    <section>
                        <ModalForm
                            show={showModalForm}
                            stateFormModal={stateFormModal}
                            handleClose={handleCloseFormModal}
                            handleSubmitModalForm={handleSubmitModalForm}
                            setShowModalConfirmDelete={setShowModalConfirmDelete}
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
                            show={showModalConfirmDelete}
                            handleClose={handleCloseConfirmDelete}
                            onDeleteTrue={onDeleteTrue}
                            titulo="Excluir Motivo de pagamento antecipado"
                            texto="<p>Deseja realmente excluir este motivo de pagamento antecipado?</p>"
                            primeiroBotaoTexto="Cancelar"
                            primeiroBotaoCss="outline-success"
                            segundoBotaoCss="danger"
                            segundoBotaoTexto="Excluir"
                        />
                    </section>
                </>
            }
        </PaginasContainer>
    )
};
