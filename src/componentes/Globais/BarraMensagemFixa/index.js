import React, {useContext} from "react";
import { useHistory } from "react-router-dom";
import { barraMensagemCustom } from "../BarraMensagem";
import { useGetStatusCadastroAssociacao } from "../../escolas/MembrosDaAssociacao/hooks/useGetStatusCadastroAssociacao"
import { BarraMensagemFixaContext } from "./context/BarraMensagemFixaProvider";

export const BarraMensagemFixa = () => {
    const history = useHistory();

    const { data_status_cadastro_associacao } = useGetStatusCadastroAssociacao();
    const { mensagem, txtBotao, url } = useContext(BarraMensagemFixaContext);

    const exibeBarra = () => {
        if(data_status_cadastro_associacao && data_status_cadastro_associacao.pendencia_novo_mandato){
            return true;
        }

        return false;
    }

    const goTo = () => {
        history.push(`${url}`)
    }

    return(
        <>
            {exibeBarra() && 
                barraMensagemCustom.BarraMensagemSucessLaranja(mensagem, txtBotao, goTo, true)
            }
        </>
        
    )
}