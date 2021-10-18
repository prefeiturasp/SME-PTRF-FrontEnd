import React, {memo, useEffect, useState} from "react";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import {getAnalisesDePcDevolvidas} from "../../../../../services/dres/PrestacaoDeContas.service";
import {exibeDataPT_BR} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import './devolutiva-da-associacao.scss'

const DevolutivaDaAssociacao = ({prestacaoDeContas, dataRecebimentoDevolutiva, handleChangedataRecebimentoDevolutiva, editavel=true}) => {

    const [prazoReevio, setPrazoReevio] = useState('')

    useEffect(()=>{
        let mounted = true;
        const carregaAnalisesDePcDevolvidas = async () => {
            if (mounted) {
                let analises_pc_devolvidas = await getAnalisesDePcDevolvidas(prestacaoDeContas.uuid)
                if (analises_pc_devolvidas && analises_pc_devolvidas.length > 0) {
                    let analises_pc_devolvidas_montada_reverse = analises_pc_devolvidas.reverse()
                    setPrazoReevio(exibeDataPT_BR(analises_pc_devolvidas_montada_reverse[0].devolucao_prestacao_conta.data_limite_ue))
                }
            }
        }
        carregaAnalisesDePcDevolvidas()
        return () =>{
            mounted = false;
        }
    }, [prestacaoDeContas])

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-4'>Devolutiva da Associação</h4>
            <div className='d-flex align-items-center'>
                <div className='col-4 pl-0'>
                    <p className='mb-0 fonte-16'><strong>Prazo de reenvio: <span className='texto-prazo-de-reenvio'>{prazoReevio}</span></strong></p>
                </div>
                <div className='col-8'>
                    <div className='d-flex align-items-center'>
                        <div className="col-auto">
                            <p className='mb-0 fonte-16'>Data de recebimento da devolutiva:</p>
                        </div>
                        <div className='col'>
                            <DatePickerField
                                name="data_recebimento_da_devolutiva"
                                id="data_recebimento_da_devolutiva"
                                value={dataRecebimentoDevolutiva ? dataRecebimentoDevolutiva : ''}
                                onChange={handleChangedataRecebimentoDevolutiva}
                                disabled={!editavel}
                            />

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default memo(DevolutivaDaAssociacao)