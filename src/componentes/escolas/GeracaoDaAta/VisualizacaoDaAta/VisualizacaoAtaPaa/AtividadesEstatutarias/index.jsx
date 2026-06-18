import { memo, useMemo } from "react";
import { TagRetificacao } from "../../../../Paa/componentes/TagRetificacao";

export const AtividadesEstatutarias = memo(({
    atividades,
    isLoadingAtividades,
    paaRetificacao,
    isLoading,
    formatarMesAno,
    formatarData
}) => {

    const atividadesComAlteracao = useMemo(() => {
        return atividades ? atividades.filter(act => act.alteracao) : [];
    }, [atividades]);
    
    const naoEstaCarregando = !isLoadingAtividades && !isLoading;

    return (  
        naoEstaCarregando && atividades && atividades.length > 0 && !paaRetificacao ? (
         <div className="col-12 mt-4">
           <h4 className="mb-3" style={{ fontWeight: "bold", color: "#42474A" }}>
             <span className="mr-3">Atividades Estatutárias </span>{paaRetificacao && !isLoading && <TagRetificacao />}
           </h4>
           <table className="table table-bordered" style={{ width: "100%" }}>
             <thead style={{ backgroundColor: "#dadada" }}>
               <tr>
                 <th style={{ width: "20%" }}>Tipo de Atividades</th>
                 <th style={{ width: "15%" }}>Data</th>
                 <th style={{ width: "45%" }}>Atividades Estatutárias Previstas</th>
                 <th style={{ width: "20%" }}>Mês/Ano</th>
               </tr>
             </thead>
              <tbody>
                {atividades.map((atividade, index) => {
                  const mesAnoBase =
                    atividade.isGlobal && !atividade.vinculoUuid
                      ? atividade.mesLabel || "-"
                      : formatarMesAno(atividade.data);
                  return (
                    <tr key={atividade.uuid || index}>
                      <td>{atividade.tipoAtividade || "-"}</td>
                      <td>{formatarData(atividade.data)}</td>
                      <td>{atividade.descricao || "-"}</td>
                      <td>{mesAnoBase || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
           </table>
         </div>
         ) : naoEstaCarregando && atividadesComAlteracao.length > 0 ? (
         <div className="col-12 mt-4">
           <h4 className="mb-3" style={{ fontWeight: "bold", color: "#42474A" }}>
             <span className="mr-3">Atividades Estatutárias </span>{paaRetificacao && !isLoading && <TagRetificacao />}
           </h4>
           <table className="table table-bordered" style={{ width: "100%" }}>
             <thead style={{ backgroundColor: "#dadada" }}>
               <tr>
                 <th style={{ width: "20%" }}>Tipo de Atividades</th>
                 <th style={{ width: "15%" }}>Data</th>
                 <th style={{ width: "45%" }}>Atividades Estatutárias Previstas</th>
                 <th style={{ width: "20%" }}>Mês/Ano</th>
               </tr>
             </thead>
              <tbody>
                {atividadesComAlteracao.map((atividade, index) => {
                  const mesAnoBase =
                    atividade.isGlobal && !atividade.vinculoUuid
                      ? atividade.mesLabel || "-"
                      : formatarMesAno(atividade.data);
                  return (
                    <tr key={atividade.uuid || index}>
                      <td>{atividade.tipoAtividade || "-"}</td>
                      <td>{formatarData(atividade.data)}</td>
                      <td>{atividade.descricao || "-"}</td>
                      <td>{mesAnoBase || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
           </table>
         </div>
       ) : null
    )
});