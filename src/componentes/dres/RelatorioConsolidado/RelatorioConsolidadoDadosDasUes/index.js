import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service";
import {auxGetNomes} from "../auxGetNomes";
import {TopoComBotoes} from "./TopoComBotoes";
import {getListaPrestacaoDeContasDaDre, getTiposDeUnidade, getStatusPc, getListaPrestacaoDeContasDaDreFiltros, getListaAssociacoesNaoRegularizadas} from "../../../../services/dres/RelatorioConsolidado.service";
import {TabelaListaPrestacoesDaDre} from "./TabelaListaPrestacoesDaDre";
import {FormFiltros} from "./FormFiltros";
import {MsgImgCentralizada} from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg"
import AssociacoesNaoRegularizadas from "./AssociacoesNaoRegularizadas";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {getAssociacao, getContasAssociacao} from "../../../../services/dres/Associacoes.service";
import {DADOS_DA_ASSOCIACAO} from "../../../../services/auth.service";
import Loading from "../../../../utils/Loading";

export const RelatorioConsolidadoDadosDasUes = () => {

    let {periodo_uuid, conta_uuid, ja_publicado} = useParams();

    console.log("XXXXXXXXXXXXX RelatorioConsolidadoDadosDasUes ", ja_publicado)

    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const initialStateFiltros = {
        filtrar_por_ue: "",
        filtrar_por_tipo_unidade: "",
        filtrar_por_status_pc: "",
    };

    const [periodoNome, setPeriodoNome] = useState('');
    const [contaNome, setContaNome] = useState('');
    const [listaPrestacoes, setListaPrestacoes] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [tiposDeUnidade, setTiposDeUnidade] = useState([]);
    const [statusPc, setStatusPc] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregaListaPrestacaoDeContasDaDre = useCallback(async ()=>{
        setLoading(true)
        let lista_de_prestacoes = await getListaPrestacaoDeContasDaDre(dre_uuid, periodo_uuid, conta_uuid);
        setListaPrestacoes(lista_de_prestacoes)
        setLoading(false)
    }, [dre_uuid, periodo_uuid, conta_uuid]);

    const carregaTiposDeUnidade = useCallback(async () => {
        let tipos = await getTiposDeUnidade();
        setTiposDeUnidade(tipos.tipos_unidade)
    }, []);

    const carregaStatusPc = useCallback(async () => {
        let status = await getStatusPc();
        setStatusPc(status.status)
    }, []);

    useEffect(()=>{
        carregaNomePeriodo();
        carregaNomeConta();
    });

    useEffect(()=>{
        carregaListaPrestacaoDeContasDaDre()
    }, [carregaListaPrestacaoDeContasDaDre]);

    useEffect(()=>{
        carregaTiposDeUnidade()
    }, [carregaTiposDeUnidade]);

    useEffect(()=>{
        carregaStatusPc()
    }, [carregaStatusPc]);

    const carregaNomePeriodo = async () => {
        if (periodo_uuid){
            let periodo_nome = await auxGetNomes.nomePeriodo(periodo_uuid);
            setPeriodoNome(periodo_nome);
        }
    };

    const carregaNomeConta = async () => {
        let conta_nome = await auxGetNomes.nomeConta(conta_uuid);
        setContaNome(conta_nome);
    };

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const limpaFiltros = async () => {
        await setStateFiltros(initialStateFiltros);
        await carregaListaPrestacaoDeContasDaDre();
    };

    const handleSubmitFiltros = async (event) => {
        event.preventDefault();
        let lista_prestacoes_filtros = await getListaPrestacaoDeContasDaDreFiltros(dre_uuid, periodo_uuid, conta_uuid, stateFiltros.filtrar_por_ue, stateFiltros.filtrar_por_tipo_unidade, stateFiltros.filtrar_por_status_pc);
        setListaPrestacoes(lista_prestacoes_filtros)
    };

    // Associacoes Nao Regularizadas
    const [listaAssociacoesNaoRegularizadas, setListaAssociacoesNaoRegularizadas] = useState([]);

    const carregaAssociacoesNaoRegularizadas = useCallback(async ()=>{
        setLoading(true)
        let assoc_nao_regul = await getListaAssociacoesNaoRegularizadas(dre_uuid);
        setListaAssociacoesNaoRegularizadas(assoc_nao_regul);
        setLoading(false)
    }, [dre_uuid]);

    useEffect(()=>{
        carregaAssociacoesNaoRegularizadas();
    }, [carregaAssociacoesNaoRegularizadas]);

    const handleClickAssociacoesNaoRegularizadas = useCallback(async (rowData)=>{
        try {
            setLoading(true)
            let associacao = await getAssociacao(rowData.uuid);
            let contas = await getContasAssociacao(rowData.uuid);

            let dados_da_associacao = {
                dados_da_associacao: {
                    ...associacao,
                    contas
                }
            };
            localStorage.setItem(DADOS_DA_ASSOCIACAO, JSON.stringify(dados_da_associacao));
            setLoading(false)
            window.location.assign(`/dre-detalhes-associacao/dre-relatorio-consolidado/${periodo_uuid}/${conta_uuid}`)
        }catch (e) {
            console.log("Erro ao buscar associação ", e)
            setLoading(false)
        }

    },[conta_uuid, periodo_uuid]);

    const nomeTemplate = useCallback((rowData, column)=>{
        return (
            <div>
                <span>{rowData.unidade.codigo_eol} - {rowData[column.field]}</span>
            </div>
        );
    }, []);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button onClick={()=>handleClickAssociacoesNaoRegularizadas(rowData)} className="btn-editar-membro">
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEye}
                    />
                </button>
            </div>
        )
    }, [handleClickAssociacoesNaoRegularizadas]);

    const motivoTemplate = useCallback((rowData, column)=>{
        return (
          <div>
              {rowData[column.field] ? (
                <span>{rowData[column.field]}</span>
              ):
                  <span className='span-motivo-associacao-nao-regularizada'>Informe motivo no “Ver regularidade” da Associação</span>
              }
          </div>
        );
    }, []);

    return (
        <>
            {loading ? (
                <div className="col-12 mt-5 pt-5">
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="50"
                        marginBottom="0"
                    />
                </div>
            ):
                <div className="col-12 container-visualizacao-da-ata mb-5">
                    <div className="col-12 mt-5">
                        <TopoComBotoes
                            periodoNome={periodoNome}
                            contaNome={contaNome}
                            periodo_uuid={periodo_uuid}
                            conta_uuid={conta_uuid}
                            jaPublicado={ja_publicado}
                        />
                        <AssociacoesNaoRegularizadas
                            listaAssociacoesNaoRegularizadas={listaAssociacoesNaoRegularizadas}
                            nomeTemplate={nomeTemplate}
                            motivoTemplate={motivoTemplate}
                            acoesTemplate={acoesTemplate}
                        />
                        <FormFiltros
                            handleChangeFiltros={handleChangeFiltros}
                            limpaFiltros={limpaFiltros}
                            handleSubmitFiltros={handleSubmitFiltros}
                            stateFiltros={stateFiltros}
                            tiposDeUnidade={tiposDeUnidade}
                            statusPc={statusPc}
                        />
                        {listaPrestacoes && listaPrestacoes.length > 0 ?(
                                <TabelaListaPrestacoesDaDre
                                    listaPrestacoes={listaPrestacoes}
                                    valorTemplate={valorTemplate}
                                />
                            ):
                            <MsgImgCentralizada
                                texto='Não encontramos nenhuma prestação de contas, tente novamente'
                                img={Img404}
                            />
                        }
                    </div>
                </div>
            }

        </>
    )
};