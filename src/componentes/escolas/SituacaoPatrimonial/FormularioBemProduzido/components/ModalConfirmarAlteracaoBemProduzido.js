import { memo } from "react";
import { Row, Spin, Modal } from "antd";
import IconeAvisoVermelho from "../../../../../assets/img/icone-modal-aviso-vermelho.svg";

const ModalConfirmarAlteracaoBemProduzido = ({ open, onClose, onConfirm, loading, title, message }) => {
  return (
    <div>
      <Modal
        zIndex={1060}
        centered
        open={open}
        onOk={onConfirm}
        okText="Confirmar"
        okButtonProps={{
          "data-testid": "botao-confirmar-alteracao-bem",
          disabled: loading
        }}
        onCancel={onClose}
        cancelText="Cancelar"
        cancelButtonProps={{
          "data-testid": "botao-cancelar-alteracao-bem",
          disabled: loading
        }}
        wrapClassName={'modal-ant-design'}
      >
        <Spin spinning={loading}>
          <Row justify="center">
            <img src={IconeAvisoVermelho} alt="" className="img-fluid my-3" />
          </Row>
          <Row justify="center">
            <p className="title-modal-antdesign-aviso">{title || "Alteração de valores detectada"}</p>
          </Row>
          <Row justify="center">
            <div className="body-text-modal-antdesign-aviso my-3 text-center">
              {message || (
                <>Você alterou valores do bem produzido. Tem certeza que deseja salvar essas alterações?</>
              )}
            </div>
          </Row>
        </Spin>
      </Modal>
    </div>
  );
};

export default memo(ModalConfirmarAlteracaoBemProduzido); 