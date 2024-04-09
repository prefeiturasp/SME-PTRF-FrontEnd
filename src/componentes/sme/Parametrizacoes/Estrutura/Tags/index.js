import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {
    getTodasTags,
    getFiltrosTags,
    postCreateTag,
    patchAlterarTag,
    deleteTag,
} from "../../../../../services/sme/Parametrizacoes.service";
import TabelaTags from "./TabelaTags";
import {Filtros} from "./Filtros";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import ModalFormTags from "./ModalFormTags";
import {ModalInfoNaoPermitido} from "./ModalInfoNaoPermitido";
import {ModalConfirmDeleteTag} from "./ModalConfirmDeleteTag";
import {BtnAddTags} from "./BtnAddTags";
import Loading from "../../../../../utils/Loading";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const Tags = ()=>{

    const [listaDeTags, setListaDeTags] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregaTodasAsTags = useCallback(async ()=>{
        setLoading(true);
        let todas_tags = await getTodasTags();
        setListaDeTags(todas_tags);
        setLoading(false);
    }, []);

    useEffect(()=>{
        carregaTodasAsTags()
    }, [carregaTodasAsTags]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeTags = useMemo(() => listaDeTags.length, [listaDeTags]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_nome: "",
        filtrar_por_status: "",
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
        let tags_filtradas = await getFiltrosTags(stateFiltros.filtrar_por_nome, stateFiltros.filtrar_por_status);
        setListaDeTags(tags_filtradas);
        setLoading(false);
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsTags();
        setLoading(false);
    };

    // TabelaTags
    const rowsPerPage = 20;
    const statusTemplate = (rowData) => {
        return rowData.status && rowData.status === 'ATIVO' ? 'Ativo' : 'Inativo'
    };

    // Modal
    const initialStateFormModal = {
        nome: "",
        status: "",
        uuid:"",
        id:"",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalInfoNaoPermitido, setShowModalInfoNaoPermitido] = useState(false);
    const [showModalConfirmDeleteTag, setShowModalConfirmDeleteTag] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState('');
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const handleEditFormModalTags = useCallback( async (rowData) =>{
        setStateFormModal({
            ...stateFormModal,
            nome: rowData.nome,
            status: rowData.status,
            uuid: rowData.uuid,
            id: rowData.id,
            operacao: 'edit',
        });
        setShowModalForm(true)
    }, [stateFormModal]);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditFormModalTags(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    }, [handleEditFormModalTags]);

    const handleSubmitModalFormTags = useCallback(async (values)=>{
        let payload = {
            nome: values.nome,
            status: values.status,
        };

        if (values.operacao === 'create'){
            try{
                await postCreateTag(payload);
                toastCustom.ToastCustomSuccess('Inclusão de etiqueta/tag realizada com sucesso.', `A etiqueta/tag foi adicionada ao sistema com sucesso.`)
                console.log('Tag criada com sucesso');
                setShowModalForm(false);
                await carregaTodasAsTags();
            }catch (e) {
                toastCustom.ToastCustomError('Erro ao criar etiqueta/tag', `Não foi possível criar a etiqueta/tag`)
                console.log('Erro ao criar tag ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Ja existe uma tag com esse nome');
                    setShowModalInfoNaoPermitido(true)
                } else {
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoNaoPermitido(true)
                }
            }

        }else {
            try {
                await patchAlterarTag(values.uuid, payload);
                toastCustom.ToastCustomSuccess('Edição da etiqueta/tag realizado com sucesso.', `A etiqueta/tag foi editada no sistema com sucesso.`)
                console.log('Tag alterada com sucesso');
                setShowModalForm(false);
                await carregaTodasAsTags();
            }catch (e) {
                toastCustom.ToastCustomError('Erro ao atualizar etiqueta/tag', `Não foi possível atualizar a etiqueta/tag`)
                console.log('Erro ao alterar tag ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Ja existe uma tag com esse nome');
                    setShowModalInfoNaoPermitido(true);
                } else {
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoNaoPermitido(true);
                }
            }
            setLoading(false);
        }
    }, [carregaTodasAsTags]);

    const onDeleteTagTrue = useCallback(async ()=>{
        setLoading(true);
        try {
            await deleteTag(stateFormModal.uuid);
            toastCustom.ToastCustomSuccess('Remoção da etiqueta/tag efetuada com sucesso.', `A etiqueta/tag foi removida do sistema com sucesso.`)
            console.log("Tag excluída com sucesso");
            setShowModalConfirmDeleteTag(false);
            setShowModalForm(false);
            await carregaTodasAsTags();
        }catch (e) {
            toastCustom.ToastCustomError('Erro ao remover etiqueta/tag', `Não foi possível remover a etiqueta/tag`)
            console.log('Erro ao excluir tag ', e.response.data);
            setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa atualização.');
            setShowModalInfoNaoPermitido(true);
        }
        setLoading(false);
    }, [stateFormModal, carregaTodasAsTags]);

    const handleCloseFormModal = useCallback(()=>{
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    }, [initialStateFormModal]);

    const handleCloseModalInfoNaoPermitido = useCallback(()=>{
        setShowModalInfoNaoPermitido(false);
    }, []);
    
    const handleCloseConfirmDeleteTag = useCallback(()=>{
        setShowModalConfirmDeleteTag(false)
    }, []);

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Etiquetas/Tags</h1>
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
                        <BtnAddTags
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
                        <p>Exibindo <span className='total-acoes'>{totalDeTags}</span> etiquetas/tags</p>
                        <TabelaTags
                            rowsPerPage={rowsPerPage}
                            listaDeTags={listaDeTags}
                            statusTemplate={statusTemplate}
                            acoesTemplate={acoesTemplate}
                        />
                    </div>
                    <section>
                        <ModalFormTags
                            show={showModalForm}
                            stateFormModal={stateFormModal}
                            handleClose={handleCloseFormModal}
                            handleSubmitModalFormTags={handleSubmitModalFormTags}
                            setShowModalConfirmDeleteTag={setShowModalConfirmDeleteTag}
                        />
                    </section>
                    <section>
                        <ModalInfoNaoPermitido
                            show={showModalInfoNaoPermitido}
                            handleClose={handleCloseModalInfoNaoPermitido}
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
                        <ModalConfirmDeleteTag
                            show={showModalConfirmDeleteTag}
                            handleClose={handleCloseConfirmDeleteTag}
                            onDeleteTagTrue={onDeleteTagTrue}
                            titulo="Excluir Tag"
                            texto="<p>Deseja realmente excluir esta Tag?</p>"
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