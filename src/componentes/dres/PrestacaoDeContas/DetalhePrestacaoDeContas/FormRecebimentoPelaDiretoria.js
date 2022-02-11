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
    
    return(
        <>
            <h4>Recebimento pela Diretoria</h4>
            <form method="post">
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="tecnico_atribuido">Técnico responsável</label>
                        <input
                            value={stateFormRecebimentoPelaDiretoria.tecnico_atribuido ? stateFormRecebimentoPelaDiretoria.tecnico_atribuido : ''}
                            onChange={(e) => handleChangeFormRecebimentoPelaDiretoria(e.target.name, e.target.value)}
                            name='tecnico_atribuido'
                            type="text"
                            className="form-control"
                            disabled={disabledNome}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="data_recebimento">Data de recebimento</label>
                        <DatePickerField
                            name="data_recebimento"
                            id="data_recebimento"
                            value={stateFormRecebimentoPelaDiretoria.data_recebimento ? stateFormRecebimentoPelaDiretoria.data_recebimento : ''}
                            onChange={handleChangeFormRecebimentoPelaDiretoria}
                            disabled={disabledData}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="status">Status</label>
                        <select
                            value={stateFormRecebimentoPelaDiretoria.status}
                            onChange={(e) => handleChangeFormRecebimentoPelaDiretoria(e.target.name, e.target.value)}
                            name="status"
                            id="status"
                            className="form-control retira-dropdown-select"
                            disabled={disabledStatus}
                        >
                            {tabelaPrestacoes.status && tabelaPrestacoes.status.length > 0 && tabelaPrestacoes.status.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    {exibeMotivo && prestacaoDeContas && ( (prestacaoDeContas[motivo] && prestacaoDeContas[motivo].length > 0) || prestacaoDeContas[outros_motivos])  &&
                        <div className='col-12 mt-3'>
                            <strong><label>Motivo(s)</label></strong>
 
                            {juntaMotivos(prestacaoDeContas[motivo], prestacaoDeContas[outros_motivos]).map((motivo, index) => (
                                <strong key={index}><p className="lista-motivos mb-0" key={index}>{index+1}. {motivo}</p></strong>
                            ))}
                        </div>   
                    }

                    {exibeRecomendacoes && prestacaoDeContas && prestacaoDeContas[recomendacoes] &&
                        <div className='col-12 mt-3'>
                            <strong><label>Recomendações</label></strong>

                            <p>{prestacaoDeContas[recomendacoes]}</p>
                        </div>  
                    } 
                </div>
            </form>
        </>
    )
};