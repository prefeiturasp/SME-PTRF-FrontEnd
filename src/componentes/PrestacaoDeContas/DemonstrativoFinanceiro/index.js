import React, {useEffect, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import {getAcoes, previa, documentoFinal, getDemonstrativoInfo} from "../../../services/DemonstrativoFinanceiro.service";

export const DemonstrativoFinanceiro = () => {

    const rowsPerPage = 7;

    const [estado, setEstado] = useState('');

    useEffect(() =>  {
        buscaAcoes();
    }, [])

    const buscaAcoes = async () => {
        const periodo_uuid = JSON.parse(localStorage.getItem('periodoConta')).periodo;
        const associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID);
        const result = await getAcoes(associacao_uuid, periodo_uuid);
        
        let est_result = await Promise.all(result.info_acoes.map(async (info) => {

            console.log("buscaAcoes ", info)

            const msg = await getDemonstrativoInfo(info.acao_associacao_uuid);
            return {
                nomeAcao: info.acao_associacao_nome, 
                acaoUuid: info.acao_associacao_uuid,
                receitaDeclarada: info.receitas_no_periodo, 
                despesaDeclarada: info.despesas_no_periodo,
                mensagem: msg} 
        }));
        setEstado(est_result);
    }

    const gerarPrevia = async (acaoUuid) => {
        const periodo_uuid = JSON.parse(localStorage.getItem('periodoConta')).periodo
        const conta_uuid = JSON.parse(localStorage.getItem('periodoConta')).conta
        
        await previa(acaoUuid, conta_uuid, periodo_uuid);
    }

    const gerarDocumentoFinal = async (acaoUuid) => {
        const periodo_uuid = JSON.parse(localStorage.getItem('periodoConta')).periodo
        const conta_uuid = JSON.parse(localStorage.getItem('periodoConta')).conta
        
        await documentoFinal(acaoUuid, conta_uuid, periodo_uuid);
        await buscaAcoes();
    }

    const getNomeAcao = (rowData) => {
        return (
            <div>
                <p className="demonstrativo-financeiro-nome-acao"><strong>{rowData['nomeAcao']}</strong></p>
                <p className={rowData['mensagem'].includes('pendente') ? "demonstrativo-financeiro-documento-pendente" :"demonstrativo-financeiro-documento-gerado"}  >{rowData['mensagem']}</p>
            </div>
        )
    }

    const getBotoes = (rowData) => {
        return (
            <div className="text-right">
                <button type="button" onClick={(e) => gerarPrevia(rowData['acaoUuid'])} className="btn btn-outline-success mr-2">prévia </button>
                <button disabled={false} onClick={(e) => gerarDocumentoFinal(rowData['acaoUuid'])} type="button" className="btn btn-success">documento final</button>
            </div>
        )
    }

    const valorReceita = (rowData, column) => {
        const valor = rowData['receitaDeclarada']
            ? new Number(rowData['receitaDeclarada']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : 0
        const valorFormatado = `R$ ${valor}`
        return (<span>{valorFormatado}</span>)
    }

    const valorDespesa = (rowData, column) => {
        const valor = rowData['despesaDeclarada']
            ? new Number(rowData['despesaDeclarada']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : 0
        const valorFormatado = `R$ ${valor}`
        return (<span>{valorFormatado}</span>)
    }

    return (
        <div className="demonstrativo-financeiro-container mt-5">
            <p className="demonstrativo-financeiro-titulo">Demontrativo Financeiro</p>

            {estado &&
            <div className="content-section implementation">
                <DataTable
                    value={estado}
                    className="mt-3 datatable-footer-coad"
                    paginator={estado.length > rowsPerPage}
                    rows={rowsPerPage}
                    paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                    autoLayout={true}
                    selectionMode="single"
                    //onRowClick={e => redirecionaDetalhe(e.data)}
                >
                    <Column
                        field="nomeAcao"
                        header="Nome da ação"
                        body={getNomeAcao}
                    />
                    <Column
                        field="receitaDeclarada"
                        header="Receita declarada"
                        body={valorReceita}/>
                    <Column
                        field="despesaDeclarada"
                        header="Despesa declarada"
                        body={valorDespesa}/>
                    <Column
                        field='botoes'
                        header=''
                        body={getBotoes}
                    />
                </DataTable>
            </div>
            }
        </div>
    );
}