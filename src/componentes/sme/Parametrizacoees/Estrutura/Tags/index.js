import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodasTags, getFiltrosTags, postCreateTag} from "../../../../../services/sme/Parametrizacoes.service";
import TabelaTags from "./TabelaTags";
import {Filtros} from "./Filtros";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import ModalFormTags from "./ModalFormTags";
import {ModalInfoNaoPermitido} from "./ModalInfoNaoPermitido";
import {BtnAddTags} from "./BtnAddTags";

export const Tags = ()=>{

    const [count, setCount] = useState(0);
    const [listaDeTags, setListaDeTags] = useState([]);

    const carregaTodasAsTags = useCallback(async ()=>{
        let todas_tags = await getTodasTags();
        setListaDeTags(todas_tags);
        console.log('Todas as tags ', todas_tags)
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
        let tags_filtradas = await getFiltrosTags(stateFiltros.filtrar_por_nome, stateFiltros.filtrar_por_status);
        setListaDeTags(tags_filtradas);
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsTags();
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
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalInfoNaoPermitido, setShowModalInfoNaoPermitido] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState('');
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const handleEditFormModalTags = useCallback( async (rowData) =>{
        setStateFormModal({
            ...stateFormModal,
            nome: rowData.nome,
            status: rowData.status,
            uuid: rowData.uuid,
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
        console.log('handleSubmitModalFormTags ', values);

        let payload = {
            nome: values.nome,
            status: values.status,
        };

        if (values.operacao === 'create'){
            try{
                let criar_tag = await postCreateTag(payload);
                console.log("CRIAR ", criar_tag);
                console.log('Tag criada com sucesso');
                carregaTodasAsTags()
            }catch (e) {
                console.log('Erro ao criar tag ', e.response.data)
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Ja existe uma tag com esse nome');
                    setShowModalInfoNaoPermitido(true)
                } else {
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoNaoPermitido(true)
                }
            }
        }
    }, [carregaTodasAsTags]);

    const handleCloseFormModal = useCallback(()=>{
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    }, [initialStateFormModal]);

    const handleCloseModalInfoNaoPermitido = useCallback(()=>{
        setShowModalInfoNaoPermitido(false);
        setErroExclusaoNaoPermitida(false);
        //setShowModalConfirmDeletePeriodo(false)
    }, []);

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Etiquetas/Tags</h1>
            <div className="page-content-inner">
                <button onClick={()=>setCount(prevState => prevState+1)}>Count - {count}</button>
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
                />
            </section>
            <section>
                <ModalInfoNaoPermitido
                    show={showModalInfoNaoPermitido}
                    handleClose={handleCloseModalInfoNaoPermitido}
                    titulo="Exclusão não permitida"
                    texto={`<p class="mb-0"> ${erroExclusaoNaoPermitida}</p>`}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                />
            </section>
        </PaginasContainer>
    )
};