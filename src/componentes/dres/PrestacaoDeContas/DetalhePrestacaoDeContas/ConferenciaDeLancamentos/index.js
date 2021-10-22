import React, {useEffect, useState, memo} from "react";
import {getLancamentosParaConferencia, getUltimaAnalisePc} from "../../../../../services/dres/PrestacaoDeContas.service";
import {TabsConferenciaDeLancamentos} from "./TabsConferenciaDeLancamentos";

const ConferenciaDeLancamentos = ({infoAta, toggleBtnEscolheConta, clickBtnEscolheConta, prestacaoDeContas, editavel=true}) =>{
    const [lancamentosParaConferencia, setLancamentosParaConferencia] = useState([])
    const [loadingLancamentosParaConferencia, setLoadingLancamentosParaConferencia] = useState(true)
    const [contaUuid, setContaUuid] = useState('')

    useEffect(()=>{
        if (infoAta && infoAta.contas && infoAta.contas.length > 0){
            carregaLancamentosParaConferencia(prestacaoDeContas, infoAta.contas[0].conta_associacao.uuid)
        }
    }, [prestacaoDeContas, infoAta])


    const carregaLancamentosParaConferencia = async (prestacao_de_contas, conta_uuid, filtrar_por_acao=null, filtrar_por_lancamento=null) =>{
        setContaUuid(conta_uuid)
        setLoadingLancamentosParaConferencia(true)

        let lancamentos;

        if (editavel){
            if (prestacao_de_contas && prestacao_de_contas.uuid && prestacao_de_contas.analise_atual && prestacao_de_contas.analise_atual.uuid && conta_uuid){
                lancamentos =  await getLancamentosParaConferencia(prestacao_de_contas.uuid, prestacao_de_contas.analise_atual.uuid, conta_uuid, filtrar_por_acao, filtrar_por_lancamento)
            }
        }else {
            if (prestacao_de_contas && prestacao_de_contas.uuid){
                let ultima_analise =  await getUltimaAnalisePc(prestacao_de_contas.uuid)

                if (ultima_analise && ultima_analise.uuid){
                    lancamentos =  await getLancamentosParaConferencia(prestacao_de_contas.uuid, ultima_analise.uuid, conta_uuid, filtrar_por_acao, filtrar_por_lancamento)
                }
            }
        }

        // Adicionando a propriedade selecionando todos os itens
        if (lancamentos && lancamentos.length > 0){
            let unis = lancamentos.map((lancamento)=>{
                return {
                    ...lancamento,
                    selecionado: false
                }
            })
            setLancamentosParaConferencia(unis)
        }else {
            setLancamentosParaConferencia([])
        }
        setLoadingLancamentosParaConferencia(false)
    }

    return(
        <>
            <hr id='conferencia_de_lancamentos' className='mt-4 mb-3'/>
            <h4 className='mb-4'>Conferência de lançamentos</h4>

            <TabsConferenciaDeLancamentos
                infoAta={infoAta}
                toggleBtnEscolheConta={toggleBtnEscolheConta}
                clickBtnEscolheConta={clickBtnEscolheConta}
                carregaLancamentosParaConferencia={carregaLancamentosParaConferencia}
                prestacaoDeContas={prestacaoDeContas}
                setLancamentosParaConferencia={setLancamentosParaConferencia}
                lancamentosParaConferencia={lancamentosParaConferencia}
                loadingLancamentosParaConferencia={loadingLancamentosParaConferencia}
                contaUuid={contaUuid}
                editavel={editavel}
            />
        </>

    )
}
export default memo(ConferenciaDeLancamentos)