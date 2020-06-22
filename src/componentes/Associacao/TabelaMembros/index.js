import React from "react";
import "../associacao.scss"

export const TabelaMembros = () => {
    return(
      <>
          <table className="table table-bordered tabela-membros">
              <thead>
              <tr className="cabecalho">
                  <th scope="col">Cargo na associação</th>
                  <th scope="col">Nome completo</th>
                  <th scope="col">Representação na associação</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
              </tr>
              </tbody>
          </table>
      </>
    );
}