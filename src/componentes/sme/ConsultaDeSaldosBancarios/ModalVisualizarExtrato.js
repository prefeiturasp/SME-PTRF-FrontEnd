import React, {memo, useCallback, useEffect} from "react";
import {ModalFormBodyTextCloseButtonCabecalho} from "../../Globais/ModalBootstrap";
import {getVisualizarExtratoBancario} from "../../../services/escolas/PrestacaoDeContas.service";

const ModalVisualizarExtrato = ({show, handleClose, observacaoUuid}) => {

    const carregaExtratoBancario = useCallback(async () =>{
        try {
            await getVisualizarExtratoBancario(observacaoUuid);
        }catch (e) {
            console.log("Erro ao visualizar o comprovante do extrato ", e.response);
        }
    }, [observacaoUuid]);

    useEffect(()=>{
        carregaExtratoBancario()
    })

    const bodyTextarea = () => {
        return (
            <>
                <object id='comprovante_extrato_bancario'>

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

export default memo(ModalVisualizarExtrato)