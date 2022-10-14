import React, {Fragment, useEffect, useState} from "react";
import Loading from "../../../utils/Loading";
import {getTagInformacao} from "../../../services/escolas/Despesas.service";
import {Button, Modal} from "react-bootstrap";
import "./modal-bootstrap.scss"
import { useCallback } from "react";

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

export const ModalBootstrapDeleteDevolucaoAoTesouro = (propriedades) =>{

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

export const ModalFormBodyText = (props) =>{
    return (
        <Fragment>
            <Modal centered show={props.show} onHide={props.onHide} size={props.size}>
                <Modal.Header>
                    <Modal.Title>{props.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormBodyTextCloseButtonCabecalho = (props) =>{
    return (
        <Fragment>
            <Modal centered show={props.show} onHide={props.onHide} size={props.size}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.bodyText}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
};

export const ModalFormParametrizacoesAcoes = (propriedades) =>{
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

export const ModalFormParametrizacoesAcertos = (propriedades) =>{

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

export const ModalBootstrapTipoRecursoNaoAceito = (propriedades) =>{
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
                        <Button variant={propriedades.segundoBotaoCss ? propriedades.segundoBotaoCss : "primary"} onClick={propriedades.segundoBotaoOnclick}>
                            {propriedades.segundoBotaoTexto}
                        </Button>
                    ):null}
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

export const ModalBootstrapConfirmarPublicacao = (propriedades) =>{
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

export const ModalBootstrapLegendaInformacao = (propriedades) => {
    const [listaTagInformacao, setListaTagInformacao] = useState([])
    const [loading, setLoading] = useState(true)

    const types = {
        1: 'tag-purple',
        2: 'tag-darkblue',
        3: 'tag-orange',
        4: 'tag-green',
        5: 'tag-blank',
        6: 'tag-red-white'
    }

    const handleTagInformacao = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getTagInformacao()
            setListaTagInformacao(response)
        } 
        catch (e) {
            console.error('Erro ao carregar tag informação', e)
        }
        setLoading(false)

    }, [])

    useEffect(() => {
        handleTagInformacao()
    }, [handleTagInformacao])

    return (
        <Fragment>
            <Modal centered size="lg" show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header>
                        <Modal.Title style={{fontWeight: 'bold'}}>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ): listaTagInformacao?.length > 0 ? listaTagInformacao.map((tag) => {
                    return (
                        <div className="row ml-2 pb-4" key={tag.id}>
                            <span className={`tag-informacoes ${types[tag.id]}`}>{tag.nome}</span>
                            <p className="pl-4 ml-2">{tag.descricao}</p>
                        </div>
                    )
                }): <span>Nenhuma informação encontrada</span>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "info"} onClick={propriedades.primeiroBotaoOnclick}>
                        {propriedades.primeiroBotaoTexto}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
 
}

export const ModalBootstrapFormConcluirPeriodo = (propriedades) =>{

    // Os botões de Confirmar e Cancelar estão dentro do próprio form, pois utilizei Formik para validações
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