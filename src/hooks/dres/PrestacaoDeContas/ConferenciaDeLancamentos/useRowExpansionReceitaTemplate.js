import React from "react";
import {useCarregaTabelaReceita} from "../../../Globais/useCarregaTabelaReceita";
import { barraMensagemCustom } from "./../../../../componentes/Globais/BarraMensagem";
import './scss/rowExpansionTable.scss';


const useRowExpansionDespesaTemplate = (prestacaoDeContas) =>{

    const tabelaReceita = useCarregaTabelaReceita()
    return (data) => {
        return (
            <div className='col-12 px-4 py-2'>
                {data.documento_mestre.mensagem_inativa &&
                    <div className='row'>
                            <div className='col-12 p-1 px-1'>
                            {barraMensagemCustom.BarraMensagemInativa(data.documento_mestre.mensagem_inativa)}
                            </div>
                    </div>
                    }
                <div className='row'>
                    <div className='col-4 border'>
                        <p className='mt-2 mb-0'><strong>Detalhamento do crédito</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.detalhamento ? data.documento_mestre.detalhamento : ''}</p>
                    </div>
                    <div className='col-4 border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Classificação do crédito</strong></p>
                        <p className='mb-2'>{data.documento_mestre && data.documento_mestre.categoria_receita ? tabelaReceita.categorias_receita.find(elemnt => elemnt.id === data.documento_mestre.categoria_receita).nome : ''}</p>
                    </div>
                    <div className='col-4 border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Tipo de ação</strong></p>
                        <p className='mb-2'>{data.documento_mestre && data.documento_mestre.acao_associacao && data.documento_mestre.acao_associacao.nome ? data.documento_mestre.acao_associacao.nome : ''}</p>
                    </div>
                </div>
            </div>
        )
    }

}

export default useRowExpansionDespesaTemplate