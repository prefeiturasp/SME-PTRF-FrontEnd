import { IBotaoGerarDocumentoProps } from "./types";

export const BotaoGerarComponent = (props: IBotaoGerarDocumentoProps) => (
    <button
        className="btn btn-outline-success"
        {...props.botaoProps}>
        {props.texto ?? '-'}
    </button>
)
