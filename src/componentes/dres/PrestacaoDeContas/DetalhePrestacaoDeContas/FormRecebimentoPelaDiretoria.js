import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";

export const FormRecebimentoPelaDiretoria = ({stateFormRecebimentoPelaDiretoria, handleChangeFormRecebimentoPelaDiretoria, disabledNome, disabledData, disabledStatus, tabelaPrestacoes, prestacaoDeContas, exibeMotivo, exibeRecomendacoes, motivo='motivos_aprovacao_ressalva', outros_motivos='outros_motivos_aprovacao_ressalva', recomendacoes='recomendacoes'}) =>{
    const juntaMotivos = (motivos, outros_motivos) => {
        let lista = [];

        for(let motivo=0; motivo<=motivos.length-1; motivo++){
            lista.push(motivos[motivo].motivo)
        }

        if(outros_motivos){
            lista.push(outros_motivos)
        }
        
        return lista;
    }

    const isValid = (value) => {
        if(value !== '' &&
           value !== null && 
           value !== undefined){
            return true
        } else {
            return false
        }
    };

    return(
        <>
            <div className="mb-3">
                <span>* Campos obrigatórios</span>
            </div>
            <h4 data-qa="recebimento-pela-diretoria">Recebimento pela Diretoria</h4>
            <form method="post">
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="tecnico_atribuido">Técnico responsável</label>
                        <input
                            data-qa="tecnico-responsavel"
                            value={stateFormRecebimentoPelaDiretoria.tecnico_atribuido ? stateFormRecebimentoPelaDiretoria.tecnico_atribuido : ''}
                            onChange={(e) => handleChangeFormRecebimentoPelaDiretoria(e.target.name, e.target.value)}
                            name='tecnico_atribuido'
                            type="text"
                            className="form-control"
                            disabled={disabledNome}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="data_recebimento">Data de recebimento *</label>
                        <DatePickerField
                            dataQa="data-de-recebimento"
                            name="data_recebimento"
                            id="data_recebimento"
                            value={stateFormRecebimentoPelaDiretoria.data_recebimento ? stateFormRecebimentoPelaDiretoria.data_recebimento : ''}
                            onChange={handleChangeFormRecebimentoPelaDiretoria}
                            disabled={disabledData}
                            className={`form-control ${isValid(stateFormRecebimentoPelaDiretoria.data_recebimento) ? '' : 'is_invalid'}`}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="status">Status</label>
                        <select
                            data-qa="select-status"
                            value={stateFormRecebimentoPelaDiretoria.status}
                            onChange={(e) => handleChangeFormRecebimentoPelaDiretoria(e.target.name, e.target.value)}
                            name="status"
                            id="status"
                            className="form-control retira-dropdown-select"
                            disabled={disabledStatus}
                        >
                            {tabelaPrestacoes.status && tabelaPrestacoes.status.length > 0 && tabelaPrestacoes.status.map(item => (
                                <option data-qa={`select-status-${item.nome}`} key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    {exibeMotivo && prestacaoDeContas && ( (prestacaoDeContas[motivo] && prestacaoDeContas[motivo].length > 0) || prestacaoDeContas[outros_motivos])  &&
                        <div data-qa="bloco-motivos-acompanhamento-pc" className='col-12 mt-3'>
                            <strong><label>Motivo(s)</label></strong>
 
                            {juntaMotivos(prestacaoDeContas[motivo], prestacaoDeContas[outros_motivos]).map((motivo, index) => (
                                <strong data-qa={`motivo-${index+1}-${motivo}`} key={index}><p className="lista-motivos mb-0" key={index}>{index+1}. {motivo}</p></strong>
                            ))}
                        </div>   
                    }

                    {exibeRecomendacoes && prestacaoDeContas && prestacaoDeContas[recomendacoes] &&
                        <div data-qa="bloco-recomendacoes-acompanhamento-pc" className='col-12 mt-3'>
                            <strong><label>Recomendações</label></strong>

                            <p data-qa="recomendacoes-acompanhamento-pc">{prestacaoDeContas[recomendacoes]}</p>
                        </div>  
                    } 
                </div>
            </form>
        </>
    )
};