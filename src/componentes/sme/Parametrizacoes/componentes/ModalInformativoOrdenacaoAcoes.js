import React from 'react';
import '../../../Globais/ModalAntDesign/modal-antdesign.scss';
import { Modal } from 'antd';
import IconeAvisoVerde from "../../../../assets/img/icone-modal-confirmacao.svg"

export const ModalInformativoOrdenacaoAcoes = (props) => {
  return (
    <div className="">
        <Modal
            zIndex={1060} /** Z superior às Modais de Formulários */
            centered
            open={props.open}
            onOk={props.onOk}
            okText={props.okText}
            okButtonProps={{className: props.okButtonProps ? props.okButtonProps : "btn-base-verde",  "data-testid": "botao-confirmar-modal"}}
            onCancel={props.onCancel}
            cancelText={props.cancelText}
            cancelButtonProps={{className: props.cancelButtonProps ? props.cancelButtonProps : "btn-base-verde-outline", "data-testid": "botao-cancelar-confirmacao-modal"}}
            wrapClassName={'modal-ant-design'}
            maskClosable={false}
        >
            <div className="row">
                <div className="col-md-auto col-lg-12">
                    <div className="text-center">
                        <img src={props.iconeAviso ? props.iconeAviso : IconeAvisoVerde} alt="" className="img-fluid"/>
                    </div>
                </div>

                <div className="col-md-auto col-lg-12 mt-3">
                    <div className="text-center">
                        <p className="title-modal-antdesign-aviso">{props.titulo}</p>
                    </div>
                    <div className="text-center mt-2">
                        <p className="body-text-modal-antdesign-aviso">{props.bodyText}</p>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
  );
};
