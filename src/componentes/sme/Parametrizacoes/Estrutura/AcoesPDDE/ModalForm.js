import React, {memo, useState} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik, Field, Form } from "formik";
import {FormAcoesPDDEValidacao} from "./FormValidacao";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { usePostCategorias } from "./hooks/usePostCategorias";
import { usePatchCategorias } from "./hooks/usePatchCategorias";
import { useGetCategorias } from "./hooks/useGetCategorias";
import { useDeleteCategoria } from "./hooks/useDeleteCategoriaAcaoPDDE";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus, faCheck, faXmark, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import {ModalConfirmarExclusao as ModalConfirmar} from "../../componentes/ModalConfirmarExclusao";
import IconeAvisoConfirmacao from "../../../../../assets/img/icone-modal-confirmacao.svg"


const ModalForm = ({
    show, 
    stateFormModal,
    setModalForm,
    categorias,
    onSubmit,  
    onHandleClose,
    setShowModalConfirmDelete,
}) => {

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const initialStateFormCategoria = {id: 0, uuid: "", nome: ""}
    const [stateFormCategoria, setStateFormCategoria] = useState(initialStateFormCategoria);
    const [mostrarCategoria, setMostrarCategoria] = useState(false);
    const [mostrarCategoriaErro, setMostrarCategoriaErro] = useState(false);
    const [corOk, setCorOk] = useState('#808080');
    const [corCancelar, setCorCancelar] = useState('#808080');
    const { mutationPost } = usePostCategorias(stateFormCategoria);
    const { mutationPatch } = usePatchCategorias(stateFormCategoria);
    const { mutationDeleteCategoria, isSuccessDelete } = useDeleteCategoria();
    const [showModalConfirmEditCategoria, setShowModalConfirmEditCategoria] = useState(false);
    const [showModalConfirmDeleteCategoria, setShowModalConfirmDeleteCategoria] = useState(false);

    const handleSelectCategoria = (categoria) => {
        if (stateFormModal.operacao === "edit"){
            const item = categorias.results.find(v => v.id == categoria) || initialStateFormCategoria
            setStateFormCategoria(item)
        }
    };

    const handleCriarEditarCategoria = (categoriaId) => {
        setMostrarCategoria(!mostrarCategoria);
        if (stateFormModal.operacao === "edit"){
            const categoria = categorias.results.find(categoria => categoria.id == categoriaId)
            setStateFormCategoria({
                uuid: categoria.uuid,
                nome: categoria.nome,
                id: categoria.id
            })
        }
    };

    const handleFecharFormCategoria = () => {
        setMostrarCategoria(false)
        setStateFormCategoria(initialStateFormCategoria)
        setMostrarCategoriaErro(false)
        setShowModalConfirmEditCategoria(false)
        setShowModalConfirmDeleteCategoria(false)
    };

    const salvarFormCategoria = () => {
        if (!stateFormCategoria.nome){
            setMostrarCategoriaErro(true)
            return
        }
        const payload = {nome: stateFormCategoria.nome}
        if (stateFormCategoria.uuid) {
            mutationPatch.mutate({uuid: stateFormCategoria.uuid, payload: payload})
        }
        else{
            mutationPost.mutate({payload: payload})
        }
        handleFecharFormCategoria();
    };

    const excluirCategoria = (setFieldValue) => {
        mutationDeleteCategoria.mutate({categoriaUuid: stateFormCategoria.uuid, acaoUuid: stateFormModal.uuid});
        if (isSuccessDelete){
            const categoria = stateFormModal.categoria != stateFormCategoria.id ? String(stateFormModal.categoria) : String(categorias.results[0].id)
            setModalForm({...stateFormModal, categoria})
            setFieldValue("categoria", categoria)
            handleFecharFormCategoria();
        }
    };

    const handleChangeFormCategoria = (name, value) => {
        setStateFormCategoria({
            ...stateFormCategoria,
            [name]: value
        });
    };

    const categoriaIconeTemplate = (operacao) => {
        const iconeEditar = <FontAwesomeIcon icon={faPencil} style={{color: "#ccc"}}/>
        return operacao === "create" ? "+" : iconeEditar
    };

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={FormAcoesPDDEValidacao}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                        } = props;
                        return(
                            <Form>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p className='text-right mb-2'><strong>* Preenchimento obrigatório</strong></p>
                                    </div>
                                    <div className='col-5'>
                                        <div className="form-group">
                                            <label htmlFor="nome">Nome *</label>
                                            <Field
                                                data-qa="input-nome"
                                                type="text"
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!props.values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="categoria">Categoria *</label>
                                            <Field
                                                as="select"
                                                data-qa="input-categoria"
                                                onChange={(e)=>{
                                                    props.handleChange(e);
                                                    handleSelectCategoria(e.target.value);
                                                }}
                                                disabled={!props.values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                name="categoria"
                                                id="categoria"
                                                className="form-control"
                                            >
                                                <option data-qa="option-categoria-vazio" value=''>Selecione uma categoria</option>
                                                {categorias && categorias.results && categorias.results.length > 0 && categorias.results.map(item => (
                                                    <option data-qa={`option-categoria-${item.id}`} key={item.id} value={item.id}>{item.nome}</option>
                                                ))}
                                                
                                            </Field>
                                            {props.touched.categoria && props.errors.categoria && <span className="span_erro text-danger mt-1"> {props.errors.categoria} </span>}
                                        </div>
                                    </div>
                                    
                                    <div className='col-1'>
                                            <div className="form-group">
                                                <label htmlFor="categoria"></label>
                                                <button
                                                    data-qa="btn-cancelar"
                                                    onClick={() => handleCriarEditarCategoria(values.categoria)}
                                                    type="button"
                                                    className={`btn btn${!values.categoria ? "-outline-secondary": "-success"} mt-2 mr-2`}
                                                    disabled={!values.categoria}
                                                >
                                                {categoriaIconeTemplate(stateFormModal.operacao)}
                                                </button>
                                            </div>
                                    </div>
                                    
                                </div>
                                { mostrarCategoria &&
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="nova_categoria">{stateFormModal.operacao === "create" ? "Adicionar nova" : "Editar"} Categoria</label>
                                            <div className="d-flex">
                                                <div className="flex-grow-1">
                                                    <Field
                                                        data-qa="input-nova-categoria"
                                                        type="text"
                                                        value={stateFormCategoria.nome}
                                                        name="nova_categoria"
                                                        id="nova_categoria"
                                                        className="form-control"
                                                        onChange={(e) => handleChangeFormCategoria("nome", e.target.value)}
                                                        disabled={!props.values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                    />
                                                </div>
                                                <div className="py-2" style={{marginLeft: '-4rem'}}>
                                                    <ReactTooltip id="tooltip-id-salvar"/>
                                                    <FontAwesomeIcon
                                                        style={{fontSize: '22px', marginRight: "15px", color: corOk, cursor: "pointer"}}
                                                        icon={faCheck}
                                                        onClick={() => setShowModalConfirmEditCategoria(true)}
                                                        onMouseEnter={() => setCorOk('#297805')}
                                                        onMouseLeave={() => setCorOk('#808080')}
                                                        data-tip={stateFormModal.categoria ? "Editar categoria" : "Adicionar nova categoria"} data-for="tooltip-id-salvar"
                                                    />
                                                    <ReactTooltip id="tooltip-id-cancelar"/>
                                                    <FontAwesomeIcon
                                                        style={{fontSize: '22px', marginRight: "15px", color: corCancelar, cursor: "pointer"}}
                                                        icon={faXmark}
                                                        onClick={handleFecharFormCategoria}
                                                        onMouseEnter={() => setCorCancelar('#FF0000')}
                                                        onMouseLeave={() => setCorCancelar('#808080')}
                                                        data-tip="Cancelar" data-for="tooltip-id-cancelar"
                                                    />
                                                 </div>
                                            </div>
                                            {mostrarCategoriaErro && <span className="span_erro text-danger mt-1"> Categoria é obrigatório </span>}
                                        </div>
                                    </div>
                                    {/* { stateFormModal.categoria && stateFormModal.categoria == values.categoria && */}
                                    { mostrarCategoria &&
                                    <div className='col-1'>
                                        <div className="form-group">
                                            <label htmlFor="categoria"></label>
                                            <button
                                                data-qa="btn-cancelar"
                                                onClick={() => setShowModalConfirmDeleteCategoria(true)}
                                                type="button"
                                                className={`btn btn-light-rose mt-2 mr-2`}
                                            >
                                            <FontAwesomeIcon icon={faTrashCan} style={{color: "#B40C02"}}/>
                                            </button>
                                        </div>
                                    </div>
                                    }
                                        
                                </div>
                                }
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <p className="mb-0">Aceita capital? *</p>
                                            <div className="form-check form-check-inline mt-2">
                                                <input
                                                    name="aceita_capital_true"
                                                    className={`form-check-input`}
                                                    type="radio"
                                                    id="aceita_capital_true"
                                                    value="True"
                                                    checked={values.aceita_capital === true}
                                                    onChange={() => setFieldValue("aceita_capital", true)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />
                                                <label className="form-check-label" htmlFor="aceita_capital_true">Sim</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    name="aceita_capital_false"
                                                    className={`form-check-input`}
                                                    type="radio"
                                                    id="aceita_capital_false"
                                                    value="False"
                                                    checked={values.aceita_capital === false}
                                                    onChange={() => setFieldValue("aceita_capital", false)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />
                                                <label className="form-check-label" htmlFor="aceita_capital_false">Não</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                        <p className="mb-0">Aceita custeio? *</p>
                                            <div className="form-check form-check-inline mt-2">
                                                <input
                                                    name="aceita_custeio_true"
                                                    className={`form-check-input`}
                                                    type="radio"
                                                    id="aceita_custeio_true"
                                                    value="True"
                                                    checked={values.aceita_custeio === true}
                                                    onChange={() => setFieldValue("aceita_custeio", true)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />
                                                <label className="form-check-label" htmlFor="aceita_custeio_true">Sim</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    name="aceita_custeio_false"
                                                    className={`form-check-input`}
                                                    type="radio"
                                                    id="aceita_custeio_false"
                                                    value="False"
                                                    checked={values.aceita_custeio === false}
                                                    onChange={() => setFieldValue("aceita_custeio", false)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />
                                                <label className="form-check-label" htmlFor="aceita_custeio_false">Não</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                        <p className="mb-0">Aceita livre apliacação? *</p>
                                            <div className="form-check form-check-inline mt-2">
                                                <input
                                                    name="aceita_livre_aplicacao_true"
                                                    className={`form-check-input`}
                                                    type="radio"
                                                    id="aceita_livre_aplicacao_true"
                                                    value="True"
                                                    checked={values.aceita_livre_aplicacao === true}
                                                    onChange={() => setFieldValue("aceita_livre_aplicacao", true)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />
                                                <label className="form-check-label" htmlFor="aceita_livre_aplicacao_true">Sim</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    name="aceita_livre_aplicacao_false"
                                                    className={`form-check-input`}
                                                    type="radio"
                                                    id="aceita_livre_aplicacao_false"
                                                    value="False"
                                                    checked={values.aceita_livre_aplicacao === false}
                                                    onChange={() => setFieldValue("aceita_livre_aplicacao", false)}
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                />
                                                <label className="form-check-label" htmlFor="aceita_livre_aplicacao_false">Não</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className='row mt-3'>
                                    <div className='col'>
                                        <p className='mb-2'>ID</p>
                                        <p className='mb-2'>{values.id}</p>
                                    </div>
                                </div>

                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {values.operacao === 'edit' && values.editavel ? (
                                            <button
                                                data-qa="btn-apagar-acao-pdde"
                                                onClick={()=>setShowModalConfirmDelete(true)}
                                                type="button"
                                                className="btn btn btn-danger mt-2 mr-2"
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            >
                                                Apagar
                                            </button>
                                        ): null}
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button
                                            data-qa="btn-cancelar"
                                            onClick={() => {
                                                onHandleClose();
                                                handleFecharFormCategoria();
                                            }}
                                            type="button"
                                            className={`btn btn${values.editavel ? '-outline-success' : '-success'} mt-2 mr-2`}
                                        >
                                            {values.editavel ? 'Cancelar' : 'Voltar'}
                                        </button>
                                    </div>
                                    {values.operacao === 'create' || (values.operacao === 'edit' && values.editavel) ? (
                                        <div className="p-Y bd-highlight">
                                            <button
                                                data-qa="btn-salvar"
                                                type="submit"
                                                className="btn btn btn-success mt-2"
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    ):null}
                                </div>
                                {/* Modal de Edição/Adição da Categoria */}
                                <ModalConfirmar
                                    open={showModalConfirmEditCategoria}
                                    onOk={salvarFormCategoria}
                                    okText={stateFormModal.categoria ? "Editar" : "Adicionar"}
                                    okButtonProps={{className: "btn-base-verde"}}
                                    onCancel={() => setShowModalConfirmEditCategoria(false)}
                                    cancelText="Cancelar"
                                    cancelButtonProps={{className: "btn-base-verde-outline"}}
                                    titulo={`${stateFormModal.categoria ? "Editar" : "Adicionar"} Categoria de Ação PDDE`}
                                    bodyTexto={`<p>Tem certeza que deseja ${stateFormModal.categoria ? "editar" : "adicionar"} essa Categoria de Ação PDDE?</p>`}
                                    iconeAviso={IconeAvisoConfirmacao}
                                />
                                {/* Modal de Exclusao da Categoria */}
                                <ModalConfirmar
                                    open={showModalConfirmDeleteCategoria}
                                    onOk={() => excluirCategoria(setFieldValue)}
                                    okText="Excluir"
                                    okButtonProps={{className: "btn-danger"}}
                                    onCancel={() => setShowModalConfirmDeleteCategoria(false)}
                                    cancelText="Cancelar"
                                    cancelButtonProps={{className: "btn-base-verde-outline"}}
                                    titulo="Excluir Categoria de Ação PDDE"
                                    bodyText={<p>Tem certeza que deseja excluir essa Categoria de Ação PDDE?</p>}
                                />
                            </Form>
                        );
                    }}
                </Formik>
            </>
        )
    };

    return (
        <>
            <ModalFormBodyText
                show={show}
                titulo={stateFormModal && !stateFormModal.editavel ? 'Visualizar Ação PDDE' : stateFormModal && stateFormModal.operacao === 'edit' ? 'Editar Ação PDDE' : 'Adicionar Ação PDDE'}
                onHide={() => {
                    onHandleClose();
                    handleFecharFormCategoria();
                }}
                size='lg'
                bodyText={bodyTextarea()}
            />
        </>
    )
};

export default memo(ModalForm)
