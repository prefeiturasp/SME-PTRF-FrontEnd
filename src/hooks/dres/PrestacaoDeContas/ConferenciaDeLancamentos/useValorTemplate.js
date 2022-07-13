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

        return valor_formatado
    }

    return retornaValor


}
export default useValorTemplate