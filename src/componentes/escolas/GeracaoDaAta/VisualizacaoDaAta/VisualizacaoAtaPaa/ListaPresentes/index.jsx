import { memo } from "react";

export const ListaPresentes = memo(({
    listaPresentesMembros,
    listaPresentesNaoMembros
}) => {
    return (
        <div className="col-12 mt-4">
            <h4 className="mb-3" style={{ fontWeight: "bold", color: "#42474A" }}>
              Lista de presentes
            </h4>

            <p className="titulo-tabela-acoes mt-3" style={{ fontWeight: "bold", fontSize: 16 }}>
              Membros da Diretoria Executiva e do Conselho Fiscal
            </p>

            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead style={{ backgroundColor: "#dadada" }}>
                <tr>
                  <th style={{ width: "70%" }}>Nome e cargo</th>
                  <th style={{ width: "30%" }}>Assinatura</th>
                </tr>
              </thead>
              <tbody>
                {listaPresentesMembros.map((presente, index) => (
                  <tr key={presente.uuid || presente.identificacao || index}>
                    <td>
                      <div>
                        <strong style={{ textTransform: "uppercase" }}>{presente.nome || "-"}</strong>
                        {presente.cargo && <div style={{ marginTop: "4px" }}>{presente.cargo}</div>}
                      </div>
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="titulo-tabela-acoes mt-3" style={{ fontWeight: "bold", color: "#00585E", fontSize: 16 }}>
              Demais presentes
            </p>
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead style={{ backgroundColor: "#dadada" }}>
                <tr>
                  <th style={{ width: "70%" }}>Nome e cargo</th>
                  <th style={{ width: "30%" }}>Assinatura</th>
                </tr>
              </thead>
              <tbody>
                {listaPresentesNaoMembros.map((presente, index) => (
                  <tr key={presente.uuid || presente.identificacao || index}>
                    <td>
                      <div>
                        <strong style={{ textTransform: "uppercase" }}>{presente.nome || "-"}</strong>
                        {presente.cargo && (
                          <div style={{ marginTop: "4px" }}>
                            {presente.cargo} {presente.professor_gremio && " - Professor do Grêmio"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    )
});