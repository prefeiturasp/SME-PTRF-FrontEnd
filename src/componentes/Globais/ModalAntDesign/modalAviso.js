import React from "react";
import { Modal } from 'antd';
import "./modal-antdesign.scss"
import IconeAvisoVermelho from "../../../assets/img/icone-modal-aviso-vermelho.svg"


export const ModalAntDesignAviso = (propriedades) => {
    return(
        <div className="modal-ant-design">
            <Modal 
                open={propriedades.handleShow} 
                onCancel={propriedades.handleCancel}
                cancelText={propriedades.cancelText}
                wrapClassName={'modal-ant-design'}
                okButtonProps={{ style: { display: 'none' } }}
            >
                <div className="row">
                    <div className="col-md-auto col-lg-12">
                        <div className="text-center">
                            <img src={IconeAvisoVermelho} alt="" className="img-fluid"/>
                        </div>
                    </div>

                    <div className="col-md-auto col-lg-12 mt-3">
                        <div className="text-center">
                            <p className="title-modal-antdesign-aviso">{propriedades.titulo}</p>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-modal-antdesign-aviso">{propriedades.bodyText}</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>

        
    )
}