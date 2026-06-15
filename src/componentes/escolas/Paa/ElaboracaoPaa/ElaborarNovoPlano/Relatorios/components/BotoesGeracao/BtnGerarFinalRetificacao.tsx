import { useState, ComponentType, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePostPaaGeracaoDocumentoFinalRetificacao } from "./../../hooks/usePostPaaGeracaoDocumento";
import { usePollingStatusDocumento } from "./../../hooks/usePollingStatusDocumento";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import {
    ModalConfirmaGeracaoFinalRetificacao,
    ModalInfoPendenciasGeracaoFinalRetificacao,
} from "../../ModalInfoGeracaoDocumento";
import { visoesService } from "../../../../../../../../services/visoes.service";
import { IGerarDocumentoProps } from "./types";
import { BotaoGerarComponent } from "./BotaoGerarComponent";

const ModalConfirmaFinalRetificacao = ModalConfirmaGeracaoFinalRetificacao as ComponentType<{
    open: boolean; onClose: () => void, onConfirm: () => void
}>;
const ModalInfoPendenciasFinalRetificacao = ModalInfoPendenciasGeracaoFinalRetificacao as ComponentType<{
    open: boolean; onClose: () => void, pendencias: string
}>;

export const BtnGerarFinalRetificacao = ({ paa }: IGerarDocumentoProps) => {
    const podeEditar = useMemo(() => visoesService.getPermissoes(["custom_change_paa"]), []);
    const navigate = useNavigate();

    const [pendenciasGeracao, setPendenciasGeracao] = useState("");
    const [openModalConfirmarGeracao, setOpenModalConfirmarGeracao] = useState(false);
    const [openModalValidacoes, setOpenModalValidacoes] = useState(false);
    const [gerandoDocFinal, setGerandoDocFinal] = useState(false);

    const { statusDocumento, isLoadingStatusDocumento, iniciarPolling } =
        usePollingStatusDocumento({
            paaUuid: paa.uuid,
            onConcluidoFinal: () => navigate("/paa-vigente-e-anteriores"),
        });

    const onErrorValidacoes = (data: { confirmar: boolean; mensagem: string }) => {
        if (data?.confirmar) {
            setOpenModalConfirmarGeracao(true);
        } else {
            setOpenModalValidacoes(true);
            setPendenciasGeracao(data?.mensagem);
        }
    };

    const mutateGerar = usePostPaaGeracaoDocumentoFinalRetificacao({
        onSuccessGerarDocumentoRetificacao: iniciarPolling,
        onErrorGerarDocumentoRetificacao: onErrorValidacoes as unknown as () => void,
    }) as unknown as {
        mutateAsync: (vars: { uuid: string; payload: { confirmar: number } }) => Promise<unknown>;
        isPending: boolean;
    };

    const handleGerar = async (confirmar = 0) => {
        if (!podeEditar) return;

        const docJaFoiGerado = statusDocumento?.status === "CONCLUIDO" && statusDocumento?.versao === "FINAL";
        if (docJaFoiGerado){
            toastCustom.ToastCustomError(
                "Documento final de retificação",
                "Não é possível gerar o documento final de retificação, o mesmo já foi gerado",
            );
            return
        };

        setOpenModalConfirmarGeracao(false);

        try {
            setGerandoDocFinal(true);
            if (paa.uuid) {
                await mutateGerar.mutateAsync({ uuid: paa.uuid, payload: { confirmar } });
            } else {
                toastCustom.ToastCustomError(
                    "Erro!", "PAA não identificado para geração final de retificação.");
            }
        } catch (err) {
            console.error("Erro ao gerar documento final de retificação:", err);
        } finally {
            setGerandoDocFinal(false);
        }
    };

    const defaultDesabilitado = useMemo(() => {
        const validacoes = [
            statusDocumento?.status === "EM_PROCESSAMENTO",
            statusDocumento?.status === "CONCLUIDO" && statusDocumento?.versao === "FINAL",
            !podeEditar,
            isLoadingStatusDocumento,
            mutateGerar.isPending,
            gerandoDocFinal,
        ];
    
        return validacoes.includes(true);
    }, [
        statusDocumento?.status,
        statusDocumento?.versao,
        podeEditar,
        isLoadingStatusDocumento,
        mutateGerar.isPending,
        gerandoDocFinal,
    ]);

    return (
        <span>
            <BotaoGerarComponent
                botaoProps={
                    {
                        disabled: defaultDesabilitado,
                        onClick: () => handleGerar(0),
                        title: "Gerar documento PAA final retificado",
                        className: "btn btn-success"
                    }
                }
                texto="Gerar"
            />

            <ModalConfirmaFinalRetificacao
                open={openModalConfirmarGeracao}
                onClose={() => {
                    setGerandoDocFinal(false);
                    setOpenModalConfirmarGeracao(false);
                }}
                onConfirm={() => handleGerar(1)}
            />
    
            <ModalInfoPendenciasFinalRetificacao
                open={openModalValidacoes}
                onClose={() => {
                    setGerandoDocFinal(false);
                    setOpenModalValidacoes(false)
                }}
                pendencias={pendenciasGeracao}
            />
        </span>
    );
};


