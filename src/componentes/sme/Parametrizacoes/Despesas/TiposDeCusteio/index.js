import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {
    getTodosTiposDeCusteio,
    getFiltrosTiposDeCusteio,
    postCreateTipoDeCusteio,
    patchAlterarTipoDeCusteio,
    deleteTipoDeCusteio,
} from "../../../../../services/sme/Parametrizacoes.service";
import Tabela from "./Tabela";
import {Filtros} from "./Filtros";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import ModalForm from "./ModalForm";
import {ModalInfoUpdateNaoPermitido} from "./ModalInfoUpdateNaoPermitido";
import {ModalConfirmDelete} from "./ModalConfirmDelete";
import {BtnAdd} from "./BtnAdd";
import Loading from "../../../../../utils/Loading";
import {ModalInfoNaoPodeExcluir} from "../../Estrutura/Acoes/ModalInfoNaoPodeExcluir";
import {toastCustom} from "../../../../Globais/ToastCustom";

export const TiposDeCusteio = ()=>{

    const [listaDeTipos, setListaDeTipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregaTodos = useCallback(async ()=>{
        setLoading(true);
        let todos = await getTodosTiposDeCusteio();
        setListaDeTipos(todos);
        setLoading(false);
    }, []);

    useEffect(()=>{
        carregaTodos()
    }, [carregaTodos]);

    // Quando a state da lista sofrer alteração
    const totalDeTipos = useMemo(() => listaDeTipos.length, [listaDeTipos]);

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
        let filtrados = await getFiltrosTiposDeCusteio(stateFiltros.filtrar_por_nome);
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

    // Modal
    const initialStateFormModal = {
        nome: "",
        uuid:"",
        id:"",
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
            nome: values.nome,
            status: values.status,
        };

        if (values.operacao === 'create'){
            try{
                await postCreateTipoDeCusteio(payload);
                toastCustom.ToastCustomSuccess('Inclusão de tipo de despesa de custeio realizado com sucesso.', 'O tipo de despesa de custeio foi adicionado ao sistema com sucesso.')
                setShowModalForm(false);
                await carregaTodos();
            }catch (e) {
                console.log('Erro ao criar Tipo de Despesa de Custeio ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Já existe um tipo de despesa de custeio com esse nome');
                    setShowModalInfoUpdateNaoPermitido(true)
                } else {
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar criar um tipo de despesa de custeio.');
                    setShowModalInfoUpdateNaoPermitido(true)
                }
            }

        }else {
            try {
                await patchAlterarTipoDeCusteio(values.uuid, payload);
                toastCustom.ToastCustomSuccess('Edição do tipo de despesa de custeio realizado com sucesso.', 'O tipo de despesa de custeio foi editado no sistema com sucesso.')
                setShowModalForm(false);
                await carregaTodos();
            }catch (e) {
                console.log('Erro ao alterar tipo de despesa de custeio ', e.response.data);
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Já existe um tipo de despesa de custeio com esse nome');
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
            await deleteTipoDeCusteio(stateFormModal.uuid);
            toastCustom.ToastCustomSuccess('Remoção do tipo de despesa de custeio efetuado com sucesso.', 'O tipo de despesa de custeio foi removido do sistema com sucesso.')
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
            <h1 className="titulo-itens-painel mt-5">Tipo de despesa de custeio</h1>
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
                        <p>Exibindo <span className='total-acoes'>{totalDeTipos}</span> tipo(s) de despesa de custeio</p>
                        <Tabela
                            rowsPerPage={rowsPerPage}
                            lista={listaDeTipos}
                            statusTemplate={statusTemplate}
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
                            titulo="Excluir Tipo de Despesa de Custeio"
                            texto="<p>Deseja realmente excluir este tipo de despesa de custeio?</p>"
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
