import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePostPaa } from "./usePostPaa";
import { getPaa } from "../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { gravarPaaAtivo } from "../../../../../utils/paaAtivoStorage";
import { rotaElaboracaoPaa } from "../utils/rotasPaa";

export const useAcaoElaboracaoPaa = ({ associacaoUuid }) => {
    const navigate = useNavigate();
    const { mutationPost } = usePostPaa();

    const criarPaaDoPeriodo = useCallback(
        periodoUuid => mutationPost.mutateAsync({
            payload: {
                associacao: associacaoUuid,
                periodo: periodoUuid
            }
        }),
        [associacaoUuid, mutationPost]
    )

    const executarAcao = useCallback(async botao => {
        if (!botao?.habilitado) return;
        
        let paa;
        try {
            paa = botao.acao === 'ELABORAR_NOVO'
                ? await criarPaaDoPeriodo(botao.periodoUuid)
                : await getPaa(botao.paaUuid);
            gravarPaaAtivo(paa);
        } catch (error) {
            // a falha da criação já é notificada pelo post no hook, então só o getPaa precisa ser tratado aqui
            if(botao.acao === "CONTINUAR") {
                toastCustom.ToastCustomError('Ops!', 'Não foi possível carregar a elaboração do PAA.');
            }
            console.error(error);
            return;
        }
        
        navigate(rotaElaboracaoPaa(paa.uuid));            
    }, [criarPaaDoPeriodo, navigate]);

    return { executarAcao, processando: mutationPost.isPending };
};
