import { memo } from "react";
import { Row, Spin, Modal } from "antd";
import { useDesativarSaldoPAA } from '../../../componentes/ReceitasPrevistas/hooks/usePararAtualizacaoSaldoPaa';
import IconeAviso from "../../../../../../assets/img/icone-modal-confirmacao.svg"

const ModalConfirmaPararAtualizacaoSaldo = ({ open, onClose, paa, onSubmitParadaSaldo}) => {
  const onSuccess = (data) => {
    // Disparar o Submit para o index somente se o request for sucesso
    onSubmitParadaSaldo()
    onClose()
  }

  const onError = (e) => {
    onClose()
    console.error('onError Data', e)
  }

  const { mutationPost: mutationPostDesativar } = useDesativarSaldoPAA(onSuccess, onError);

  const onSubmit = () => {
    mutationPostDesativar.mutate({ uuid: paa.uuid });
  };

  return (
    <div>
        <Modal
            zIndex={1060}
            centered
            open={open}
            onOk={onSubmit}
            okText="Sim"
            okButtonProps={
              {
                "data-testid": "botao-confirmar-congelamento",
                disabled: mutationPostDesativar.isPending
              }}
            onCancel={onClose}
            cancelText="Não"
            cancelButtonProps={
              {
                "data-testid": "botao-cancelar-confirmar-congelamento",
                disabled: mutationPostDesativar.isPending
              }}
            maskClosable={false}
            keyboard={false}
            wrapClassName={'modal-ant-design'}
        >
          <Spin spinning={mutationPostDesativar.isPending }>
            <Row justify="center">
              <img src={IconeAviso} alt="" className="img-fluid my-3"/>
            </Row>
            <Row justify="center">
                <div className="body-text-modal-antdesign-aviso my-3 text-center">
                  <h3 className="mb-4" style={{ fontSize: '16px' }}><strong>Gostaria de Bloquear a atualização do Saldo?</strong></h3>

                  <p style={{ fontSize: '16px' }}>O Saldo reprogramado do PTRF será bloqueado na data e hora atual para a realização do cálculo das receitas previstas no PAA.</p>
                </div>
            </Row>
          </Spin>
        </Modal>
    </div>
  );

};

export default memo(ModalConfirmaPararAtualizacaoSaldo);
