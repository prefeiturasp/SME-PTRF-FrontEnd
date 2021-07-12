import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";

export const FormRecebimentoPelaDiretoria = ({stateFormRecebimentoPelaDiretoria, handleChangeFormRecebimentoPelaDiretoria, disabledNome, disabledData, disabledStatus, tabelaPrestacoes, prestacaoDeContas, exibeMotivo}) =>{
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
                            className="form-control"
                            disabled={disabledStatus}
                        >
                            {tabelaPrestacoes.status && tabelaPrestacoes.status.length > 0 && tabelaPrestacoes.status.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    {exibeMotivo && prestacaoDeContas && (prestacaoDeContas.motivos_aprovacao_ressalva || prestacaoDeContas.outros_motivos_aprovacao_ressalva)  &&
                        <div className='col-12 mt-3'>
                            <label htmlFor="motivo">Motivos:</label>
                            <div className='border container-exibe-motivos p-2'>
                                {prestacaoDeContas.motivos_aprovacao_ressalva && prestacaoDeContas.motivos_aprovacao_ressalva.length > 0 && prestacaoDeContas.motivos_aprovacao_ressalva.map((motivo)=>(
                                    <p key={motivo.uuid}>{motivo.motivo}</p>
                                ))}
                                {prestacaoDeContas.outros_motivos_aprovacao_ressalva &&
                                    <p>{prestacaoDeContas.outros_motivos_aprovacao_ressalva}</p>
                                }
                            </div>
                        </div>
                    }
                </div>
            </form>
        </>
    )
};