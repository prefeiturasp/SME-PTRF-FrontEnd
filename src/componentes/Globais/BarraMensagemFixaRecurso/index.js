import React, { useContext } from "react";
import { barraMensagemCustom } from "../BarraMensagem";
import { BarraMensagemFixaContext } from "../BarraMensagemFixa/context/BarraMensagemFixaProvider";

export const BarraMensagemFixaRecurso = () => {

  const { mensagem } = useContext(BarraMensagemFixaContext);

  return (
    <>
      {barraMensagemCustom.BarraMensagemSucessLaranja(
        mensagem
      )}
    </>
  );
};
