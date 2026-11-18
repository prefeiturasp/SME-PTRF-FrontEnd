import React from "react";
import CancelarRetificacao from "../../../componentes/CancelarRetificacao";
import { BotaoRetificarPaa } from "../BotaoRetificarPaa/BotaoRetificarPaa";
import { podeExibirBotaoRetificar } from "../../utils/exibirBotaoRetificarPaa";

// "Cancelar retificação" e "Retificar o PAA" de um PAA (vigente ou da Próxima Vigência) da listagem.
export const AcoesRetificacaoPaa = ({ dados }) => {
    if (!podeExibirBotaoRetificar(dados)) return null;

    const paa = {
        uuid: dados.uuid,
        status: dados.esta_em_retificacao ? "EM_RETIFICACAO" : "GERADO",
    };
    const statusDocumento = dados?.original?.documento?.status
        ? { mensagem: dados.original.documento.status.mensagem }
        : undefined;

    return (
        <>
            <CancelarRetificacao outlined paa={paa} />
            <div style={{ marginRight: 10, height: 1 }}></div>
            <BotaoRetificarPaa paa={paa} statusDocumento={statusDocumento} />
        </>
    );
};
