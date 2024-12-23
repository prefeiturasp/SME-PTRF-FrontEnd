import React, {memo, useEffect} from "react";
import {ModalFormBodyTextCloseButtonCabecalho} from "../../../Globais/ModalBootstrap";
import {getVisualizarArquivoDeReferencia} from "../../../../services/dres/PrestacaoDeContas.service";

const ModalVisualizarArquivoDeReferencia = ({show, handleClose, uuidArquivoReferencia, nomeArquivoReferencia, tipoArquivoReferencia}) => {

    const exibeArquivoDeReferencia = async () =>{
        try {
            await getVisualizarArquivoDeReferencia(nomeArquivoReferencia, uuidArquivoReferencia, tipoArquivoReferencia);
        }catch (e) {
            console.log("Erro ao visualizar o comprovante do extrato ", e.response);
        }
    }

    useEffect(()=>{
        exibeArquivoDeReferencia()
    })

    const bodyTextarea = () => {
        const height = `${window.innerHeight * 0.85}px`;
    
        return (
            <>
                <object
                    id="visualizar_arquivo_de_referencia"
                    style={{ height: height, width: '100%' }}
                    type="application/pdf"
                >
                    Este navegador não suporta a visualização de PDFs diretamente. Por favor, faça o download do arquivo.
                </object>
            </>
        );
    };
    

    return (
        <ModalFormBodyTextCloseButtonCabecalho
            onClose={handleClose}
            show={show}
            onHide={handleClose}
            size='xl'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalVisualizarArquivoDeReferencia)