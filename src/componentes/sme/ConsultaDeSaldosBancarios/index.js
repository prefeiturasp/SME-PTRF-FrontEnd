import React, {useCallback, useEffect, useState} from "react";
import "./consulta-saldos-bancarios.css"
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {getPeriodos, getTiposDeConta, getSaldosPorTipoDeUnidade} from "../../../services/sme/ConsultaDeSaldosBancarios.service";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";
import {SelectPeriodo} from "./SelectPeriodo";
import {SelectConta} from "./SelectConta";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg"
import {TabelaSaldosPorTipoDeUnidade} from "./TabelaSaldosPorTipoDeUnidade";

export const ConsultaDeSaldosBancarios = () => {

    const [periodos, setPeriodos] = useState([])
    const [selectPeriodo, setSelectPeriodo] = useState('');
    const [tiposDeConta, setTiposDeConta] = useState([])
    const [selectTipoDeConta, setSelectTipoDeConta] = useState('');
    const [saldosPorTipoDeUnidade, setSaldosPorTipoDeUnidade] = useState([])

    const carregaPeriodos = useCallback(async () => {
        let periodos = await getPeriodos()
        setPeriodos(periodos)
    }, [])

    const carregaTiposDeConta = useCallback(async () => {
        let tipos_de_conta = await getTiposDeConta()
        setTiposDeConta(tipos_de_conta)
    }, [])

    useEffect(() => {
        carregaPeriodos()
        carregaTiposDeConta()
    }, [carregaPeriodos, carregaTiposDeConta])

    const handleChangeConta = async (conta_uuid) => {
        setSelectTipoDeConta(conta_uuid);
    };

    const handleChangePeriodo = async (periodo_uuid) => {
        setSelectPeriodo(periodo_uuid);
    };

    const carregaSaldosPorTipoDeUnidade = useCallback(async ()=>{
        if (selectPeriodo && selectTipoDeConta){
            let saldos_por_tipo_de_unidade = await getSaldosPorTipoDeUnidade(selectPeriodo, selectTipoDeConta)
            setSaldosPorTipoDeUnidade(saldos_por_tipo_de_unidade)
        }
    }, [selectPeriodo, selectTipoDeConta])

    useEffect(()=>{
        carregaSaldosPorTipoDeUnidade()
    }, [carregaSaldosPorTipoDeUnidade])

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Consulta de saldos bancários</h1>
            <div className="page-content-inner">
                <div className='row'>
                    <SelectPeriodo
                        periodosAssociacao={periodos}
                        handleChangePeriodo={handleChangePeriodo}
                        selectPeriodo={selectPeriodo}
                        exibeDataPT_BR={exibeDataPT_BR}
                    />
                    <SelectConta
                        handleChangeConta={handleChangeConta}
                        selectConta={selectTipoDeConta}
                        tiposConta={tiposDeConta}
                    />
                </div>
                {selectPeriodo && selectTipoDeConta ? (
                    <>
                        <nav className='mt-5'>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <a onClick={()=>carregaSaldosPorTipoDeUnidade()} className="nav-link tab-saldos-bancarios active" id="nav-por-tipo-de-unidade-tab" data-toggle="tab" href="#nav-por-tipo-de-unidade" role="tab" aria-controls="nav-por-tipo-de-unidade" aria-selected="true">Exibição por tipo de unidade</a>
                                <a className="nav-link tab-saldos-bancarios" id="nav-por-dre-tab" data-toggle="tab" href="#nav-por-dre" role="tab" aria-controls="nav-por-dre" aria-selected="false">Exibição por Diretoria</a>
                                <a className="nav-link tab-saldos-bancarios" id="nav-por-ue-dre-tab" data-toggle="tab" href="#nav-por-ue-dre" role="tab" aria-controls="nav-por-ue-dre" aria-selected="false">Exibição por tipo de UE e DRE</a>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id="nav-por-tipo-de-unidade" role="tabpanel" aria-labelledby="nav-por-tipo-de-unidade-tab">
                                <TabelaSaldosPorTipoDeUnidade
                                    saldosPorTipoDeUnidade={saldosPorTipoDeUnidade}
                                    valorTemplate={valorTemplate}
                                />
                            </div>
                            <div className="tab-pane fade" id="nav-por-dre" role="tabpanel" aria-labelledby="nav-por-dre-tab">
                                2 ...
                            </div>
                            <div className="tab-pane fade" id="nav-por-ue-dre" role="tabpanel" aria-labelledby="nav-por-ue-dre-tab">
                                3 ...
                            </div>
                        </div>
                    </>
                ):
                    <MsgImgCentralizada
                        texto='Selecione um período e um tipo de conta para consultar os saldos bancários'
                        img={Img404}
                    />
                }

            </div>
        </PaginasContainer>
    )
};