import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import Loading from "../../../../../utils/Loading";
import {BtnAdd} from "./BtnAdd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Filtros} from "./Filtros";
import {
    getMotivosEstorno,
    getFiltrosMotivosEstorno,
    postCreateMotivoEstorno,
    patchAlterarMotivoEstorno,
    deleteMotivoEstorno
} from "../../../../../services/sme/Parametrizacoes.service";
import Tabela from "./Tabela";
import ModalForm from "./ModalForm";
import {ModalInfoUpdateNaoPermitido} from "./ModalInfoUpdateNaoPermitido";
import {ModalInfoNaoPodeExcluir} from "./ModalInfoNaoPodeExcluir";
import {ModalConfirmDelete} from "./ModalConfirmDelete";

export const ParametrizacoesMotivosDeEstorno = ()=>{
    const [listaMotivos, setListaMotivos] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Filtros
    const initialStateFiltros = {
        filtrar_por_nome: "",
    };
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    
    
    // Modal
    const initialStateFormModal = {
        motivo: "",
        uuid:"",
        id:"",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalInfoUpdateNaoPermitido, setShowModalInfoUpdateNaoPermitido] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState('');
    const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
    const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");
    

    // Quando a state da lista sofrer alteração
    const totalDeMotivos = useMemo(() => listaMotivos.length, [listaMotivos]);
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


    // filtros
    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        setLoading(true);
        let filtrados = await getFiltrosMotivosEstorno(stateFiltros.filtrar_por_nome);
        console.log(stateFiltros.filtrar_por_nome)
        setListaMotivos(filtrados);
        setLoading(false);
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await carregaLista();
        setLoading(false);
    };


    // tabela
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
                <button className="btn-editar-membro" onClick={()=>handleEditFormModal(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    }, [handleEditFormModal]);

    const handleSubmitModalForm = useCallback(async (values)=>{
        let payload = {
            motivo: values.motivo,
        };

        if (values.operacao === 'create'){
            try{
                await postCreateMotivoEstorno(payload);
                console.log('Motivo de estorno criado com sucesso');
                setShowModalForm(false);
                await carregaLista();
            }catch (e) {
                console.log('Erro ao criar motivo de estorno ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Ja existe um motivo de estorno com esse nome');
                    setShowModalInfoUpdateNaoPermitido(true)
                } else {
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoUpdateNaoPermitido(true)
                }
            }

        }else {
            try {
                await patchAlterarMotivoEstorno(values.uuid, payload);
                console.log('Motivo de estorno alterado com sucesso');
                setShowModalForm(false);
                await carregaLista();
            }catch (e) {
                console.log('Erro ao alterar motivo de estorno ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Ja existe um motivo de estorno com esse nome');
                    setShowModalInfoUpdateNaoPermitido(true);
                } else {
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa atualização.');
                    setShowModalInfoUpdateNaoPermitido(true);
                }
            }
            setLoading(false);
        }
    }, [carregaLista]);


    const onDeleteTrue = useCallback(async ()=>{
        setLoading(true);
        try {
            setShowModalConfirmDelete(false);
            await deleteMotivoEstorno(stateFormModal.uuid);
            console.log("Motivo de estorno excluído com sucesso");
            setShowModalForm(false);
            await carregaLista();
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
    }, [stateFormModal, carregaLista]);


    // controladores modais

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
                        <p>Exibindo <span className='total-acoes'>{totalDeMotivos}</span> motivo(s) de estorno</p>
                        <Tabela
                            rowsPerPage={rowsPerPage}
                            lista={listaMotivos}
                            acoesTemplate={acoesTemplate}
                        />
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
                            titulo="Excluir Motivo de Estorno"
                            texto="<p>Deseja realmente excluir este motivo de estorno?</p>"
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