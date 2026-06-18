
interface IBotaoDocumentoProps {
    disabled: boolean
    onClick: () => void,
    title: string,
    className?: string,
}

export interface IBotaoGerarDocumentoProps {
    texto?: string,
    botaoProps: IBotaoDocumentoProps
}

export interface IGerarDocumentoProps {
    paa: {
        uuid: string,
        status: string,
    }
}

export interface IStatusDocumentoPaa {
    status?: string;
    versao?: string;
    retificacao?: boolean;
    mensagem?: string;
}
