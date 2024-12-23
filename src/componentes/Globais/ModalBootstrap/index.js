import React, {Fragment} from "react";
import {Button, Modal} from "react-bootstrap";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./modal-bootstrap.scss"

export const ModalBootstrap = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size={
                    propriedades.size
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div dangerouslySetInnerHTML={
                        {__html: propriedades.bodyText}
                    }/>
                </Modal.Body>
                <Modal.Footer>
                    <Button data-qa={propriedades && propriedades.dataQa ? `${propriedades.dataQa}-btn-${propriedades.primeiroBotaoTexto}` : ""} variant={
                            propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            propriedades.primeiroBotaoOnclick
                    }>
                        {
                        propriedades.primeiroBotaoTexto
                    } </Button>
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button data-qa={propriedades && propriedades.dataQa ? `${propriedades.dataQa}-btn-${propriedades.segundoBotaoTexto}` : ""} variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapAcoesExtras = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size={
                    propriedades.size
                }
                >
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <div className="p-3" dangerouslySetInnerHTML={
                        {__html: propriedades.bodyText}
                    }/>
                    {propriedades.bodyActions && propriedades.bodyActions.length ? (
                        <div className="d-flex justify-content-center mt-1 mb-3">
                            {propriedades.bodyActions.map((_action, index) => {
                                return (
                                    <Button 
                                        key={index}
                                        variant='success' 
                                        onClick={() => _action.callback()}
                                        style={{margin: '0 0.2rem'}}
                                    >
                                        {_action.title}
                                    </Button>                            
                                )
                            })}
                        </div>
                    ) : null }
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant={propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"}
                        onClick={propriedades.primeiroBotaoOnclick}
                        data-qa={propriedades && propriedades.dataQa ? `btn-${propriedades.primeiroBotaoTexto}-${propriedades.dataQa}` : ""}
                    >
                        {propriedades.primeiroBotaoTexto} 
                    </Button>
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button 
                            variant={propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"}
                            onClick={propriedades.segundoBotaoOnclick}
                            data-qa={propriedades && propriedades.dataQa ? `btn-${propriedades.segundoBotaoTexto}-${propriedades.dataQa}` : ""}
                        >
                            {propriedades.segundoBotaoTexto} 
                        </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapReverConciliacao = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                            propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            propriedades.primeiroBotaoOnclick
                    }>
                        {
                        propriedades.primeiroBotaoTexto
                    } </Button>
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button disabled={
                                propriedades.segundoBotaoDisable
                            }
                            variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapSaldoInsuficiente = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    {
                        propriedades.aceitarLancamento && 
                            <Button data-qa={`modal-saldo-insuficiente-btn-${propriedades.primeiroBotaoTexto}`} variant={propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"}
                                onClick={
                                    propriedades.primeiroBotaoOnclick
                                }
                            >
                                {propriedades.primeiroBotaoTexto} 
                            </Button>
                    }

                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button data-qa={`modal-saldo-insuficiente-btn-${propriedades.segundoBotaoTexto}`} disabled={
                                propriedades.segundoBotaoDisable
                            }
                            variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapSaldoInsuficienteDaconta = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer> {
                    propriedades.aceitarLancamento && <Button data-qa={`modal-saldo-insuficiente-conta-btn-${propriedades.primeiroBotaoTexto}`} variant={
                            propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            propriedades.primeiroBotaoOnclick
                    }>
                        {
                        propriedades.primeiroBotaoTexto
                    } </Button>
                }
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button data-qa={`modal-saldo-insuficiente-conta-btn-${propriedades.segundoBotaoTexto}`} disabled={
                                propriedades.segundoBotaoDisable
                            }
                            variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapEditarAta = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size="lg">
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                            propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            propriedades.primeiroBotaoOnclick
                    }>
                        {
                        propriedades.primeiroBotaoTexto
                    } </Button>
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button disabled={
                                propriedades.segundoBotaoDisable
                            }
                            variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormMembros = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormMeusDadosEmail = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormMeusDadosSenha = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size="lg">
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormExcluirTecnicoDre = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormConcluirAnalise = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size='lg'>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormComentarioDeAnalise = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormComentarioDeAnaliseSme = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormPerfis = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size='lg'>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapDevolucaoAoTesouroAta = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size='lg'>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapDeleteDevolucaoAoTesouro = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size='lg'>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                            propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            propriedades.primeiroBotaoOnclick
                    }>
                        {
                        propriedades.primeiroBotaoTexto
                    } </Button>
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalFormComentariosRelatorioConsolidadoApuracao = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormParametrizacoesAcoesDaAssociacao = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size='lg'>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormBodyText = (props) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    props.show
                }
                onHide={
                    props.onHide
                }
                size={
                    props.size
            }>
                <Modal.Header>
                    <Modal.Title>{
                        props.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    props.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormBodyPdf = ({
    children,
    ...props
}) => {
    return (
        <Fragment>
            <Modal show={
                    props.show
                }
                onHide={
                    props.onHide
                }
                size={
                    props.size
            }>
                <Modal.Header>
                    <Modal.Title>{
                        props.titulo
                    }</Modal.Title>
                    <button 
                        onClick={
                            props.onHide
                        }
                        style={{
                            border: 'none',
                            background: 'transparent'
                        }}
                    >
                        <FontAwesomeIcon style={
                                {
                                    color: "black",
                                    fontSize: '20px',
                                }
                            }
                            icon={faTimes}/>
                    </button>
                </Modal.Header>
                <Modal.Body> {children} </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormBodyTextCloseButtonCabecalho = (props) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    props.show
                }
                onHide={
                    props.onHide
                }
                size={
                    props.size
                }
                dialogClassName="custom-modal-width"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{
                        props.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    props.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormParametrizacoesAcoes = (propriedades) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size='lg'>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormParametrizacoesAcertos = (propriedades) => {

    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size='lg'>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapTipoRecursoNaoAceito = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button data-qa={`modal-tipo-recurso-nao-aceito-btn-${propriedades.primeiroBotaoTexto}`} variant={
                            propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            propriedades.primeiroBotaoOnclick
                    }>
                        {
                        propriedades.primeiroBotaoTexto
                    } </Button>
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button data-qa={`modal-tipo-recurso-nao-aceito-btn-${propriedades.segundoBotaoTexto}`} variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};


export const ModalBootstrapConfirmarPublicacaoRetificacao = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                   show={
                       propriedades.show
                   }
                   onHide={
                       propriedades.onHide
                   }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                        propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                    }
                            onClick={
                                propriedades.primeiroBotaoOnclick
                            }>
                        {
                            propriedades.primeiroBotaoTexto
                        } </Button>
                    {
                        propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                            <Button disabled={
                                propriedades.segundoBotaoDisable
                            }
                                    variant={
                                        propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                                    }
                                    onClick={
                                        propriedades.segundoBotaoOnclick
                                    }>
                                {
                                    propriedades.segundoBotaoTexto
                                } </Button>
                        ) : null
                    } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapConfirmarPublicacao = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                            propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            propriedades.primeiroBotaoOnclick
                    }>
                        {
                        propriedades.primeiroBotaoTexto
                    } </Button>
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button disabled={
                                propriedades.segundoBotaoDisable
                            }
                            variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormConcluirPeriodo = (propriedades) => { // Os botões de Confirmar e Cancelar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size='lg'>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormAdicionarDocumentos = (propriedades) => { // Os botões de Confirmar e Cancelar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size='lg'>
                <Modal.Header style={
                    {
                        padding: '15px',
                        margin: '1px',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        borderWidth: '2px'
                    }
                }>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapConsideraComoCorreto = (props) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    props.show
                }
                onHide={
                    props.onHide
                }
                size='lg'>
                <Modal.Header style={
                    {
                        padding: '15px',
                        margin: '1px',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        borderWidth: '2px'
                    }
                }>
                    <Modal.Title>{
                        props.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body style={
                    {
                        padding: '15px',
                        margin: '31px',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        borderWidth: '2px'
                    }
                } > {
                    props.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                            props.primeiroBotaoCss ? props.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            props.primeiroBotaoOnclick
                    }>
                        {
                        props.primeiroBotaoTexto
                    } </Button>
                    {
                    props.segundoBotaoOnclick && props.segundoBotaoTexto ? (
                        <Button variant={
                                props.segundoBotaoCss ? props.segundoBotaoCss : "primary"
                            }
                            onClick={
                                props.segundoBotaoOnclick
                        }>
                            {
                            props.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};


export const ModalBootstrapRemoveAcerto= (props) => { // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    props.show
                }
                onHide={
                    props.onHide
                }
                size='lg'>
                <Modal.Header style={
                    {
                        padding: '12px',
                        margin: '20px',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        borderWidth: '2px'
                    }
                }>
                    <Modal.Title>{
                        props.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body style={
                    {
                        padding: '40px',
                        margin: '1px',
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        borderWidth: '2px'
                    }
                } > {
                    props.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                            props.primeiroBotaoCss ? props.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            props.primeiroBotaoOnclick
                    }>
                        {
                        props.primeiroBotaoTexto
                    } </Button>
                    {
                    props.segundoBotaoOnclick && props.segundoBotaoTexto ? (
                        <Button variant={
                                props.segundoBotaoCss ? props.segundoBotaoCss : "primary"
                            }
                            onClick={
                                props.segundoBotaoOnclick
                        }>
                            {
                            props.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};


export const ModalBootstrapFormMarcarPublicacaoNoDiarioOficial = (propriedades) => { // Os botões de Confirmar e Cancelar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapDetalhamentoDREDiarioOficial = (propriedades) => {

    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                            propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "outline-success"
                        }
                        onClick={
                            propriedades.primeiroBotaoOnclick
                    }>
                        {
                        propriedades.primeiroBotaoTexto
                    } </Button>
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button disabled={
                                propriedades.segundoBotaoDisable
                            }
                            variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "success"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalMotivosRejeicaoEncerramentoConta = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                show={
                    propriedades.show
                }
                onHide={
                    propriedades.onHide
                }
                size={
                    propriedades.size
            }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                            propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                        }
                        onClick={
                            propriedades.primeiroBotaoOnclick
                    }>
                        {
                        propriedades.primeiroBotaoTexto
                    } </Button>
                    {
                    propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button variant={
                                propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                            }
                            onClick={
                                propriedades.segundoBotaoOnclick
                        }>
                            {
                            propriedades.segundoBotaoTexto
                        } </Button>
                    ) : null
                } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapInfoPerdeuAcesso = (propriedades) => {
    return (
        <Fragment>
            <Modal centered
                   show={
                       propriedades.show
                   }
                   onHide={
                       propriedades.onHide
                   }>
                <Modal.Header>
                    <Modal.Title>{
                        propriedades.titulo
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    propriedades.bodyText
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                        propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"
                    }
                            onClick={
                                propriedades.primeiroBotaoOnclick
                            }>
                        {
                            propriedades.primeiroBotaoTexto
                        } </Button>
                    {
                        propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                            <Button disabled={
                                propriedades.segundoBotaoDisable
                            }
                                    variant={
                                        propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"
                                    }
                                    onClick={
                                        propriedades.segundoBotaoOnclick
                                    }>
                                {
                                    propriedades.segundoBotaoTexto
                                } </Button>
                        ) : null
                    } </Modal.Footer>
            </Modal>
        </Fragment>
    )
};