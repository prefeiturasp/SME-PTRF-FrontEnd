import React, {useEffect, useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import {
    getExecucaoFinanceira,
    getJustificativa,
    postJustificativa,
    patchJustificativa,
    getConsolidadoDre
} from "../../../../services/dres/RelatorioConsolidado.service";
import {TopoComBotoes} from "./TopoComBotoes";
import {visoesService} from "../../../../services/visoes.service";
import {TabelaExecucaoFinanceira} from "./TabelaExecucaoFinanceira";
import {JustificativaDiferenca} from "./JustificativaDiferenca";
import {auxGetNomes} from "../auxGetNomes";
import {ModalSalvarJustificativa} from "../ModalSalvarJustificativa";
import Loading from "../../../../utils/Loading";

export const RelatorioConsolidadoEmTela = () => {

    let {periodo_uuid, conta_uuid, ja_publicado, consolidado_dre_uuid} = useParams();

    // Para bloquear as edições quando for de um Consolidado DRE incremental publicacoes_anteriores
    // eslint-disable-next-line no-eval
    const jaPublicado = eval(ja_publicado)

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const initJustificativa = {
        uuid: '',
        dre: dre_uuid,
        periodo: periodo_uuid,
        tipo_conta: conta_uuid,
        texto: ''
    };

    const [periodoNome, setPeriodoNome] = useState('');
    const [execucaoFinanceira, setExecucaoFinanceira] = useState(false);
    const [justificativaDiferenca, setJustificativaDiferenca] = useState(initJustificativa);
    const [btnSalvarJustificativaDisable, setBtnSalvarJustificativaDisable] = useState(true);
    const [showSalvarJustificativa, setShowSalvarJustificativa] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ePrevia, setEPrevia] = useState(true);


    // Consolidado DRE
    const [consolidadoDre, setConsolidadoDre] = useState(false);

    useEffect(() => {
        carregaNomePeriodo();
        carregaJustificativa();
    }, []);

    useEffect( () => {
        if(!consolidadoDre || consolidadoDre.versao === 'PREVIA'){
            setEPrevia(true);
        }
        else {
            setEPrevia(false);
        }
    }, [consolidadoDre])

    // Consolidado DRE
    const carregaConsolidadoDre = useCallback(async () => {
        if (dre_uuid && periodo_uuid){
            try {
                let consolidado_dre = await getConsolidadoDre(dre_uuid, periodo_uuid)
                console.log('Consolidado DRE:', consolidado_dre)
                if (consolidado_dre && consolidado_dre.length > 0){
                    setConsolidadoDre(consolidado_dre[0])
                }else {
                    setConsolidadoDre(false)
                }
            }catch (e) {
                console.log("Erro ao buscar Consolidado Dre ", e)
            }
        }
    }, [dre_uuid, periodo_uuid])

    useEffect(() => {
        carregaConsolidadoDre()
    }, [carregaConsolidadoDre])


    const carregaNomePeriodo = async () => {
        if (periodo_uuid) {
            let periodo_nome = await auxGetNomes.nomePeriodo(periodo_uuid);
            setPeriodoNome(periodo_nome);
        }
    };

    const carregaExecucaoFinanceira = useCallback( async () => {
        try {
            let execucao = await getExecucaoFinanceira(dre_uuid, periodo_uuid,  consolidado_dre_uuid !== 'null' ? consolidado_dre_uuid : '');
            console.log("Execução Financeira:", execucao)
            setExecucaoFinanceira(execucao);
        } catch (e) {
            console.log("Erro ao carregar execução financeira ", e)
        }
    }, [dre_uuid, periodo_uuid, consolidado_dre_uuid]);

    useEffect(() => {
        carregaExecucaoFinanceira();
    }, [carregaExecucaoFinanceira]);


    const carregaJustificativa = async () => {
        try {
            let justificativa = await getJustificativa(dre_uuid, periodo_uuid, conta_uuid);
            if (justificativa && justificativa.length > 0) {
                setJustificativaDiferenca(justificativa[0])
            }
        } catch (e) {
            console.log("Erro ao carregar justificativa ", e)
        }
    };

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const comparaValores = () => {
        if (execucaoFinanceira) {
            return execucaoFinanceira.repasses_previstos_sme_custeio !== execucaoFinanceira.repasses_no_periodo_custeio ||
                execucaoFinanceira.repasses_previstos_sme_capital !== execucaoFinanceira.repasses_no_periodo_capital ||
                execucaoFinanceira.repasses_previstos_sme_livre !== execucaoFinanceira.repasses_no_periodo_livre ||
                execucaoFinanceira.repasses_previstos_sme_total !== execucaoFinanceira.repasses_no_periodo_total;
        }
    };

    const onChangeJustificativaDiferenca = (justificativa_texto) => {
        setBtnSalvarJustificativaDisable(false);
        setJustificativaDiferenca({
            ...justificativaDiferenca,
            texto: justificativa_texto
        })
    };

    const onSubmitJustificativaDiferenca = async () => {
        if (justificativaDiferenca && justificativaDiferenca.uuid) {
            let payload = {
                texto: justificativaDiferenca.texto
            };
            await patchJustificativa(justificativaDiferenca.uuid, payload)
            setShowSalvarJustificativa(true);
            setBtnSalvarJustificativaDisable(true);
        } else {
            delete justificativaDiferenca.uuid;
            await postJustificativa(justificativaDiferenca)
            setShowSalvarJustificativa(true);
            setBtnSalvarJustificativaDisable(true);
        }
    };


    const onHandleCloseSalvarJustificativa = () => {
        setShowSalvarJustificativa(false);
    }

    const versaoConsolidadoDRE = () => {
        if(!consolidadoDre){
            return "PREVIA";
        }
        else {
            return consolidadoDre.versao;
        }
    }

    return (
        <>

            <div className="col-12 container-visualizacao-da-ata mb-5">
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
                        <div className="col-12 mt-5">
                            <TopoComBotoes
                                periodoNome={periodoNome}
                                ePrevia={ePrevia}
                            />
                            <TabelaExecucaoFinanceira
                                execucaoFinanceira={execucaoFinanceira}
                                valorTemplate={valorTemplate}
                                comparaValores={comparaValores}
                            />
                            <JustificativaDiferenca
                                comparaValores={comparaValores}
                                justificativaDiferenca={justificativaDiferenca}
                                setJustificativaDiferenca={setJustificativaDiferenca}
                                onChangeJustificativaDiferenca={onChangeJustificativaDiferenca}
                                onSubmitJustificativaDiferenca={onSubmitJustificativaDiferenca}
                                btnSalvarJustificativaDisable={btnSalvarJustificativaDisable}
                                setBtnSalvarJustificativaDisable={setBtnSalvarJustificativaDisable}
                                jaPublicado={jaPublicado}
                            />
                        </div>
                        <section>
                            <ModalSalvarJustificativa
                                show={showSalvarJustificativa}
                                handleClose={onHandleCloseSalvarJustificativa}
                            />
                        </section>
                    </>

                }

            </div>


        </>
    )
};