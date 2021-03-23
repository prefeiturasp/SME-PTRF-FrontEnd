import React, {useCallback, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import "./consulta-saldos-bancarios.css"
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {getPeriodos, getTiposDeConta, getSaldosPorTipoDeUnidade, getSaldosPorDre, getSaldosPorUeDre} from "../../../services/sme/ConsultaDeSaldosBancarios.service";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";
import {SelectPeriodo} from "./SelectPeriodo";
import {SelectConta} from "./SelectConta";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg"
import {TabelaSaldosPorTipoDeUnidade} from "./TabelaSaldosPorTipoDeUnidade";
import {TabelaSaldosPorDre} from "./TabelaSaldosPorDre";
import {TabelaSaldosPorUeDre} from "./TabelaSaldosPorUeDre";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

export const ConsultaDeSaldosBancarios = () => {

    let {periodo_uuid, conta_uuid} = useParams();

    const [periodos, setPeriodos] = useState([])
    const [selectPeriodo, setSelectPeriodo] = useState(periodo_uuid);
    const [tiposDeConta, setTiposDeConta] = useState([])
    const [selectTipoDeConta, setSelectTipoDeConta] = useState(conta_uuid);
    const [saldosPorTipoDeUnidade, setSaldosPorTipoDeUnidade] = useState([])
    const [saldosPorDre, setSaldosDre] = useState([])
    const [saldosPorUeDre, setSaldosPorUeDre] = useState([])

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

    const carregaSaldosPorDre = useCallback(async ()=>{
        if (selectPeriodo && selectTipoDeConta){
            let saldos_por_dre = await getSaldosPorDre(selectPeriodo, selectTipoDeConta)
            setSaldosDre(saldos_por_dre)
        }
    }, [selectPeriodo, selectTipoDeConta])


    const carregaSaldosUeDre = useCallback(async ()=>{
        if (selectPeriodo && selectTipoDeConta){
            let saldos_por_ue_dre = await getSaldosPorUeDre(selectPeriodo, selectTipoDeConta)
            setSaldosPorUeDre(saldos_por_ue_dre)
        }
    }, [selectPeriodo, selectTipoDeConta])

    useEffect(()=>{
        carregaSaldosPorTipoDeUnidade()
    }, [carregaSaldosPorTipoDeUnidade])

    useEffect(()=>{
        carregaSaldosPorDre()
    }, [carregaSaldosPorDre])

    useEffect(()=>{
        carregaSaldosUeDre()
    }, [carregaSaldosUeDre])

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const retornaTituloCelulasTabelaSaldosPorUeDre = useCallback(()=>{
        if (saldosPorUeDre && saldosPorUeDre[0] && saldosPorUeDre[0].associacoes && saldosPorUeDre[0].associacoes.length > 0){
            let primeiro_item_array = saldosPorUeDre[0].associacoes
            return (
                <>
                    <th scope="col">DRE</th>
                    {primeiro_item_array.map((titulo)=>(
                        <th key={titulo.associacao} scope="col">{titulo.associacao}</th>
                    ))}
                    <th scope="col">&nbsp;</th>
                </>

            )
        }
    }, [saldosPorUeDre]) ;

    const acoesTemplate = (dre_uuid) =>{
        return (
            <div>
                <Link
                    to={`/consulta-de-saldos-bancarios-detalhes-associacoes/${selectPeriodo}/${selectTipoDeConta}/${dre_uuid}`}
                >
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEye}
                    />
                </Link>
            </div>
        )
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
                                <a onClick={()=>carregaSaldosPorDre()} className="nav-link tab-saldos-bancarios" id="nav-por-dre-tab" data-toggle="tab" href="#nav-por-dre" role="tab" aria-controls="nav-por-dre" aria-selected="false">Exibição por Diretoria</a>
                                <a onClick={()=>carregaSaldosUeDre()} className="nav-link tab-saldos-bancarios" id="nav-por-ue-dre-tab" data-toggle="tab" href="#nav-por-ue-dre" role="tab" aria-controls="nav-por-ue-dre" aria-selected="false">Exibição por tipo de UE e DRE</a>
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
                                <TabelaSaldosPorDre
                                    saldosPorDre={saldosPorDre}
                                    valorTemplate={valorTemplate}
                                />
                            </div>
                            <div className="tab-pane fade" id="nav-por-ue-dre" role="tabpanel" aria-labelledby="nav-por-ue-dre-tab">
                                <TabelaSaldosPorUeDre
                                    saldosPorUeDre={saldosPorUeDre}
                                    valorTemplate={valorTemplate}
                                    retornaTituloCelulasTabelaSaldosPorUeDre={retornaTituloCelulasTabelaSaldosPorUeDre}
                                    acoesTemplate={acoesTemplate}
                                />
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