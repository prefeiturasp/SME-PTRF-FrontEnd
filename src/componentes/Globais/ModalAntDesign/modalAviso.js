import React from "react";
import { Modal } from 'antd';
import "./modal-antdesign.scss"

export const ModalAntDesignAviso = (propriedades) => {

    const okButtonProps = propriedades.okButton ? { className: "btn-base-vermelho"} : { style: { display: 'none' } }

    const cancelButtonProps = propriedades.cancelButton ? {className: "btn-base-verde-outline"} : {}

    const wrapClassName = `modal-ant-design ${propriedades.wrapClassName ? propriedades.wrapClassName : ''}` 

    return(
        <div className="modal-ant-design">
            <Modal 
                open={propriedades.open}
                onOk={propriedades.handleOk}
                okText={propriedades.okText}
                okButtonProps={okButtonProps}
                onCancel={propriedades.handleCancel}
                cancelText={propriedades.cancelText}
                cancelButtonProps={cancelButtonProps}
                wrapClassName={wrapClassName}
            >
                <div className="row">
                    <div className="col-md-auto col-lg-12">
                        <div className="text-center">
                            <img src={propriedades.icone} alt="" className="img-fluid"/>
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
        </div>
    )
}