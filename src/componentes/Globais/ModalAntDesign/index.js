import React from "react";
import { Modal } from 'antd';
import "./modal-antdesign.scss"
import IconeConfirmacao from "../../../assets/img/icone-modal-confirmacao.svg"


export const ModalAntDesignConfirmacao = (propriedades) => {
    return(
        <div className="modal-ant-design">
            <Modal 
                title={propriedades.titulo} 
                open={propriedades.handleShow} 
                onOk={propriedades.handleOk} 
                onCancel={propriedades.handleCancel}
                okText={propriedades.okText}
                cancelText={propriedades.cancelText}
                wrapClassName={'modal-ant-design'}
            >
                <div className="row">
                    <div className="col-md-auto col-lg-12">
                        <div className="text-center">
                            <img src={IconeConfirmacao} alt="" className="img-fluid"/>
                        </div>
                    </div>

                    <div className="col-md-auto col-lg-12 mt-3">
                        <div className="text-center">
                            <p>{propriedades.bodyText}</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>

        
    )
}