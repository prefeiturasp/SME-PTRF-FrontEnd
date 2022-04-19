import React, {Fragment, memo} from "react";
// Hooks Personalizados
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";

const TabelaDespesasComPagamentoAntecipado = ({despesasComPagamentoAntecipadoNoPeriodo}) =>{

    const dataTemplate = useDataTemplate()

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    return (
        <>
            <table className="table table-bordered mb-0 mt-3">
                <thead>
                <tr className="tr-titulo-presentes">
                    <th style={{width: '2%'}}>&nbsp;</th>
                    <th colSpan='5'>Dados documento comprobatório da despesa</th>
                    <th colSpan='3'>Dados do pagamento</th>
                </tr>
                <tr className="tr-titulo-presentes">
                    <th style={{width: '2%'}} scope="col">&nbsp;</th>
                    <th scope="col">Razão social</th>
                    <th scope="col">CNPJ ou CPF</th>
                    <th scope="col">Tipo do documento</th>
                    <th scope="col">Número do documento</th>
                    <th scope="col">Data do documento</th>
                    <th scope="col">Tipo de transação</th>
                    <th scope="col">Data da transação</th>
                    <th scope="col">Valor (R$)</th>
                </tr>
                </thead>

                <tbody>
                {despesasComPagamentoAntecipadoNoPeriodo.map((despesa, index_despesa)=>

                        <Fragment key={`tr-despesas-pagamento-antecipado-${index_despesa}`}>
                            <tr >
                                <td style={{width: '2%', borderBottom:"none"}}>{index_despesa + 1}</td>
                                <td>{despesa.nome_fornecedor}</td>
                                <td>{despesa.cpf_cnpj_fornecedor}</td>
                                <td>{despesa.tipo_documento}</td>
                                <td>{despesa.numero_documento}</td>
                                <td>{despesa.data_documento}</td>
                                <td>{despesa.tipo_transacao}</td>
                                <td>{despesa.data_transacao}</td>
                                <td>{valorTemplate(despesa.valor_total)}</td>
                            </tr>


                        <tr>
                            <td style={{width: '2%', borderTop:"none"}}>&nbsp;</td>
                            <td colSpan='8'>
                                <p><strong>Justificativa do pagamento antecipado</strong></p>
                                {despesa && despesa.motivos_pagamento_antecipado && despesa.motivos_pagamento_antecipado.length > 0 && despesa.motivos_pagamento_antecipado.map((motivo, index_motivo)=>
                                    <Fragment key={`tr-despesas-pagamento-antecipado-motivo-${index_motivo}`}>
                                        <span  className='pr-1'>{motivo.motivo}</span>
                                    </Fragment>
                                )}
                                <span>{despesa.outros_motivos_pagamento_antecipado}</span>
                            </td>
                        </tr>

                        </Fragment>
                )}
                </tbody>

            </table>
        </>
    )

}

export default memo(TabelaDespesasComPagamentoAntecipado)