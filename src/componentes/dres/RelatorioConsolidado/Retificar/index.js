import React from "react";
import {Link} from 'react-router-dom';

export const Retificar = ({consolidadoDre}) => {
  return(
      <>
          {/* {consolidadoDre && consolidadoDre.data_publicacao && consolidadoDre.pagina_publicacao && consolidadoDre.status_sme === 'PUBLICADO' && */}
          {consolidadoDre && consolidadoDre.permite_retificacao &&
              <div className="p-2 bd-highlight">
                    <Link
                        to={
                            {
                                pathname: `/dre-relatorio-consolidado-retificacao/${consolidadoDre.uuid}`,
                            }
                        }
                        className="btn btn-success"
                    >
                        Retificar
                    </Link>


                  {/* <button
                      className="btn btn-success"
                  >
                      Retificar
                  </button> */}
              </div>
          }
      </>
  )
}
