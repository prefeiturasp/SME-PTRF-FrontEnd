import React, {useCallback, useEffect, useState, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {
    getFornecedores,
    getFiltrosFornecedores,
    postCreateFornecedor,
    patchAlterarFornecedor,
    deleteFornecedor,
} from "../../../../../services/sme/Parametrizacoes.service";
import TabelaFornecedores from "./TabelaFornecedores";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import {Filtros} from "./Filtros";
import {BtnAddFornecedores} from "./BtnAddFornecedores";
import ModalFormFornecedores from "./ModalFormFornecedores";
import {ModalInfoNaoPermitido} from "./ModalInfoNaoPermitido";
import {ModalConfirmDeleteFornecedor} from "./ModalConfirmDeleteFornecedor";

export const Fornecedores = () =>{

    const [listaDeFornecedores, setListaDeFornecedores] = useState([])
    const [loading, setLoading] = useState(true);

    const carregaListaFornecedores = useCallback(async ()=>{
        setLoading(true);
        let lista_fornecedores = await getFornecedores()
        setListaDeFornecedores(lista_fornecedores)
        setLoading(false);
    }, [])

    useEffect(()=>{
        carregaListaFornecedores()
    }, [carregaListaFornecedores])

    // Quando a state de listaDeFornecedores sofrer alteração
    const totalDeFornecedores = useMemo(() => listaDeFornecedores.length, [listaDeFornecedores]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_nome: "",
        filtrar_por_cpf_cnpj: "",
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
        let tags_filtradas = await getFiltrosFornecedores(stateFiltros.filtrar_por_nome, stateFiltros.filtrar_por_cpf_cnpj);
        setListaDeFornecedores(tags_filtradas);
        setLoading(false);
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await carregaListaFornecedores();
        setLoading(false);
    };

    // TabelaFornecedores
    const rowsPerPage = 10;

    // Modal
    const initialStateFormModal = {
        id: "",
        nome: "",
        cpf_cnpj: "",
        uuid: "",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState('');
    const [showModalInfoNaoPermitido, setShowModalInfoNaoPermitido] = useState(false);
    const [showModalConfirmDeleteFornecedor, setShowModalConfirmDeleteFornecedor] = useState(false);

    const handleEditFormModalFornecedores = useCallback( async (rowData) =>{
        setStateFormModal({
            ...stateFormModal,
            nome: rowData.nome,
            cpf_cnpj: rowData.cpf_cnpj,
            uuid: rowData.uuid,
            id: rowData.id,
            operacao: 'edit',
        });
        setShowModalForm(true)
    }, [stateFormModal]);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditFormModalFornecedores(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    }, [handleEditFormModalFornecedores]);

    const handleSubmitModalFormFornecedores = useCallback(async (values)=>{
        let payload = {
            nome: values.nome,
            cpf_cnpj: values.cpf_cnpj,
        };

        if (values.operacao === 'create'){
            try{
                await postCreateFornecedor(payload);
                console.log('Fornecedor criado com sucesso');
                setShowModalForm(false);
                await carregaListaFornecedores();
            }catch (e) {
                console.log('Erro ao criar fornecedor ', e.response.data);
                if (e.response.data && e.response.data.cpf_cnpj && e.response.data.cpf_cnpj[0]) {
                    setErroExclusaoNaoPermitida(e.response.data.cpf_cnpj[0]);
                    setShowModalInfoNaoPermitido(true)
                } else {
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa operação.');
                    setShowModalInfoNaoPermitido(true)
                }
            }

        }else {
            try {
                await patchAlterarFornecedor(values.id, payload);
                console.log('Fornecedor alterado com sucesso');
                setShowModalForm(false);
                await carregaListaFornecedores();
            }catch (e) {
                console.log('Erro ao alterar fornecedor ', e.response.data);
                if (e.response.data && e.response.data.cpf_cnpj && e.response.data.cpf_cnpj[0]) {
                    setErroExclusaoNaoPermitida(e.response.data.cpf_cnpj[0]);
                    setShowModalInfoNaoPermitido(true)
                } else {
                    setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa operação.');
                    setShowModalInfoNaoPermitido(true)
                }
            }
            setLoading(false);
        }
    }, [carregaListaFornecedores]);

    const onDeleteFornecedorTrue = useCallback(async ()=>{
        setLoading(true);
        try {
            await deleteFornecedor(stateFormModal.id);
            console.log("Fornecedor excluído com sucesso");
            setShowModalConfirmDeleteFornecedor(false);
            setShowModalForm(false);
            await carregaListaFornecedores();
        }catch (e) {
            console.log('Erro ao excluir Fornecedor ', e.response.data);
            if (e.response.data && e.response.data.cpf_cnpj && e.response.data.cpf_cnpj[0]) {
                setErroExclusaoNaoPermitida(e.response.data.cpf_cnpj[0]);
                setShowModalInfoNaoPermitido(true)
            } else {
                setErroExclusaoNaoPermitida('Houve um erro ao tentar fazer essa operação.');
                setShowModalInfoNaoPermitido(true)
            }
        }
        setLoading(false);
    }, [stateFormModal, carregaListaFornecedores]);

    const handleCloseFormModal = useCallback(()=>{
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    }, [initialStateFormModal]);

    const handleCloseModalInfoNaoPermitido = useCallback(()=>{
        setShowModalInfoNaoPermitido(false);
    }, []);

    const handleCloseConfirmDeleteFornecedor = useCallback(()=>{
        setShowModalConfirmDeleteFornecedor(false)
    }, []);

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Fornecedores</h1>
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
                        <BtnAddFornecedores
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
                        <p>Exibindo <span className='total-acoes'>{totalDeFornecedores}</span> fornecedores</p>
                        <TabelaFornecedores
                            rowsPerPage={rowsPerPage}
                            listaDeFornecedores={listaDeFornecedores}
                            acoesTemplate={acoesTemplate}
                        />
                    </div>
                    <section>
                        <ModalFormFornecedores
                            show={showModalForm}
                            stateFormModal={stateFormModal}
                            handleClose={handleCloseFormModal}
                            handleSubmitModalFormFornecedores={handleSubmitModalFormFornecedores}
                            setShowModalConfirmDeleteFornecedor={setShowModalConfirmDeleteFornecedor}
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
                        <ModalConfirmDeleteFornecedor
                            show={showModalConfirmDeleteFornecedor}
                            handleClose={handleCloseConfirmDeleteFornecedor}
                            onDeleteFornecedorTrue={onDeleteFornecedorTrue}
                            titulo="Excluir Fornecedor"
                            texto="<p>Deseja realmente excluir este Fornecedor?</p>"
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