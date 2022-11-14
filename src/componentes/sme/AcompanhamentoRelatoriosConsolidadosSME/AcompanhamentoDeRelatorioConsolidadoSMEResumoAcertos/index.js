import React, {useEffect} from 'react'
import { useParams } from 'react-router-dom';
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getResumoConsolidado} from "../../../../services/sme/AcompanhamentoSME.service"
import { TopoComBotoes } from './TopoComBotoes'
import { TabsConferencia } from './TabsConferencia'
import { VisualizaDevolucoes } from './VisualizaDevolucoes'


export const AcompanhamentoDeRelatorioConsolidadoSMEResumoAcertos = () => {
    const params = useParams()

    useEffect(() => {
        async function pegaDadosResumoConsolidado() {
            const response = await getResumoConsolidado(params.consolidado_dre_uuid)
        }
        pegaDadosResumoConsolidado()
    }, [])

    const handleChangeTab = (key, event) => {
        return ''
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento da documentação da DRE</h1>
            <TopoComBotoes />
            <TabsConferencia/>
            <VisualizaDevolucoes/>
        </PaginasContainer>
    )
}