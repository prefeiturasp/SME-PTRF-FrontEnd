import React from "react";
import ReactTooltip from "react-tooltip";


const PreviaDocumentoRetificado = ({consolidadoDre, podeGerarPreviaRetificacao}) => {

    return(
            <>
            {consolidadoDre && consolidadoDre.eh_retificacao &&
            <>
                <span data-html={true} data-tip={podeGerarPreviaRetificacao ? "A análise da(s) prestação(ões) de contas em retificação ainda não foi concluída." : ""}>
                <button onClick={() => console.log('previas')} className="btn btn-outline-success" disabled={podeGerarPreviaRetificacao}>
                    Prévias
                </button>
                </span>
            <div className="p-2 bd-highlight font-weight-normal" data-html={true}>
                <button
                    onClick={console.log('gerar')}
                    className="btn btn btn btn-success"
                    disabled={podeGerarPreviaRetificacao}
                >
                    Gerar
                </button>
                <ReactTooltip html={true}/>
            </div>
        </>
        }
        </>
    )
}
export default PreviaDocumentoRetificado