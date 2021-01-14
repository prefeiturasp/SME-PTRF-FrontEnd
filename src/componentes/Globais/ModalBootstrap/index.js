import React, {Fragment} from "react";
import {Button, Modal} from "react-bootstrap";
import "./modal-bootstrap.scss"

export const ModalBootstrap = (propriedades) =>{
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div dangerouslySetInnerHTML={{ __html: propriedades.bodyText }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"} onClick={propriedades.primeiroBotaoOnclick}>
                        {propriedades.primeiroBotaoTexto}
                    </Button>
                    {propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button variant={propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"} onClick={propriedades.segundoBotaoOnclick}>
                            {propriedades.segundoBotaoTexto}
                        </Button>
                    ):null}
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapReverConciliacao = (propriedades) =>{
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"} onClick={propriedades.primeiroBotaoOnclick}>
                        {propriedades.primeiroBotaoTexto}
                    </Button>
                    {propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button disabled={propriedades.segundoBotaoDisable} variant={propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"} onClick={propriedades.segundoBotaoOnclick}>
                            {propriedades.segundoBotaoTexto}
                        </Button>
                    ):null}
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapSaldoInsuficiente = (propriedades) =>{
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"} onClick={propriedades.primeiroBotaoOnclick}>
                        {propriedades.primeiroBotaoTexto}
                    </Button>
                    {propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button disabled={propriedades.segundoBotaoDisable} variant={propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"} onClick={propriedades.segundoBotaoOnclick}>
                            {propriedades.segundoBotaoTexto}
                        </Button>
                    ):null}
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapSaldoInsuficienteDaconta = (propriedades) =>{
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
                <Modal.Footer>
                    {propriedades.aceitarLancamento &&
                        <Button variant={propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"} onClick={propriedades.primeiroBotaoOnclick}>
                            {propriedades.primeiroBotaoTexto}
                        </Button>
                    }
                    {propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button disabled={propriedades.segundoBotaoDisable} variant={propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"} onClick={propriedades.segundoBotaoOnclick}>
                            {propriedades.segundoBotaoTexto}
                        </Button>
                    ):null}
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapEditarAta = (propriedades) =>{
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}  size="lg">
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "primary"} onClick={propriedades.primeiroBotaoOnclick}>
                        {propriedades.primeiroBotaoTexto}
                    </Button>
                    {propriedades.segundoBotaoOnclick && propriedades.segundoBotaoTexto ? (
                        <Button disabled={propriedades.segundoBotaoDisable} variant={propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"} onClick={propriedades.segundoBotaoOnclick}>
                            {propriedades.segundoBotaoTexto}
                        </Button>
                    ):null}
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormMembros = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormMeusDadosEmail = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide} >
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormMeusDadosSenha = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}  size="lg">
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormExcluirTecnicoDre = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide} >
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormConcluirAnalise = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormComentarioDeAnalise = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapFormPerfis = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide} size='lg'>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapDevolucaoAoTesouroAta = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide} size='lg'>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormComentariosRelatorioConsolidadoApuracao = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormParametrizacoesAcoesDaAssociacao = (propriedades) =>{

    // Os botões de Cancelar e Salvar estão dentro do próprio form, pois utilizei Formik para validações
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {propriedades.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};