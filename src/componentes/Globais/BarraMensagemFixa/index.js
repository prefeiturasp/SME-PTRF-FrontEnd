import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { barraMensagemCustom } from "../BarraMensagem";
import { useGetStatusCadastroAssociacao } from "../../escolas/MembrosDaAssociacao/hooks/useGetStatusCadastroAssociacao";
import { BarraMensagemFixaContext } from "./context/BarraMensagemFixaProvider";

export const BarraMensagemFixa = () => {
  const navigate = useNavigate();

  const { data_status_cadastro_associacao } = useGetStatusCadastroAssociacao();
  const { mensagem, txtBotao, url, exibeBotao } = useContext(BarraMensagemFixaContext);

  const exibeBarra = () => {
    if (
      data_status_cadastro_associacao &&
      data_status_cadastro_associacao.pendencia_novo_mandato
    ) {
      return true;
    }

    return false;
  };

  const goTo = () => {
    navigate(`${url}`);
  };

  return (
    <>
      {exibeBarra() &&
        barraMensagemCustom.BarraMensagemSucessLaranja(
          mensagem,
          exibeBotao ? txtBotao : null,
          exibeBotao ? goTo : null,
          exibeBotao
        )}
    </>
  );
};
