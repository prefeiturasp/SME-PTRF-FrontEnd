import React, {Fragment} from "react";
import {Button, Modal} from "react-bootstrap";

export const ModalLegendaInformacaoAssociacao = (propriedades) => {

    const opcoes = [
        {
            id: 1,
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
                    opcoes.map((tag) => {
                        return (
                            <div className="row ml-2 pb-4" key={tag.id}>
                                <div className="col-3">
                                    <span className={`tag-informacoes-associacao-encerrada ${tag.class}`}>
                                        {tag.texto}
                                    </span>
                                </div>

                                <div className="col">
                                    <p>{tag.descricao}</p>
                                </div>
                            </div>
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