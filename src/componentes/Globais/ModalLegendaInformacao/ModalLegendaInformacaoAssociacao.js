import React, {Fragment} from "react";
import {Button, Modal} from "react-bootstrap";
import { TagInformacao } from "../../Globais/TagInformacao";

export const ModalLegendaInformacaoAssociacao = (propriedades) => {

    const opcoes = [
        {
            id: 7,
            class: "fundo-cor-cinza-neutral-03 texto-cor-branco",
            texto: "Associação encerrada",
            descricao: "Indica que a associação foi encerrada."
        }
    ]

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
                    opcoes.map((tag, index) => {
                        tag.index = index;
                        return (
                            <TagInformacao data={tag} localDaTag="modal-legenda-informacao"/>
                        )
                    })
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