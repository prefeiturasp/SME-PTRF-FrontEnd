import React, {Fragment, useCallback, useEffect, useState} from "react";
import { getTagInformacao } from "../../../services/escolas/Despesas.service";
import {Button, Modal} from "react-bootstrap";
import Loading from "../../../utils/Loading";
import { TagInformacao } from "../TagInformacao"

export const ModalLegendaInformacao = (propriedades) => {
    const [listaTagInformacao, setListaTagInformacao] = useState([])
    const [loading, setLoading] = useState(true)

    const handleTagInformacao = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getTagInformacao()
            setListaTagInformacao(response)
        } catch (e) {
            console.error('Erro ao carregar tag informação', e)
        }
        setLoading(false)

    }, [])

    useEffect(() => {
        handleTagInformacao()
    }, [handleTagInformacao])

    return (
        <Fragment>
            <Modal centered size="lg"
                   show={
                       propriedades.show
                   }
                   onHide={
                       propriedades.onHide
                   }>
                <Modal.Header>
                    <Modal.Title style={
                        {fontWeight: 'bold'}
                    }>
                        {
                            propriedades.titulo
                        }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    loading ? (
                        <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0"/>
                    ) : listaTagInformacao?.length > 0 ? listaTagInformacao.map((tag) => {
                        tag.texto = tag.nome
                        return (TagInformacao(tag, "modal-legenda-informacao"))
                    }) : <span>Nenhuma informação encontrada</span>
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
                        propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "info"
                    }
                            onClick={
                                propriedades.primeiroBotaoOnclick
                            }>
                        {
                            propriedades.primeiroBotaoTexto
                        } </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )

}