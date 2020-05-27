import React, {useEffect, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import {getAcoes, previa} from "../../../services/DemonstrativoFinanceiro.service";

export const DemonstrativoFinanceiro = () => {

    const rowsPerPage = 7;

    const [estado, setEstado] = useState('');

    useEffect(() =>  {
        buscaAcoes();
    }, {})

    const buscaAcoes = async () => {
        const periodo_uuid = JSON.parse(localStorage.getItem('periodoConta')).periodo;
        const associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID);
        const result = await getAcoes(associacao_uuid, periodo_uuid);
        
        let est_result = result.info_acoes.map((info) => {
            return {nomeAcao: info.acao_associacao_nome, 
             acaoUuid: info.acao_associacao_uuid,
             receitaDeclarada: `R$ ${info.receitas_no_periodo}`, 
             despesaDeclarada: `R$ ${info.receitas_no_periodo}`}
        })    
        
        setEstado(est_result);
    }

    const gerarPrevia = async (acaoUuid) => {
        const periodo_uuid = JSON.parse(localStorage.getItem('periodoConta')).periodo
        const conta_uuid = JSON.parse(localStorage.getItem('periodoConta')).conta
        
        await previa(acaoUuid, conta_uuid, periodo_uuid);
    }

    const getNomeAcao = (rowData) => {
        return (
            <div>
                <p className="demonstrativo-financeiro-nome-acao"><strong>{rowData['nomeAcao']}</strong></p>
                <p className="demonstrativo-financeiro-documento-pendente">Documento pendente de geração</p>
            </div>
        )
    }

    const getBotoes = (rowData) => {
        return (
            <div className="text-right">
                <button type="button" onClick={(e) => gerarPrevia(rowData['acaoUuid'])} className="btn btn-outline-success mr-2">prévia </button>
                <button disabled={true} type="button" className="btn btn-success btn-readonly">documento final </button>
            </div>
        )
    }

    return (
        <div className="demonstrativo-financeiro-container mt-5">
            <p className="demonstrativo-financeiro-titulo">Demontrativo Financeiro</p>

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
                    <Column field="receitaDeclarada" header="Receita declarada"/>
                    <Column field="despesaDeclarada" header="Despesa declarada"/>
                    <Column
                        field='botoes'
                        header=''
                        body={getBotoes}
                    />
                </DataTable>
            </div>
        </div>
    );
}