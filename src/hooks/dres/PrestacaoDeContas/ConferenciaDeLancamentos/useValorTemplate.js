import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import React from "react";

function useValorTemplate (){

    function retornaValor (rowData= null, column = null, valor = null) {
        let valor_para_formatar;
        if (valor) {
            valor_para_formatar = valor
        } else {
            valor_para_formatar = rowData[column.field]
        }
        let valor_formatado = Number(valor_para_formatar).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");

        if (rowData && rowData.valor_transacao_na_conta !== rowData.valor_transacao_total) {
            let texto_exibir = `<div><strong>Valor total de despesa:</strong> ${Number(rowData.valor_transacao_total).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}</div>`;
            rowData.valores_por_conta.map((item) => (
                texto_exibir += `<div><strong>Conta ${item.conta_associacao__tipo_conta__nome}:</strong> ${Number(item.valor_rateio__sum).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}</div>`
            ));

            return (
                <div data-tip={texto_exibir} data-html={true}>
                    <span>
                        {valor_formatado}
                    </span>
                    <FontAwesomeIcon
                        style={{fontSize: '18px', marginLeft: "3px", color: '#C65D00'}}
                        icon={faInfoCircle}
                    />
                    <ReactTooltip/>
                </div>
            )
        } else {
            return valor_formatado
        }
    }

    return retornaValor


}
export default useValorTemplate