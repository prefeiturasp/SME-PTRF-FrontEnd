import React from "react";
import { Modal } from 'antd';
import "./modal-antdesign.scss"
import IconeModalConfirmacao from "../../../assets/img/icone-modal-confirmacao.svg"

export const ModalNotificaErroConcluirPC = (propriedades) => {
    const wrapClassName = `modal-ant-design ${propriedades.wrapClassName ? propriedades.wrapClassName : ''}`

    const okButtonProps = propriedades.hideSegundoBotao ? { style: { display: 'none' }} : {className: "btn-base-verde"}

    const cancelButtonProps = {className: propriedades.primeiroBotaoCss}

    return(
        <div className="modal-ant-design">
            <Modal 
                open={propriedades.show}
                onOk={propriedades.segundoBotaoOnclick}
                okText={propriedades.segundoBotaoTexto}
                okButtonProps={okButtonProps}
                onCancel={propriedades.handleClose}
                cancelText={propriedades.primeiroBotaoTexto}
                cancelButtonProps={cancelButtonProps}
                wrapClassName={wrapClassName}
                dataQa={propriedades.dataQa}
            >
                <div className="row">
                    <div className="col-md-auto col-lg-12">
                        <div className="text-center">
                            <img src={IconeModalConfirmacao} alt="" className="img-fluid"/>
                        </div>
                    </div>

                    <div className="col-md-auto col-lg-12 mt-3">
                        <div className="title-modal-antdesign-notifica-erro-pc text-center">
                            {propriedades.titulo}
                        </div>
                        <div className="text-center mt-2">
                            <p className="body-text-modal-antdesign-notifica-erro-pc">{propriedades.texto}</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}