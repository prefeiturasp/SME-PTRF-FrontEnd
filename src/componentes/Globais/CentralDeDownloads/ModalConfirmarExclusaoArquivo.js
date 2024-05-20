import React from 'react';
import '../ModalAntDesign/modal-antdesign.scss';
import { Modal } from 'antd';
import IconeAvisoVermelho from "../../../assets/img/icone-modal-aviso-vermelho.svg"

export const ModalConfirmarExclusaoArquivo = (props) => {
  return (
    <div className="modal-ant-design">
        <Modal 
            open={props.open}
            onOk={props.onOk}
            okText={props.okText}
            okButtonProps={{className: "btn-base-vermelho"}}
            onCancel={props.onCancel}
            cancelText={props.cancelText}
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
