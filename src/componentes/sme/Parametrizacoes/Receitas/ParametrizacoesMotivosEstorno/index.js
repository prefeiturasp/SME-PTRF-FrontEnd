import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import Loading from "../../../../../utils/Loading";
import {Filtros} from "./Filtros";
import {
    getMotivosEstorno,
    getFiltrosMotivosEstorno,
    postCreateMotivoEstorno,
    patchAlterarMotivoEstorno,
    deleteMotivoEstorno
} from "../../../../../services/sme/Parametrizacoes.service";
import ModalForm from "./ModalForm";
import {toastCustom} from "../../../../Globais/ToastCustom";
import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";
import { IconButton, Tabela } from "../../../../Globais/UI";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg"

const initialStateFiltros = {
    filtrar_por_nome: "",
};

const initialStateFormModal = {
    motivo: "",
    uuid:"",
    id:"",
    operacao: 'create',
};

export const ParametrizacoesMotivosDeEstorno = ()=>{
    const [listaMotivos, setListaMotivos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalInfoUpdateNaoPermitido, setShowModalInfoUpdateNaoPermitido] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState('');
    const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
    const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const totalDeMotivos = useMemo(() => listaMotivos?.length ?? 0, [listaMotivos]);
    const rowsPerPage = 20;

    const carregaLista = useCallback(async ()=>{
        setLoading(true);
        let motivos = await getMotivosEstorno();
        setListaMotivos(motivos);
        setLoading(false);
    }, []);

    useEffect(()=>{
        carregaLista()
    }, [carregaLista]);

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        setLoading(true);
        let filtrados = await getFiltrosMotivosEstorno(stateFiltros.filtrar_por_nome);
        setListaMotivos(filtrados);
        setLoading(false);
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await carregaLista();
        setLoading(false);
    };

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
            <IconButton
                icon="faEdit"
                iconProps={{style: {fontSize: '20px', marginRight: "0", color: "#00585E"}}}
                onClick={()=>handleEditFormModal(rowData)}
            />
        )
    }, [handleEditFormModal]);

    const handleSubmitModalForm = useCallback(async (values)=>{
        let payload = {
            motivo: values.motivo,
        };

        try {
            if (values.operacao === 'create') {
                await postCreateMotivoEstorno(payload);
                toastCustom.ToastCustomSuccess(
                    'Inclusão de motivo de estorno realizado com sucesso.',
                    'O motivo do estorno foi adicionado ao sistema com sucesso.'
                );
            } else {
                await patchAlterarMotivoEstorno(values.uuid, payload);
                toastCustom.ToastCustomSuccess(
                    'Edição do motivo de estorno realizado com sucesso.',
                    'O motivo de estorno foi editado no sistema com sucesso.'
                );
            }
    
            setShowModalForm(false);
            await carregaLista();
    
        } catch (e) {
            const errorMsg = e.response.data?.non_field_errors 
            ? 'Já existe um motivo de estorno com esse nome' 
            : 'Houve um erro ao tentar fazer essa atualização.';
            setErroExclusaoNaoPermitida(errorMsg);
            setShowModalInfoUpdateNaoPermitido(true);
        } finally {
            setLoading(false);
        }
    }, [carregaLista]);


    const onDelete = useCallback(async ()=>{
        setLoading(true);
        try {
            setShowModalConfirmDelete(false);
            await deleteMotivoEstorno(stateFormModal.uuid);
            toastCustom.ToastCustomSuccess('Remoção do motivo de estorno efetuado com sucesso.', 'O motivo de estorno foi removido do sistema com sucesso.')
            setShowModalForm(false);
            await carregaLista();
        }catch (e) {
            if (e.response && e.response.data && e.response.data.mensagem){
                setMensagemModalInfoNaoPodeExcluir(e.response.data.mensagem);
                setShowModalInfoNaoPodeExcluir(true);
            }else {
                setMensagemModalInfoNaoPodeExcluir('Houve um erro ao tentar fazer essa atualização.');
                setShowModalInfoNaoPodeExcluir(true);
            }
        }
        setLoading(false);
    }, [stateFormModal, carregaLista]);

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
            <h1 className="titulo-itens-painel mt-5">Motivos de estorno</h1>
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
                        <div className="d-flex  justify-content-end pb-4 mt-2">
                            <IconButton
                                icon="faPlus"
                                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                                label="Adicionar motivo de estorno"
                                onClick={() => {
                                    setStateFormModal(initialStateFormModal);
                                    setShowModalForm(true);
                                }}
                                variant="success"
                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            />
                        </div>
                        
                        <Filtros
                            stateFiltros={stateFiltros}
                            handleChangeFiltros={handleChangeFiltros}
                            handleSubmitFiltros={handleSubmitFiltros}
                            limpaFiltros={limpaFiltros}
                        />
                        {
                            (listaMotivos || []).length ?
                            <>
                                <p>Exibindo <span className='total-acoes'>{totalDeMotivos}</span> motivo(s) de estorno</p>
                                <Tabela
                                    rowsPerPage={rowsPerPage}
                                    lista={listaMotivos}
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
                        <ModalBootstrap
                            show={showModalInfoUpdateNaoPermitido}
                            onHide={handleCloseModalInfoUpdateNaoPermitido}
                            primeiroBotaoOnclick={handleCloseModalInfoUpdateNaoPermitido}
                            titulo={
                                stateFormModal.operacao === 'create' ? 'Inclusão não permitida' :
                                    stateFormModal.operacao === 'edit' ? 'Alteração não permitida' :
                                        'Exclusão não permitida'
                            }
                            bodyText={`<p class="mb-0"> ${erroExclusaoNaoPermitida}</p>`}
                            primeiroBotaoTexto="Fechar"
                            primeiroBotaoCss="success"
                        />
                    </section>
                    <section>
                        <ModalBootstrap
                            show={showModalInfoNaoPodeExcluir}
                            onHide={handleCloseInfoNaoPodeExcluir}
                            primeiroBotaoOnclick={handleCloseInfoNaoPodeExcluir}
                            titulo="Exclusão não permitida"
                            bodyText={mensagemModalInfoNaoPodeExcluir}
                            primeiroBotaoTexto="Fechar"
                            primeiroBotaoCss="success"
                        />
                    </section>
                    <section>
                        <ModalBootstrap
                            show={showModalConfirmDelete}
                            onHide={handleCloseConfirmDelete}
                            segundoBotaoOnclick={onDelete}
                            titulo="Excluir Motivo de Estorno"
                            bodyText="<p>Deseja realmente excluir este motivo de estorno?</p>"
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
}