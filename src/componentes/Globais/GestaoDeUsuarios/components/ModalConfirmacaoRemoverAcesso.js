import React from 'react';
import { ModalBootstrap } from '../../ModalBootstrap';

export const ModalConfirmacaoRemoverAcesso = ({
  visao,
  show,
  botaoCancelarHandle,
  botaoConfirmarHandle,
}) => {
  const mensagens = {
    UE: '<p>Tem certeza que deseja remover o acesso deste usuário nessa unidade?</p>',
    DRE: '<p>Tem certeza que deseja remover o acesso deste usuário nesta DRE e em suas unidades, se houver?</p><p>Observação: Para remover o acesso a apenas uma de suas unidades, basta desabilitá-lo na referida unidade.</p>',
    SME: '<p>Tem certeza que deseja remover o acesso deste usuário em todas as unidades?</p><p>Observação: Para remover o acesso a apenas uma de suas unidades, basta desabilitá-lo na referida unidade.</p>'
  };

  const mensagem = mensagens[visao] || '<p>Mensagem não disponível para a visão selecionada.</p>';

  return (
    <ModalBootstrap
      show={show}
      onHide={botaoCancelarHandle}
      titulo="Remover acesso"
      bodyText={mensagem}
      primeiroBotaoTexto="Cancelar"
      primeiroBotaoCss="outline-success"
      primeiroBotaoOnclick={botaoCancelarHandle}
      segundoBotaoTexto="Remover acesso"
      segundoBotaoCss="danger"
      segundoBotaoOnclick={botaoConfirmarHandle}
    />
  );
};
