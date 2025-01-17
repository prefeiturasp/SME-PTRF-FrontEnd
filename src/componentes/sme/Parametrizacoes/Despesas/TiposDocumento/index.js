import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import ReactTooltip from "react-tooltip";
import {
    getTodosTiposDeDocumento,
    getFiltrosTiposDeDocumento,
    postCreateTipoDeDocumento,
    patchAlterarTipoDeDocumento,
    deleteTipoDeDocumento,
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
export const TiposDocumento = ()=>{

    const [listaDeTipos, setListaDeTipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregaTodos = useCallback(async ()=>{
        setLoading(true);
        let todos = await getTodosTiposDeDocumento();
        setListaDeTipos(todos);
        setLoading(false);
    }, []);

    useEffect(()=>{
        carregaTodos()
    }, [carregaTodos]);

    // Quando a state da lista sofrer alteração
    const totalDeTipos = useMemo(() => (listaDeTipos||[]).length, [listaDeTipos]);

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
        let filtrados = await getFiltrosTiposDeDocumento(stateFiltros.filtrar_por_nome);
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
    const statusTemplate = (rowData) => {
        return rowData.status && rowData.status === 'ATIVO' ? 'Ativo' : 'Inativo'
    };
    // const apenasDigitoTemplate = (rowData) => {
    //     // Apenas Dígitos
    //     return rowData.apenas_digitos ? 'Sim': 'Não'
    // }

    // Modal
    const initialStateFormModal = {
        nome: "",
        uuid:"",
        id:"",
        apenas_digitos: false,
        numero_documento_digitado: false,
        pode_reter_imposto: false,
        eh_documento_de_retencao_de_imposto: false,
        documento_comprobatorio_de_despesa: false,
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
            apenas_digitos: rowData.apenas_digitos,
            numero_documento_digitado: rowData.numero_documento_digitado,
            pode_reter_imposto: rowData.pode_reter_imposto,
            eh_documento_de_retencao_de_imposto: rowData.eh_documento_de_retencao_de_imposto,
            documento_comprobatorio_de_despesa: rowData.documento_comprobatorio_de_despesa,
            operacao: 'edit',
        });
        setShowModalForm(true)
    }, [stateFormModal]);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button data-qa="botao-editar-tipo-documento"
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
                await postCreateTipoDeDocumento(payload);
                toastCustom.ToastCustomSuccess('Inclusão de tipo de documento realizado com sucesso.', 'O tipo de documento foi adicionado ao sistema com sucesso.')
                setShowModalForm(false);
                await carregaTodos();
            }catch (e) {
                console.log('Erro ao criar Tipo de Documento ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Este tipo de documento já existe.');
                    setShowModalInfoUpdateNaoPermitido(true)
                } else {
                    console.log(e.response)
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoUpdateNaoPermitido(true)
                }
            }
        }else {
            try {
                await patchAlterarTipoDeDocumento(values.uuid, payload);
                toastCustom.ToastCustomSuccess('Edição do tipo de documento realizado com sucesso.', 'O tipo de documento foi editado no sistema com sucesso.')
                setShowModalForm(false);
                await carregaTodos();
            }catch (e) {
                console.log('Erro ao alterar tipo de documento ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Este tipo de documento já existe.');
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
            await deleteTipoDeDocumento(stateFormModal.uuid);
            toastCustom.ToastCustomSuccess('Remoção do tipo de documento efetuado com sucesso.', 'O tipo de documento foi removido do sistema com sucesso.')
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
            <h1 className="titulo-itens-painel mt-5">Tipo de documento</h1>
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
                        {
                            (listaDeTipos || []).length ? 
                            <>
                                <Filtros
                                    stateFiltros={stateFiltros}
                                    handleChangeFiltros={handleChangeFiltros}
                                    handleSubmitFiltros={handleSubmitFiltros}
                                    limpaFiltros={limpaFiltros}
                                />
                                <p>Exibindo <span className='total-acoes'>{totalDeTipos}</span> tipo(s) de documento</p>
                                <Tabela
                                    rowsPerPage={rowsPerPage}
                                    lista={listaDeTipos}
                                    statusTemplate={statusTemplate}
                                    acoesTemplate={acoesTemplate}
                                    // apenasDigitoTemplate={apenasDigitoTemplate}
                                />
                            </>
                        :
                            <MsgImgCentralizada
                                data-qa="imagem-lista-sem-tipos-documentos"
                                texto='Não existem tipos de documentos cadastrados, clique no botão "Adicionar tipo de documento" para começar.'
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
                            titulo="Excluir Tipo de Documento"
                            texto="<p>Deseja realmente excluir este tipo de documento?</p>"
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
