
import React from "react";
import {Button, Modal} from "react-bootstrap";
import "./../../../../../Globais/ModalBootstrap/modal-bootstrap.scss"

export const ModalJustificarNaoRealizacao = (props) => {
    return (
            <>
                <Modal centered show={props.show} onHide={props.onHide}>
                    <Modal.Header>
                        <Modal.Title>{props.titulo}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {props.bodyText}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={props.primeiroBotaoCss ? props.primeiroBotaoCss : "primary"} onClick={props.primeiroBotaoOnClick}>
                            {props.primeiroBotaoTexto}
                        </Button>
                        {props.segundoBotaoOnclick && props.segundoBotaoTexto ? (
                            <Button disabled={props.segundoBotaoDisable} variant={props.segundoBotaoCss ? props.segundoBotaoCss : "primary"} onClick={props.segundoBotaoOnclick}>
                                {props.segundoBotaoTexto}
                            </Button>
                        ):null}
                    </Modal.Footer>
                </Modal>
            </>
        )
};

