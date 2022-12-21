import React from "react";
import {Link} from 'react-router-dom';

export const Retificar = ({consolidadoDre}) => {
  return(
      <>
          {consolidadoDre && consolidadoDre.permite_retificacao &&
              <div className="p-2 bd-highlight">
                    <Link
                        to={
                            {
                                pathname: `/dre-relatorio-consolidado-retificacao/${consolidadoDre.uuid}`,
                                state: {
                                    referencia_publicacao: consolidadoDre.titulo_relatorio
                                }
                            }
                        }
                        className="btn btn-success"
                    >
                        Retificar
                    </Link>

              </div>
          }
      </>
  )
}
