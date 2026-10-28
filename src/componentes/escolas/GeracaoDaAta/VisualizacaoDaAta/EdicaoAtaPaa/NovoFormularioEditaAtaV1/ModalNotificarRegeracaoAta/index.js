import React from "react";
import { Modal } from 'antd';
import "./modal.scss"
import IconeConfirmacao from "../../../../../../../assets/img/icone-modal-confirmacao.svg"

export const ModalNotificarRegeracaoAta = (propriedades) => {
    return(
        <div className="modal-ant-design">
            <Modal 
                open={propriedades.handleShow} 
                onOk={propriedades.handleOk} 
                onCancel={propriedades.handleOk}
                okText={propriedades.okText}
                wrapClassName={'modal-ant-design'}
                cancelButtonProps={propriedades.cancelButtonProps}
            >
                <div className="row">
                    <div className="col-md-auto col-lg-12 mt-3">
                        <div className="text-center">
                            <p className="title-modal-antdesign-aviso">{propriedades.titulo}</p>
                        </div>
                        <div className="col-md-auto col-lg-12">
                        <div className="text-center">
                            <img src={IconeConfirmacao} alt="" className="img-fluid"/>
                        </div>
                    </div>
                        <div className="text-center mt-2">
                            <p className="body-text-modal-antdesign-aviso">{propriedades.bodyText}</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>   
    )
}