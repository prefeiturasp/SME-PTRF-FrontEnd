import { useState, ComponentType, useMemo } from "react";
import { usePostPaaGeracaoDocumentoPreviaRetificacao } from "./../../hooks/usePostPaaGeracaoDocumento";
import { usePollingStatusDocumento } from "./../../hooks/usePollingStatusDocumento";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { ModalInfoGeracaoDocumentoPrevia } from "../../ModalInfoGeracaoDocumento";
import { visoesService } from "../../../../../../../../services/visoes.service";
import { IGerarDocumentoProps } from "./types";
import { BotaoGerarComponent } from "./BotaoGerarComponent";

const ModalInfoPrevia = ModalInfoGeracaoDocumentoPrevia as ComponentType<{ open: boolean; onClose: () => void }>;


export const BtnGerarPreviaRetificacao = ({ paa }: IGerarDocumentoProps) => {
    const podeEditar = useMemo(() => visoesService.getPermissoes(["custom_change_paa"]), []);
    const [ openInfoModal, setOpenInfoModal] = useState<boolean>(false);

    const { statusDocumento, isLoadingStatusDocumento, iniciarPolling } =
        usePollingStatusDocumento({ paaUuid: paa.uuid });
    
    const checkStatus = async () => {
        setOpenInfoModal(true);
        iniciarPolling();
    };
    
    const mutateGerar = usePostPaaGeracaoDocumentoPreviaRetificacao({
        onSuccessGerarDocumentoRetificacao: checkStatus,
    }) as unknown as { mutate: (uuid: string) => void; isPending: boolean };

    const handleGerar = () => {
        const docJaFoiGerado =
            statusDocumento?.status === "CONCLUIDO" && statusDocumento?.versao === "FINAL";

        if (docJaFoiGerado){
            toastCustom.ToastCustomError(
                "Documento Final de Retificação",
                "Não é possível gerar o documento prévia, o documento final de retificação já foi gerado",
            );
            return
        };

        if (paa.uuid) {
          mutateGerar.mutate(paa.uuid);
        } else {
          toastCustom.ToastCustomError(
            "Erro!", "PAA vigente não identificado para geração de prévia de retificação.",
          );
        }
    };

    const defaultDesabilitado = useMemo(() => {
        const validacoes = [
            statusDocumento?.status === "EM_PROCESSAMENTO",
            statusDocumento?.status === "CONCLUIDO" && statusDocumento?.versao === "FINAL",
            !podeEditar,
            mutateGerar.isPending,
            isLoadingStatusDocumento,
            //TODO: considerar !paa????
        ];
    
        return validacoes.includes(true);
    }, [
        statusDocumento?.status,
        statusDocumento?.versao,
        podeEditar,
        mutateGerar.isPending,
        isLoadingStatusDocumento,
    ]);

    return (
        <span>
            <BotaoGerarComponent
                botaoProps={
                    {
                        disabled: defaultDesabilitado,
                        onClick: handleGerar,
                        title: "Gerar Prévia de Retificação",
                        className: "btn btn-outline-success"
                    }
                }
                texto="Prévia"
            />
            <ModalInfoPrevia
                open={openInfoModal}
                onClose={() => setOpenInfoModal(false)}
            />
        </span>
    )
}