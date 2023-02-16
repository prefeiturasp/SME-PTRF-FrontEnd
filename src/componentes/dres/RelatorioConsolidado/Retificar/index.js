import React from "react";
import {Link} from 'react-router-dom';
import ReactTooltip from "react-tooltip";

export const Retificar = ({consolidadoDre}) => {
  return(
      <>
          {consolidadoDre && consolidadoDre?.exibe_botao_retificar &&
              <div className="p-2 bd-highlight">
                    <Link
                        to={
                            {
                                pathname: `/dre-relatorio-consolidado-retificacao/${consolidadoDre.uuid}`,
                                state: {
                                    referencia_publicacao: consolidadoDre.titulo_relatorio,
                                    eh_edicao_retificacao: false
                                }
                            }
                        }
                    >
                        <button 
                            className="btn btn-success"
                            disabled={consolidadoDre && !consolidadoDre?.habilita_retificar}
                        >
                            <span data-tip={consolidadoDre?.tooltip_habilita_retificar}>
                                Retificar
                            </span>
                            {consolidadoDre?.tooltip_habilita_retificar && <ReactTooltip place="right"/>}
                        </button>
                    </Link>

              </div>
          }
      </>
  )
}
