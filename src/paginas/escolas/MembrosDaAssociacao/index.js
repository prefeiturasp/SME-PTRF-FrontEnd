import React from "react";
import {PaginasContainer} from "../../PaginasContainer";

// TODO Remover esse componente, nova versão abaixo
import {MembrosDaAssociacao} from "../../../componentes/escolas/Associacao/Membros";

// TODO Remover alias quando concluido
// Nova versão com mandatos e composições
import {MembrosDaAssociacao as NovoMembrosAssociacao} from '../../../componentes/escolas/MembrosDaAssociacao';

// Nova versão v2 (ComposicaoVacancia/CargoComposicaoVacancia) - módulo isolado, não
// reaproveita nem altera nada de componentes/escolas/MembrosDaAssociacao (v1)
import {MembrosDaAssociacaoVacancia} from '../../../componentes/escolas/MembrosDaAssociacaoVacancia';

import {TopoComBotoes} from "../../../componentes/escolas/Associacao/TopoComBotoes";
import {visoesService} from "../../../services/visoes.service";
import { ExportaDadosAssociacaoProvider } from "../../../componentes/escolas/Associacao/ExportaDadosAssociacao/context/ExportaDadosAssociacao";

export const MembrosDaAssociacaoPage = () => {
    // Prioridade: v2 > v1 > legada. Com a v2 ativa, ignora a v1 mesmo que também esteja
    // ativa - nunca as duas juntas.
    const v2Ativa = visoesService.featureFlagAtiva('historico-de-membros-v2');
    const v1Ativa = visoesService.featureFlagAtiva('historico-de-membros');
    return (
        <PaginasContainer>
            <TopoComBotoes tituloPagina="Membros"/>
            <div className="page-content-inner">
                {v2Ativa ? (
                    <MembrosDaAssociacaoVacancia/>
                ) : v1Ativa ? (
                    <ExportaDadosAssociacaoProvider>
                        <NovoMembrosAssociacao/>
                    </ExportaDadosAssociacaoProvider>
                ) : (
                    <MembrosDaAssociacao/>
                )}
            </div>
        </PaginasContainer>
    )
};