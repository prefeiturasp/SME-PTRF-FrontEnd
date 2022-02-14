import React, {memo} from "react";

const TabelaRepassesPendentes = ({repassesPendentes}) => {

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    return(
        <>
            <table className="table table-bordered tabela-acoes mb-0">
                <thead>
                <tr className="tr-titulo-presentes">
                    <th scope="col">Período</th>
                    <th scope="col">Ação</th>
                    <th scope="col">Valor</th>
                </tr>
                </thead>

                <tbody>
                {repassesPendentes.map((repasse, index_repasses)=>
                    <tr key={`tr-repasses-pendentes-${index_repasses}`}>
                        <td>{ repasse.repasse_periodo }</td>
                        <td>{ repasse.repasse_acao }</td>
                        <td>R$ { valorTemplate(repasse.repasse_total)}</td>
                    </tr>
                )}

                </tbody>
            </table>
        </>
    )
}

export default memo(TabelaRepassesPendentes)