import React, {memo, useState} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import { Formik, Field, Form } from "formik";
import {FormAcoesPDDEValidacao} from "./FormValidacao";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { usePostCategorias } from "./hooks/usePostCategorias";
import { usePatchCategorias } from "./hooks/usePatchCategorias";
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
    const initialStateFormCategoria = {id: 0, uuid: "", nome: "", pode_ser_excluida: true}
    const [stateFormCategoria, setStateFormCategoria] = useState(initialStateFormCategoria);
    const [mostrarCategoria, setMostrarCategoria] = useState(false);
    const [mostrarCategoriaErro, setMostrarCategoriaErro] = useState(false);
    const [corOk, setCorOk] = useState('#808080');
    const [corCancelar, setCorCancelar] = useState('#808080');
    const { mutationPost } = usePostCategorias(stateFormCategoria);
    const { mutationPatch } = usePatchCategorias(stateFormCategoria);
    const [showModalConfirmEditCategoria, setShowModalConfirmEditCategoria] = useState(false);
    const [showModalConfirmDeleteCategoria, setShowModalConfirmDeleteCategoria] = useState(false);

    const handleFecharFormCategoria = () => {
        setMostrarCategoria(false)
        setStateFormCategoria(initialStateFormCategoria)
        setMostrarCategoriaErro(false)
        setShowModalConfirmEditCategoria(false)
        setShowModalConfirmDeleteCategoria(false)
    };

    const { mutationDeleteCategoria } = useDeleteCategoria({
        categorias,
        stateFormCategoria,
        setModalForm,
        stateFormModal,
        handleFecharFormCategoria,
        setShowModalConfirmDeleteCategoria
    });

    const handleSelectCategoria = (categoria) => {
        if (stateFormModal.operacao === "edit"){
            const item = categorias.results.find(v => v.uuid == categoria) || initialStateFormCategoria
            console.log("item", item)
            setStateFormCategoria(item)
        }
    };

    const handleCriarEditarCategoria = (categoriaId) => {
        setMostrarCategoria(!mostrarCategoria);
        if (stateFormModal.operacao === "edit"){
            const categoria = categorias.results.find(categoria => categoria.uuid == categoriaId)
            setStateFormCategoria({
                uuid: categoria.uuid,
                nome: categoria.nome,
                id: categoria.id,
                pode_ser_excluida: categoria.pode_ser_excluida
            })
        }
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

    const excluirCategoria = () => {
        mutationDeleteCategoria.mutate({
            categoriaUuid: stateFormCategoria.uuid,
            acaoUuid: stateFormModal.uuid
        });
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
                                            <label htmlFor="programa">Programa *</label>
                                            <Field
                                                as="select"
                                                data-qa="input-categoria"
                                                onChange={(e)=>{
                                                    props.handleChange(e);
                                                    handleSelectCategoria(e.target.value);
                                                }}
                                                disabled={!props.values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                name="programa"
                                                id="programa"
                                                className="form-control"
                                            >
                                                <option data-qa="option-categoria-vazio" value=''>Selecione um programa</option>
                                                {categorias && categorias.results && categorias.results.length > 0 && categorias.results.map(item => (
                                                    <option data-qa={`option-categoria-${item.uuid}`} key={item.uuid} value={item.uuid}>{item.nome}</option>
                                                ))}
                                                
                                            </Field>
                                            {props.touched.programa && props.errors.programa && <span className="span_erro text-danger mt-1"> {props.errors.programa} </span>}
                                        </div>
                                    </div>
                                    
                                    <div className='col-1'>
                                        <div className="form-group">
                                            <label htmlFor="programa"></label>
                                            <button
                                                data-qa="btn-cancelar"
                                                data-testid="btn-adicionar-editar-categoria"
                                                onClick={() => handleCriarEditarCategoria(values.programa)}
                                                type="button"
                                                className={`btn btn${!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES ? "-outline-secondary": "-success"} mt-2 mr-2`}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
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
                                            <label htmlFor="nova_categoria">{stateFormModal.operacao === "create" ? "Adicionar novo" : "Editar"} Programa</label>
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
                                                        data-testid="btn-confirmar-editar-adicionar-categoria"
                                                        style={{fontSize: '22px', marginRight: "15px", color: corOk, cursor: "pointer"}}
                                                        icon={faCheck}
                                                        onClick={() => setShowModalConfirmEditCategoria(true)}
                                                        onMouseEnter={() => setCorOk('#297805')}
                                                        onMouseLeave={() => setCorOk('#808080')}
                                                        data-tip={stateFormModal.categoria ? "Editar programa" : "Adicionar novo programa"} data-for="tooltip-id-salvar"
                                                    />
                                                    <ReactTooltip id="tooltip-id-cancelar"/>
                                                    <FontAwesomeIcon
                                                        data-testid="btn-cancelar-editar-adicionar-categoria"
                                                        style={{fontSize: '22px', marginRight: "15px", color: corCancelar, cursor: "pointer"}}
                                                        icon={faXmark}
                                                        onClick={handleFecharFormCategoria}
                                                        onMouseEnter={() => setCorCancelar('#FF0000')}
                                                        onMouseLeave={() => setCorCancelar('#808080')}
                                                        data-tip="Cancelar" data-for="tooltip-id-cancelar"
                                                    />
                                                 </div>
                                            </div>
                                            {mostrarCategoriaErro && <span className="span_erro text-danger mt-1"> Programa é obrigatório </span>}
                                        </div>
                                    </div>
                                    <div className='col-1'>
                                    { mostrarCategoria && stateFormModal.operacao === "edit" &&
                                        <div className="form-group">
                                            <label htmlFor="programa"></label>
                                            <button
                                                data-qa="btn-cancelar"
                                                onClick={() => setShowModalConfirmDeleteCategoria(true)}
                                                type="button"
                                                className={`btn btn-light-rose mt-2 mr-2`}
                                                data-testid="btn-excluir-categoria"
                                                disabled={!stateFormCategoria.pode_ser_excluida}
                                            >
                                            <ReactTooltip id="tooltip-id-excluir"/>
                                            <FontAwesomeIcon
                                                data-tip={stateFormCategoria.pode_ser_excluida ? "Excluir" : "Não é possível excluir. Este programa ainda está vinculado a alguma ação."} data-for="tooltip-id-excluir"
                                                icon={faTrashCan} 
                                                style={{color: "#B40C02"}}
                                            />
                                            </button>
                                        </div>
                                    }
                                    </div>
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
                                        <p className="mb-0">Aceita livre aplicação? *</p>
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
                                                Excluir
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
                                                data-testid="btn-salvar-acao"
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
                                    okText={stateFormModal.programa ? "Editar" : "Adicionar"}
                                    okButtonProps={"btn-base-verde btn-editar-adicionar-categoria"}
                                    onCancel={() => setShowModalConfirmEditCategoria(false)}
                                    cancelText="Cancelar"
                                    cancelButtonProps={"btn-base-verde-outline btn-editar-adicionar-categoria-cancelar"}
                                    titulo={`${stateFormModal.programa ? "Editar" : "Adicionar"} Programa de Ação PDDE`}
                                    bodyTexto={`<p>Tem certeza que deseja ${stateFormModal.programa ? "editar" : "adicionar"} esse Programa de Ação PDDE?</p>`}
                                    iconeAviso={IconeAvisoConfirmacao}
                                />
                                {/* Modal de Exclusao da Categoria */}
                                <ModalConfirmar
                                    open={showModalConfirmDeleteCategoria}
                                    onOk={excluirCategoria}
                                    okText="Excluir"
                                    okButtonProps={"btn-danger btn-excluir-categoria-moda"}
                                    onCancel={() => setShowModalConfirmDeleteCategoria(false)}
                                    cancelText="Cancelar"
                                    cancelButtonProps={"btn-base-verde-outline btn-excluir-categoria-modal-cancelar"}
                                    titulo="Excluir Programa de Ação PDDE"
                                    bodyText={<p>Tem certeza que deseja excluir esse Programa de Ação PDDE?</p>}
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
