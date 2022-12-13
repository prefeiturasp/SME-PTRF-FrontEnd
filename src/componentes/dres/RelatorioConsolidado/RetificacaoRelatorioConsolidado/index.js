import React, {memo, useCallback, useEffect, useState} from "react";
import { PaginasContainer } from "../../../../paginas/PaginasContainer";
import '../relatorio-consolidado.scss'
import { Cabecalho } from "./Cabecalho";
import { MotivoRetificacao } from "./MotivoRetificacao";
import {useHistory, useParams} from "react-router-dom";
import { detalhamentoConsolidadoDRE } from "../../../../services/sme/AcompanhamentoSME.service";
import Loading from "../../../../utils/Loading";
import { PERIODO_RELATORIO_CONSOLIDADO_DRE } from "../../../../services/auth.service";
import { exibeDataPT_BR } from "../../../../utils/ValidacoesAdicionaisFormularios";

const RetificacaoRelatorioConsolidado = () => {
    const [relatorioConsolidado, setRelatorioConsolidado] = useState(false)
    const [loading, setLoading] = useState(true);

    const {relatorio_consolidado_uuid} = useParams();
    const history = useHistory();
    
    const carregaConsolidado = useCallback(async () => {
        if(relatorio_consolidado_uuid){
            let consolidado = await (await detalhamentoConsolidadoDRE(relatorio_consolidado_uuid)).data;
            setRelatorioConsolidado(consolidado);
            setLoading(false);
        }

    }, [relatorio_consolidado_uuid])

    useEffect(() => {
        carregaConsolidado()
    }, [carregaConsolidado])

    const onClickVoltar = () => {
        if(relatorioConsolidado && relatorioConsolidado.periodo){
            let uuid_periodo = relatorioConsolidado.periodo.uuid;
            localStorage.setItem(PERIODO_RELATORIO_CONSOLIDADO_DRE, uuid_periodo);
            history.push(`/dre-relatorio-consolidado/`)
        }
    }

    const formataPeriodo = () => {
        if(relatorioConsolidado && relatorioConsolidado.periodo){
            let periodo_formatado = `${relatorioConsolidado.periodo.referencia} - ${exibeDataPT_BR(relatorioConsolidado.periodo.data_inicio_realizacao_despesas)} à ${exibeDataPT_BR(relatorioConsolidado.periodo.data_fim_realizacao_despesas)}`;
            return periodo_formatado;
        }

        return "";
    }


    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Retificação de relatórios</h1>
            <>
                <div className="page-content-inner pt-0">
                    {loading ? (
                        <div className="mt-5">
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        </div>
                    ) :
                        <>
                            <Cabecalho
                                relatorioConsolidado={relatorioConsolidado}
                                onClickVoltar={onClickVoltar}
                                formataPeriodo={formataPeriodo}
                            />

                            <MotivoRetificacao
                            />

                        </>
                    }


                    
                </div>
            </>
        </PaginasContainer>
    )
}

export default memo(RetificacaoRelatorioConsolidado)