import { memo } from "react";
import { Flex, Typography } from 'antd';
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";

const TEXTO_PADRAO = (
    'O documento está sendo gerado, enquanto isso você pode ' +
    'continuar a usar o sistema. Quando a geração for concluída, ' +
    'um botão de download ficará disponível.'
);

const CorpoPadrao = (props) =>(
    <>
        <Typography.Text>
            {TEXTO_PADRAO}
        </Typography.Text>

        <Flex gap={16} justify="end" className="mt-3">
            <button
                type="button"
                className="btn btn-outline-success btn-sm"
                onClick={props.onClose}
                >
                Fechar
            </button>
        </Flex>
    </>
)
export const ModalInfoGeracaoDocumentoPrevia = memo(({ open, onClose }) => {
    return (
        <ModalFormBodyText
        show={open}
        onHide={onClose}
        titulo={'Documento prévio sendo gerado'}
        bodyText={<CorpoPadrao onClose={onClose} />}
        />
    );
});

export const ModalInfoGeracaoDocumentoFinal = memo(({ open, onClose }) => {
    return (
        <ModalFormBodyText
        show={open}
        onHide={onClose}
        titulo={'Documento final sendo gerado'}
        bodyText={<CorpoPadrao onClose={onClose} />}
        />
    );
});

export const ModalConfirmaGeracaoFinal = memo(({ open, onClose, onConfirm }) => {

    return (
        <ModalFormBodyText
        show={open}
        onHide={onClose}
        titulo={'Conclusão do PAA'}
        bodyText={
            <>
                Após a conclusão do PAA, não será possível realizar edições. Se houver necessidade de ajustes, será preciso efetuar uma retificação.

                <Flex gap={16} justify="end" className="mt-3">
                    <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={onConfirm}>
                        Continuar
                    </button>
                </Flex>
            </>
        }
        />
    );
});


export const ModalInfoPendenciasGeracaoFinal = memo(({ open, onClose, pendencias }) => {
    return (
        <ModalFormBodyText
        show={open}
        onHide={onClose}
        titulo={'Pendências para geração do PAA'}
        bodyText={
            <>
                <div>É necessário preenchimento nas seguintes seções:</div>
                <ul>
                    {(pendencias||'').split('\n').map((pendencia, index) => (
                        <li key={index}>
                            {pendencia.includes('Prioridades sem ação') ? 'Prioridades sem ação e/ou valor total' : ''}
                            {pendencia.includes('introdução') ? 'Introdução' : ''}
                            {pendencia.includes('objetivo') ? 'Objetivos' : ''}
                            {pendencia.includes('conclusão') ? 'Conclusão' : ''}
                        </li>
                        
                    ))}
                </ul>
                <Flex gap={16} justify="end" className="mt-3">
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={onClose}>
                        Ok
                    </button>
                </Flex>
            </>
        }
        />
    );
});