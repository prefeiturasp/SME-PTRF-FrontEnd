import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import ReactTooltip from "react-tooltip";
import {
    getTiposDeTransacao,
    getFiltrosTiposDeTransacao,
    postTipoDeTransacao,
    patchTipoDeTransacao,
    deleteTipoDeTransacao,
} from "../../../../../services/sme/Parametrizacoes.service";
import Tabela from "./Tabela";
import {Filtros} from "./Filtros";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faClose, faCheck} from "@fortawesome/free-solid-svg-icons";
import ModalForm from "./ModalForm";
import {ModalInfoUpdateNaoPermitido} from "./ModalInfoUpdateNaoPermitido";
import Img404 from "../../../../../assets/img/img-404.svg"
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";
import {ModalConfirmDelete} from "./ModalConfirmDelete";
import {BtnAdd} from "./BtnAdd";
import Loading from "../../../../../utils/Loading";
import {ModalInfoNaoPodeExcluir} from "../../Estrutura/Acoes/ModalInfoNaoPodeExcluir";
import {toastCustom} from "../../../../Globais/ToastCustom";
import './tipo_transacao.scss'


export const TiposDeTransacao = ()=>{

    const [listaDeTipos, setListaDeTipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregaTodos = useCallback(async ()=>{
        setLoading(true);
        let todos = await getTiposDeTransacao();
        setListaDeTipos(todos ?? []);
        setLoading(false);
    }, []);

    useEffect(()=>{
        carregaTodos()
    }, [carregaTodos]);

    // Quando a state da lista sofrer alteração
    const totalDeTipos = useMemo(() => listaDeTipos?.length ?? 0, [listaDeTipos]); 

    // Filtros
    const initialStateFiltros = {
        filtrar_por_nome: "",
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
        let filtrados = await getFiltrosTiposDeTransacao(stateFiltros.filtrar_por_nome);
        setListaDeTipos(filtrados);
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
    const temDocumentoTemplate = (rowData) => {
        const opcoes = {
            true: {icone: faCheck, cor: "#297805", texto: "Sim", cor: "#297805"},
            false: {icone: faClose, cor: "#B40C02", texto: "Não", cor: "#B40C02"}
        };
        const iconeData = opcoes[rowData.tem_documento];

        return (
            <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                <FontAwesomeIcon
                    style={{ fontSize: '20px', marginRight: "5px", color: iconeData.cor }}
                    icon={iconeData.icone}
                />
                <span style={{ color: iconeData.cor }}><strong>{iconeData.texto}</strong></span>
            </div>
        );
    };

    // Modal
    const initialStateFormModal = {
        nome: "",
        uuid:"",
        id:"",
        tem_documento: false,
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
            nome: rowData.nome,
            uuid: rowData.uuid,
            id: rowData.id,
            tem_documento: rowData.tem_documento,
            operacao: 'edit'
        });
        setShowModalForm(true)
    }, [stateFormModal]);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditFormModal(rowData)}>
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
                await postTipoDeTransacao(payload);
                toastCustom.ToastCustomSuccess('Inclusão de tipo de transação realizado com sucesso.', 'O tipo de transação foi adicionado ao sistema com sucesso.')
                setShowModalForm(false);
                await carregaTodos();
            }catch (e) {
                console.log('Erro ao criar Tipo de transação ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Já existe um tipo de transação com esse nome');
                    setShowModalInfoUpdateNaoPermitido(true)
                } else {
                    setErroExclusaoNaoPermitida('Erro ao criar tipo de transação. Tente novamente.');
                    setShowModalInfoUpdateNaoPermitido(true)
                }
            }
        }else {
            try {
                await patchTipoDeTransacao(values.uuid, payload);
                toastCustom.ToastCustomSuccess('Edição do tipo de transação realizado com sucesso.', 'O tipo de transação foi editado no sistema com sucesso.')
                setShowModalForm(false);
                await carregaTodos();
            }catch (e) {
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Já existe um tipo de transação com esse nome');
                    setShowModalInfoUpdateNaoPermitido(true);
                } else {
                    setErroExclusaoNaoPermitida('Erro ao atualizar tipo de transação. Tente novamente.');
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
            await deleteTipoDeTransacao(stateFormModal.uuid);
            toastCustom.ToastCustomSuccess('Remoção do tipo de transação efetuado com sucesso.', 'O tipo de transação foi removido do sistema com sucesso.')
            setShowModalForm(false);
            await carregaTodos();
        }catch (e) {
            if (e.response && e.response.data && e.response.data.mensagem){
                setMensagemModalInfoNaoPodeExcluir(e.response.data.mensagem);
                setShowModalInfoNaoPodeExcluir(true);
                console.log(e.response.data.mensagem)
            }else {
                setMensagemModalInfoNaoPodeExcluir('Erro ao deletar tipoa de transação. Tente novamente.');
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
            <h1 className="titulo-itens-painel mt-5">Tipos de transação</h1>
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
                        (listaDeTipos || []).length ? 
                        <>
                            
                            <p>Exibindo <span className='total-acoes'>{totalDeTipos}</span> tipo(s) de transação</p>
                            <Tabela
                                rowsPerPage={rowsPerPage}
                                lista={listaDeTipos}
                                temDocumentoTemplate={temDocumentoTemplate}
                                acoesTemplate={acoesTemplate}
                            />
                        </>
                        :
                        <MsgImgCentralizada
                            data-qa="imagem-lista-sem-tipos-documentos"
                            texto='Nenhum resultado encontrado.'
                            img={Img404}
                            dataQa=""
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
                            titulo="Excluir Tipo de Transação"
                            texto="<p>Deseja realmente excluir este tipo de transação?</p>"
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
