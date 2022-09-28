import React from "react";

export const Retificar = ({consolidadoDre}) => {
  return(
      <>
          {consolidadoDre && consolidadoDre.data_publicacao && consolidadoDre.pagina_publicacao && consolidadoDre.status_sme === 'PUBLICADO' &&
              <div className="p-2 bd-highlight">
                  <button
                      className="btn btn-success"
                  >
                      Retificar
                  </button>
              </div>
          }
      </>
  )
}
