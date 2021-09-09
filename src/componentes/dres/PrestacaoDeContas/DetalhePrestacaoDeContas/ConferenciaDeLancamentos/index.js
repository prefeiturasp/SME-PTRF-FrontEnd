import React, {useEffect, useState, memo} from "react";
import {getLancamentosParaConferencia} from "../../../../../services/dres/PrestacaoDeContas.service";
import {TabsConferenciaDeLancamentos} from "./TabsConferenciaDeLancamentos";

const ConferenciaDeLancamentos = ({infoAta, toggleBtnEscolheConta, clickBtnEscolheConta, prestacaoDeContas}) =>{
    const [lancamentosParaConferencia, setLancamentosParaConferencia] = useState([])
    const [loadingLancamentosParaConferencia, setLoadingLancamentosParaConferencia] = useState(true)
    const [contaUuid, setContaUuid] = useState('')

    useEffect(()=>{
        if (infoAta && infoAta.contas && infoAta.contas.length > 0){
            carregaLancamentosParaConferencia(prestacaoDeContas, infoAta.contas[0].conta_associacao.uuid)
        }
    }, [prestacaoDeContas, infoAta])


    const carregaLancamentosParaConferencia = async (prestacao_de_contas, conta_uuid, filtrar_por_acao=null, filtrar_por_lancamento=null) =>{
        console.log("ConferenciaDeLancamentos ")
        setContaUuid(conta_uuid)
        setLoadingLancamentosParaConferencia(true)
        if (prestacao_de_contas && prestacao_de_contas.uuid && prestacao_de_contas.analise_atual && prestacao_de_contas.analise_atual.uuid && conta_uuid){
            //setContaUuid(conta_uuid)
            let lancamentos =  await getLancamentosParaConferencia(prestacao_de_contas.uuid, prestacao_de_contas.analise_atual.uuid, conta_uuid, filtrar_por_acao, filtrar_por_lancamento)

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
        }
        setLoadingLancamentosParaConferencia(false)
    }

    return(
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
        />
    )
}
export default memo(ConferenciaDeLancamentos)