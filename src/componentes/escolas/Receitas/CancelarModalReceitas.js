import React from "react";
import { Modal } from 'antd';
import IconeAvisoVermelho from "../../../assets/img/icone-modal-aviso-vermelho.svg"

export const CancelarModalReceitas = (propriedades) =>{
    return (
        <Modal 
            open={propriedades.show}
            onOk={propriedades.onCancelarTrue}
            okText="OK"
            okButtonProps={{className: "btn-base-vermelho"}}
            onCancel={propriedades.handleClose}
            cancelText="Fechar"
            cancelButtonProps={{className: "btn-base-verde-outline"}}
            wrapClassName={'modal-ant-design'}
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
                        <p className="body-text-modal-antdesign-aviso">{propriedades.bodyText}</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
};