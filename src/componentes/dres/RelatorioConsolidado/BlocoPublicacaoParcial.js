import React, {useState, memo} from "react";
import {visoesService} from "../../../services/visoes.service";
import { getExecucaoFinanceira } from "../../../services/dres/RelatorioConsolidado.service";
import PublicarDocumentos from "./PublicarDocumentos";
import DemonstrativoDaExecucaoFisicoFinanceira from "./DemonstrativoDaExecucaoFisicoFinanceira";
import PreviaDocumentos from "./PreviaDocumento";
import {AtaParecerTecnico} from "./AtaParecerTecnico";
import Lauda from "./Lauda";

const BlocoPublicacaoParcial = ({ 
    consolidadoDre,
    publicarConsolidadoDre,
    podeGerarPrevia,
    carregaConsolidadosDreJaPublicadosProximaPublicacao,
    todasAsPcsDaRetificacaoConcluidas,
    publicarRetificacao,
    showPublicarRetificacao,
    setShowPublicarRetificacao,
    periodoEscolhido,
    gerarPreviaRetificacao,
    gerarPreviaConsolidadoDre,
    podeAcessarInfoConsolidado,
    podeGerarPreviaRetificacao }) => {

    const [execucaoFinanceiraCarregando, setExecucaoFinanceiraCarregando] = useState(true);
    const [execucaoFinanceira, setExecucaoFinanceira] = useState(false);

    const carregaExecucaoFinanceira = async () => {
        const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');
        try {
            const execFinanceira = await getExecucaoFinanceira(dre_uuid, periodoEscolhido,  consolidadoDre?.uuid !== 'null' ? consolidadoDre?.uuid : '');

            setExecucaoFinanceira(execFinanceira);
            return setExecucaoFinanceiraCarregando(false);
        } catch (e) {
            console.log("Erro ao carregar execução financeira ", e)
        }
    }

    useState(() => {
        carregaExecucaoFinanceira();
    }, [consolidadoDre])

    return (
        <>
            <div className='mt-3'>
                <PublicarDocumentos
                    publicarConsolidadoDre={publicarConsolidadoDre}
                    podeGerarPrevia={podeGerarPrevia}
                    consolidadoDre={consolidadoDre}
                    carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                    todasAsPcsDaRetificacaoConcluidas={todasAsPcsDaRetificacaoConcluidas}
                    publicarRetificacao={publicarRetificacao}
                    showPublicarRetificacao={showPublicarRetificacao}
                    setShowPublicarRetificacao={setShowPublicarRetificacao}
                    gerarPreviaRetificacao={gerarPreviaRetificacao}
                    execucaoFinanceiraCarregando={execucaoFinanceiraCarregando}
                    execucaoFinanceira={execucaoFinanceira}
                >
                    <PreviaDocumentos
                        gerarPreviaConsolidadoDre={gerarPreviaConsolidadoDre}
                    />
                    
                </PublicarDocumentos>
                <DemonstrativoDaExecucaoFisicoFinanceira
                    consolidadoDre={consolidadoDre}
                    periodoEscolhido={periodoEscolhido}
                    podeAcessarInfoConsolidado={podeAcessarInfoConsolidado}
                    execucaoFinanceira={execucaoFinanceira}
                />
                <AtaParecerTecnico
                    consolidadoDre={consolidadoDre}
                    podeGerarPreviaRetificacao={podeGerarPreviaRetificacao(consolidadoDre)}
                    podeAcessarInfoConsolidado={podeAcessarInfoConsolidado}
                />
                <Lauda
                    consolidadoDre={consolidadoDre}
                />
            </div>
        </>
    )
}

export default memo(BlocoPublicacaoParcial)