import { useCallback, useEffect, useRef } from "react";
import { useGetStatusGeracaoDocumentoPaa } from "./useGetStatusGeracaoDocumentoPaa";
import { IStatusDocumentoPaa } from "../components/BotoesGeracao/types";

interface Options {
    paaUuid: string;
    onConcluidoFinal?: () => void;
}

interface Return {
    statusDocumento: IStatusDocumentoPaa | undefined;
    isLoadingStatusDocumento: boolean;
    iniciarPolling: () => Promise<void>;
}

export const usePollingStatusDocumento = ({ paaUuid, onConcluidoFinal }: Options): Return => {
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const {
        data: statusDocumento,
        isFetching: isLoadingStatusDocumento,
        refetch: refetchStatusDoc,
    } = useGetStatusGeracaoDocumentoPaa(paaUuid) as {
        data: IStatusDocumentoPaa | undefined;
        isFetching: boolean;
        refetch: () => Promise<unknown>;
    };

    const stopPolling = useCallback(() => {
        clearTimeout(timeoutRef.current ?? undefined);
        clearInterval(timerRef.current ?? undefined);
        timeoutRef.current = null;
        timerRef.current = null;
    }, []);

    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    useEffect(() => {
        if (statusDocumento?.status && statusDocumento.status !== "EM_PROCESSAMENTO") {
            stopPolling();
        }
        if (statusDocumento?.status === "CONCLUIDO" && statusDocumento?.versao === "FINAL") {
            onConcluidoFinal?.();
        }
    }, [statusDocumento, stopPolling, onConcluidoFinal]);

    const iniciarPolling = useCallback(async () => {
        stopPolling();
        await refetchStatusDoc();
        timeoutRef.current = setTimeout(() => {
            timerRef.current = setInterval(() => {
                refetchStatusDoc();
            }, 5000);
        }, 2000);
    }, [refetchStatusDoc, stopPolling]);

    return { statusDocumento, isLoadingStatusDocumento, iniciarPolling };
};