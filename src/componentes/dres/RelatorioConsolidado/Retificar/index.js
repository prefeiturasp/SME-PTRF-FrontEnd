import React from "react";
import {Link} from 'react-router-dom';
import ReactTooltip from "react-tooltip";
import { visoesService } from "../../../../services/visoes.service";

export const Retificar = ({consolidadoDre}) => {
  return(
      <>
          {consolidadoDre && consolidadoDre?.exibe_botao_retificar && [['access_retificacao_dre']].some(visoesService.getPermissoes) &&
              <div className="p-2 bd-highlight">
                    <Link
                        to={`/dre-relatorio-consolidado-retificacao/${consolidadoDre.uuid}`}
                        state={{
                            referencia_publicacao: consolidadoDre.titulo_relatorio,
                            eh_edicao_retificacao: false
                        }}
                    >
                        <button 
                            className="btn btn-success"
                            disabled={(consolidadoDre && !consolidadoDre?.habilita_retificar) || !visoesService.getPermissoes(['change_relatorio_consolidado_dre'])}
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
