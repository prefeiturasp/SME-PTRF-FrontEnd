import React, {memo, useState} from "react";
import { ModalPublicarRelatorioConsolidado } from "../../../utils/Modais";

const PublicarDocumentos = ({publicarConsolidadoDre, podeGerarPrevia, children, consolidadoDre, publicarConsolidadoDePublicacoesParciais}) => {
    const [showPublicarRelatorioConsolidado, setShowPublicarRelatorioConsolidado] = useState(false);
    
    return(
        <>
        <div className="d-flex bd-highlight align-items-center container-publicar-cabecalho text-dark rounded-top border font-weight-bold">
            <div className="p-2 flex-grow-1 bd-highlight fonte-16">{consolidadoDre.titulo_relatorio}</div>

            {!consolidadoDre.ja_publicado &&
                <>
                    {podeGerarPrevia() &&
                        <div className="p-2 bd-highlight">
                            {children}
                        </div>
                    }
                    <div className="p-2 bd-highlight">
                        <button onClick={() => setShowPublicarRelatorioConsolidado(true)} className="btn btn btn btn-success">Publicar</button>
                    </div>
                </>
            }
        </div>

        <section>
            <ModalPublicarRelatorioConsolidado
                show={showPublicarRelatorioConsolidado}
                handleClose={()=>setShowPublicarRelatorioConsolidado(false)}
                publicarConsolidadoDre={!consolidadoDre.eh_consolidado_de_publicacoes_parciais ? () => publicarConsolidadoDre(consolidadoDre) : ()=>publicarConsolidadoDePublicacoesParciais() }
            />
        </section>
</>
    )
}
export default memo(PublicarDocumentos)