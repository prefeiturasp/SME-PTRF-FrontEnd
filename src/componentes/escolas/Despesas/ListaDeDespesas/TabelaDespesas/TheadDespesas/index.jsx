const TheadDespesas = () => {
    return (
            <thead data-qa="thead-cabecalho-lista-despesas">
                <tr data-qa="tr-cabecalho-lista-despesas">
                    <th data-qa="th-num-documento" style={{width: '17%'}} scope="col">Nº do documento</th>
                    <th data-qa="th-info" style={{width: '17%'}} scope="col">Informações</th>
                    <th data-qa="th-especificacao" scope="col">Especif. do material ou serviço</th>
                    <th data-qa="th-aplicacao" scope="col">Aplicação</th>
                    <th data-qa="th-tipo-acao" style={{width: '12%'}} scope="col">Tipo de ação</th>
                    <th data-qa="th-valor" style={{width: '12%'}} scope="col">Valor (R$)</th>
                </tr>
            </thead>
    )
}

export default TheadDespesas;