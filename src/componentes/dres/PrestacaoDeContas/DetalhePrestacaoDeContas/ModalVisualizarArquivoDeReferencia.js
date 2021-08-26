import React, {memo, useCallback, useEffect} from "react";
import {ModalFormBodyTextCloseButtonCabecalho} from "../../../Globais/ModalBootstrap";
import {getVisualizarArquivoDeReferencia} from "../../../../services/dres/PrestacaoDeContas.service";

const ModalVisualizarArquivoDeReferencia = ({show, handleClose, uuidArquivoReferencia, nomeArquivoReferencia, tipoArquivoReferencia}) => {

    const exibeArquivoDeReferencia = useCallback(async () =>{
        try {
            await getVisualizarArquivoDeReferencia(nomeArquivoReferencia, uuidArquivoReferencia, tipoArquivoReferencia);
        }catch (e) {
            console.log("Erro ao visualizar o comprovante do extrato ", e.response);
        }
    }, [nomeArquivoReferencia, uuidArquivoReferencia, tipoArquivoReferencia]);

    useEffect(()=>{
        exibeArquivoDeReferencia()
    }, [exibeArquivoDeReferencia])

    const bodyTextarea = () => {
        return (
            <>
                <object id='visualizar_arquivo_de_referencia'>

                </object>
            </>
        )
    };

    return (
        <ModalFormBodyTextCloseButtonCabecalho
            onClose={handleClose}
            show={show}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalVisualizarArquivoDeReferencia)