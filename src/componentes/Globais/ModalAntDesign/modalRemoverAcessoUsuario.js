import React from "react";
import { Modal } from 'antd';
import "./modal-antdesign.scss"
import IconeAvisoVermelho from "../../../assets/img/icone-modal-aviso-vermelho.svg"


export const ModalRemovelAcessoUsuario = (propriedades) => {
    return(
        <div className="modal-ant-design">
            <Modal 
                open={propriedades.handleShow}
                onOk={propriedades.handleOk}
                okText={propriedades.okText}
                okButtonProps={propriedades.okButton ? { className: "btn-base-vermelho"} : { style: { display: 'none' } }}
                onCancel={propriedades.handleCancel}
                cancelText={propriedades.cancelText}
                cancelButtonProps={{className: "btn-base-verde-outline"}}
                wrapClassName={'modal-ant-design'}
            >
                <div className="row">
                    <div className="col-md-auto col-lg-12">
                        <div className="text-center">
                            <img src={IconeAvisoVermelho} alt="" className="img-fluid"/>
                        </div>
                    </div>

                    <div className="col-md-auto col-lg-10 mt-3 offset-lg-1">
                        <div className="text-center">
                            <p className="title-modal-antdesign-aviso">{propriedades.titulo}</p>
                        </div>
                        <div className="text-center mt-2">
                            {propriedades.bodyText}
                        </div>
                    </div>

                    {propriedades.observacao && propriedades.observacao.length > 0 && 
                        <div data-qa="observacao-modal" className="row mt-3 mx-3 py-2 observacao-modal">
                            <div className="col-lg-12">
                                <div className="text-center">
                                    <p className="title-observacao-modal-antdesign-aviso">Observação:</p>
                                </div>
                                <div className="text-center">
                                    {propriedades.observacao}
                                </div>
                            </div>
                        </div>}
                </div>
            </Modal>
        </div>
    )
}