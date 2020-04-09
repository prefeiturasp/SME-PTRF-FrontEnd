import React, {useState, createContext, Fragment} from "react";
import {Button, Modal} from "react-bootstrap";

export const NotificacaoContext = createContext({
    msg: "",
    setMsg() {
    },
    abrirModal: true,
    setAbrirModal() {
    },
    tituloModal: "",
    setTituloModal() {
    },
});

export const NotificacaoContextProvider = ({children}) => {

    const [msg, setMsg] = useState("");
    const [abrirModal, setAbrirModal] = useState("");
    const [tituloModal, setTituloModal] = useState("");

    const handleClose = () => {
        setAbrirModal(false);
    }
    return (
        <NotificacaoContext.Provider value={{msg, setMsg, abrirModal, setAbrirModal, tituloModal, setTituloModal}}>
            {children}
            {msg && (
                <Fragment>
                    <Modal centered show={abrirModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{tituloModal}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div dangerouslySetInnerHTML={{ __html: msg }} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={handleClose}>
                                fechar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Fragment>
            )}
        </NotificacaoContext.Provider>
    )
}
