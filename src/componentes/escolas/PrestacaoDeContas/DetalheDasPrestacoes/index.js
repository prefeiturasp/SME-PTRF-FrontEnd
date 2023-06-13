import React, {useCallback, useEffect, useState, useContext} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import moment from "moment";
import {TopoComBotoes} from "./TopoComBotoes";
import TabelaValoresPendentesPorAcao from "./TabelaValoresPendentesPorAcao";
import {Justificativa} from "./Justivicativa";
import {getTabelasReceita} from "../../../../services/escolas/Receitas.service";
import {
    getConciliar,
    getDesconciliar,
    getObservacoes,
    getStatusPeriodoPorData,
    getTransacoes,
    patchConciliarDespesa,
    patchDesconciliarDespesa,
    getDownloadExtratoBancario,
    pathSalvarJustificativaPrestacaoDeConta,
    pathExtratoBancarioPrestacaoDeConta,
    getPodeEditarCamposExtrato
} from "../../../../services/escolas/PrestacaoDeContas.service";
import {getContas, getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../../services/escolas/Associacao.service";
import Loading from "../../../../utils/Loading";
import {SelectPeriodoConta} from "../SelectPeriodoConta";
import {MsgImgCentralizada} from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {tabelaValoresPendentes} from "../../../../services/escolas/TabelaValoresPendentesPorAcao.service";
import DataSaldoBancario from "./DataSaldoBancario";
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import TabelaTransacoes from "./TabelaTransacoes";
import {getDespesasTabelas} from "../../../../services/escolas/Despesas.service";
import {FiltrosTransacoes} from "./FiltrosTransacoes";
import { SidebarLeftService } from "../../../../services/SideBarLeft.service";
import { SidebarContext } from "../../../../context/Sidebar";
import { ModalLegendaInformacao } from "../../../Globais/ModalLegendaInformacao/ModalLegendaInformacao";
import {toastCustom} from "../../../Globais/ToastCustom";

export const DetalheDasPrestacoes = () => {
    let {periodo_uuid, conta_uuid} = useParams();
    const contextSideBar = useContext(SidebarContext);
    const origem = (new URLSearchParams(window.location.search)).get("origem")

    // Alteracoes
    const [loading, setLoading] = useState(true);
    const [loadingConciliadas, setLoadingConciliadas] = useState(true);
    const [loadingNaoConciliadas, setLoadingNaoConciliadas] = useState(true);

    const [observacaoUuid, setObservacaoUuid] = useState("");
    const [periodoConta, setPeriodoConta] = useState("");
    const [periodoFechado, setPeriodoFechado] = useState(true);
    const [permiteEditarCamposExtrato, setPermiteEditarCamposExtrato] = useState(false);
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [contaConciliacao, setContaConciliacao] = useState("");
    const [acaoLancamento, setAcaoLancamento] = useState("");
    const [acoesAssociacao, setAcoesAssociacao] = useState(false);

    const [textareaJustificativa, setTextareaJustificativa] = useState("");
    const [btnSalvarJustificativaDisable, setBtnSalvarJustificativaDisable] = useState(true);
    const [classBtnSalvarJustificativa, setClassBtnSalvarJustificativa] = useState("secondary");
    const [checkSalvarJustificativa, setCheckSalvarJustificativa] = useState(false);

    const [btnSalvarExtratoBancarioDisable, setBtnSalvarExtratoBancarioDisable] = useState(true);
    const [classBtnSalvarExtratoBancario, setClassBtnSalvarExtratoBancario] = useState("secondary");
    const [checkSalvarExtratoBancario, setCheckSalvarExtratoBancario] = useState(false);

    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false);
    const parametros = useLocation();

    useEffect(()=>{
        getPeriodoConta();
        getAcaoLancamento();
        carregaTabelas();
        carregaPeriodos();
    }, []);

    useEffect(() => {
        localStorage.setItem('periodoConta', JSON.stringify(periodoConta));
        carregaContas();
    }, [periodoConta]);

    useEffect(()=>{
        carregaObservacoes();
    }, [periodoConta, acoesAssociacao, acaoLancamento]);

    useEffect(()=>{
        setLoading(false)
    }, []);

    useEffect(() => {
            verificaSePeriodoEstaAberto(periodoConta.periodo)
        }, [periodoConta, periodosAssociacao]
    );

    const getPeriodoConta = () => {
        if(periodo_uuid){
            setPeriodoConta({periodo: periodo_uuid, conta: conta_uuid ? conta_uuid : ""});
        } else if (localStorage.getItem('periodoConta')) {
            const periodoConta = JSON.parse(localStorage.getItem('periodoConta'));
            setPeriodoConta(periodoConta)
        } else {
            setPeriodoConta({periodo: "", conta: ""})
        }
    };

    const getAcaoLancamento = () => {
        let acao_lancamento = JSON.parse(localStorage.getItem('acaoLancamento'));
        if (acao_lancamento) {
            const files = JSON.parse(localStorage.getItem('acaoLancamento'));
            setAcaoLancamento(files);
        } else {
            setAcaoLancamento({acao: "", lancamento: ""})
        }
    };

    const carregaTabelas = async () => {
        await getTabelasReceita().then(response => {
            setContasAssociacao(response.data.contas_associacao);
            setAcoesAssociacao(response.data.acoes_associacao);
        }).catch(error => {
            console.log(error);
        });
    };

    const carregaPeriodos = async () => {
        let ignorar_devolvidas = false
        let periodos = await getPeriodosDePrestacaoDeContasDaAssociacao(ignorar_devolvidas);
        setPeriodosAssociacao(periodos);
    };

    const carregaContas = async () => {
        await getContas().then(response => {
            const files = JSON.parse(localStorage.getItem('periodoConta'));
            if (files && files.conta !== "") {
                const conta = response.find(conta => conta.uuid === files.conta);
                setContaConciliacao(conta.tipo_conta.nome);
            }
        }).catch(error => {
            console.log(error);
        })
    };

    const conciliar = useCallback(async (rateio_uuid) => {
        await getConciliar(rateio_uuid, periodoConta.periodo);
    }, [periodoConta.periodo]) ;

    const desconciliar = useCallback(async (rateio_uuid) => {
        await getDesconciliar(rateio_uuid, periodoConta.periodo);
    }, [periodoConta.periodo]) ;


    const handleChangePeriodoConta = (name, value) => {
        setCheckSalvarJustificativa(false);
        setCheckSalvarExtratoBancario(false);
        setBtnSalvarExtratoBancarioDisable(true);
        setPeriodoConta({
            ...periodoConta,
            [name]: value
        });
    };

    const handleChangeTextareaJustificativa = (event) => {
        setTextareaJustificativa(event.target.value);
        setBtnSalvarJustificativaDisable(false);
        setCheckSalvarJustificativa(false);
        setClassBtnSalvarJustificativa("success");
    };

    const carregaObservacoes = async () => {

        if (periodoConta.periodo && periodoConta.conta) {
            let periodo_uuid = periodoConta.periodo;
            let conta_uuid = periodoConta.conta;

            let observacao = await getObservacoes(periodo_uuid, conta_uuid);

            setObservacaoUuid(observacao.observacao_uuid)

            setTextareaJustificativa(observacao.observacao ? observacao.observacao : '');
            setDataSaldoBancario({
                data_extrato: observacao.data_extrato ? observacao.data_extrato : '',
                saldo_extrato: observacao.saldo_extrato ? observacao.saldo_extrato : 0,
            })
            setNomeComprovanteExtrato(observacao.comprovante_extrato ? observacao.comprovante_extrato : '')
            setDataAtualizacaoComprovanteExtrato(moment(observacao.data_atualizacao_comprovante_extrato).format("YYYY-MM-DD HH:mm:ss"))
            setDataAtualizacaoComprovanteExtratoView(moment(observacao.data_atualizacao_comprovante_extrato).format("DD/MM/YYYY HH:mm:ss"))
            if (observacao.comprovante_extrato && observacao.data_extrato){
                setExibeBtnDownload(true)
            }
            else if(!observacao.comprovante_extrato){
                setExibeBtnDownload(false)
            }
        }
    };

    const salvarJustificativa = async () => {
        let payload;

        payload = {
            "periodo_uuid": periodoConta.periodo,
            "conta_associacao_uuid": periodoConta.conta,
            "observacao": textareaJustificativa,
        }

        try {
            await pathSalvarJustificativaPrestacaoDeConta(payload);
            toastCustom.ToastCustomSuccess('Edição salva', 'A edição foi salva com sucesso!')
            await carregaObservacoes();
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    const salvarExtratoBancario = async () => {
        let payload;

        payload = {
            "periodo_uuid": periodoConta.periodo,
            "conta_associacao_uuid": periodoConta.conta,
            "data_extrato": dataSaldoBancario.data_extrato ? moment(dataSaldoBancario.data_extrato, "YYYY-MM-DD").format("YYYY-MM-DD"): null,
            "saldo_extrato": dataSaldoBancario.saldo_extrato ? trataNumericos(dataSaldoBancario.saldo_extrato) : 0,
            "comprovante_extrato": selectedFile,
            "data_atualizacao_comprovante_extrato": dataAtualizacaoComprovanteExtrato ? moment(dataAtualizacaoComprovanteExtrato, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"): null,
        }

        try {
            await pathExtratoBancarioPrestacaoDeConta(payload);
            toastCustom.ToastCustomSuccess('Edição salva', 'A edição foi salva com sucesso!')
            setDataAtualizacaoComprovanteExtrato('')
            setDataAtualizacaoComprovanteExtratoView('')
            setSelectedFile(null)
            setMsgErroExtensaoArquivo('')
            await carregaObservacoes();
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    const verificaSePeriodoEstaAberto = async (periodoUuid) => {
        if (periodosAssociacao) {
            const periodo = periodosAssociacao.find(o => o.uuid === periodoUuid);
            if (periodo) {
                const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID)
                await getStatusPeriodoPorData(associacaoUuid, periodo.data_inicio_realizacao_despesas).then(response => {
                    const periodoBloqueado = response.prestacao_contas_status ? response.prestacao_contas_status.periodo_bloqueado : true
                    setPeriodoFechado(periodoBloqueado)
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };

    const verificaSePodeEditarCamposExtrato = useCallback(async (periodoUuid) => {
        if (periodosAssociacao) {
            const periodo = periodosAssociacao.find(o => o.uuid === periodoUuid);
            if (periodo && periodoConta && periodoConta.conta) {
                const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID)
                await getPodeEditarCamposExtrato(associacaoUuid, periodoUuid, periodoConta.conta).then(response => {
                    setPermiteEditarCamposExtrato(response.permite_editar_campos_extrato)
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }, [periodosAssociacao, periodoConta]);

    useEffect(() => {
        verificaSePodeEditarCamposExtrato(periodoConta.periodo);
    }, [verificaSePodeEditarCamposExtrato, periodoConta]);

    // Tabela Valores Pendentes por Ação
    const [valoresPendentes, setValoresPendentes] = useState({});

    const carregaValoresPendentes = useCallback(async ()=>{
        let valores_pendentes = await tabelaValoresPendentes(periodoConta.periodo, periodoConta.conta);
        setValoresPendentes(valores_pendentes)
    }, [periodoConta.periodo, periodoConta.conta]);

    useEffect(()=>{
        if (periodoConta.periodo && periodoConta.conta){
            carregaValoresPendentes()
        }

    }, [periodoConta.periodo, periodoConta.conta, carregaValoresPendentes]);

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    // Transacoes Conciliadas e Não Conciliadas
    const [transacoesConciliadas, setTransacoesConciliadas] = useState([]);
    const [transacoesNaoConciliadas, setTransacoesNaoConciliadas] = useState([]);
    const [checkboxTransacoes, setCheckboxTransacoes] = useState(false);
    const [tabelasDespesa, setTabelasDespesa] = useState([]);

    const carregaTransacoes = useCallback(async ()=>{
        setLoading(true)
        if (periodoConta.periodo && periodoConta.conta){
            handleTransacoesConciliadas();
            handleTransacoesNaoConciliadas();
        }
        setLoading(false)
    }, [periodoConta]);

    useEffect(()=>{
        carregaTransacoes();
    }, [carregaTransacoes]);

    useEffect(() => {
        const carregaTabelasDespesa = async () => {
            const resp = await getDespesasTabelas();
            setTabelasDespesa(resp);
        };
        carregaTabelasDespesa();
    }, []);


    const handleChangeCheckboxTransacoes = useCallback(async (event, transacao_ou_rateio_uuid, documento_mestre=null, tipo_transacao) => {

        setCheckboxTransacoes(event.target.checked);
        if (event.target.checked) {
            if (!documento_mestre){
                await conciliar(transacao_ou_rateio_uuid);
            }else {
                await patchConciliarDespesa(periodoConta.periodo, periodoConta.conta, transacao_ou_rateio_uuid)
            }
        } else if (!event.target.checked) {
            if (!documento_mestre){
                await desconciliar(transacao_ou_rateio_uuid)
            }else {
                await patchDesconciliarDespesa(periodoConta.conta, transacao_ou_rateio_uuid)
            }
        }
        await carregaTransacoes()
        await carregaValoresPendentes()

    }, [periodoConta, carregaTransacoes, conciliar, desconciliar, carregaValoresPendentes]);

    // Filtros Transacoes
    const [stateFiltros, setStateFiltros] = useState({});

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    // Data Saldo Bancário
    const [dataSaldoBancario, setDataSaldoBancario]= useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [nomeComprovanteExtrato, setNomeComprovanteExtrato] = useState('');
    const [dataAtualizacaoComprovanteExtrato, setDataAtualizacaoComprovanteExtrato] = useState('');
    const [dataAtualizacaoComprovanteExtratoView, setDataAtualizacaoComprovanteExtratoView] = useState('');
    const [exibeBtnDownload, setExibeBtnDownload] = useState(false);
    const [msgErroExtensaoArquivo, setMsgErroExtensaoArquivo] = useState('');

    const validaUploadExtrato = (event) =>{
        let ext = event.file.type
        let tamanho = event.file.size
        let array_extensoes = ['image/jpeg','image/jpg','image/bmp','image/png', 'image/tif', 'application/pdf' ]
        if (tamanho <= 500395){
            let result = array_extensoes.filter(item => ext.indexOf(item) > -1);
            if (result <=0){
                setMsgErroExtensaoArquivo(`A extensão ${ext} não é permitida, tente novamente`)
                return false
            }else {
                setMsgErroExtensaoArquivo('')
                return true
            }
        }else {
            setMsgErroExtensaoArquivo('O tamanho do arquivo excede o limite de 500kb, tente novamente.')
            return false
        }
    }

    const changeUploadExtrato = (event) => {
        if (validaUploadExtrato(event)){
            setBtnSalvarExtratoBancarioDisable(false);
            setCheckSalvarExtratoBancario(false);
            setClassBtnSalvarExtratoBancario("success");
            setSelectedFile(event.file);
            setNomeComprovanteExtrato(event.file.name)
            setDataAtualizacaoComprovanteExtrato(moment().format("YYYY-MM-DD HH:mm:ss"))
            setDataAtualizacaoComprovanteExtratoView(moment().format("DD/MM/YYYY HH:mm:ss"))
            setExibeBtnDownload(false)
            setMsgErroExtensaoArquivo('')
        }else {
            reiniciaUploadExtrato()
        }
    };

    const reiniciaUploadExtrato =()=>{

        if(nomeComprovanteExtrato !== ""){
            setBtnSalvarExtratoBancarioDisable(false);
            setCheckSalvarExtratoBancario(false);
            setClassBtnSalvarExtratoBancario("success");
        }

        setSelectedFile(null)
        setDataAtualizacaoComprovanteExtrato('')
        setDataAtualizacaoComprovanteExtratoView('')
        setExibeBtnDownload(false)
        setNomeComprovanteExtrato('')
    }

    const downloadComprovanteExtrato = useCallback(async ()=>{
        try {
            await getDownloadExtratoBancario(nomeComprovanteExtrato, observacaoUuid);
            console.log("Download efetuado com sucesso");
        }catch (e) {
            console.log("Erro ao efetuar o download ", e.response);
        }
    }, [nomeComprovanteExtrato, observacaoUuid])

    const [erroDataSaldo, setErroDataSaldo] = useState('')

    const handleChangaDataSaldo = useCallback((name, value) => {
        if (name === 'data_extrato'){
            let hoje = moment(new Date());
            let data_digitada = moment(value);
            if (data_digitada > hoje){
                setErroDataSaldo("Data do crédito não pode ser maior que a data de hoje")
                setDataSaldoBancario(prevState => ({ ...prevState,  [name]: ''}));
                return
            }else {
                setErroDataSaldo('')
            }
        }

        setBtnSalvarExtratoBancarioDisable(false);
        setCheckSalvarExtratoBancario(false);
        setClassBtnSalvarExtratoBancario("success");

        setDataSaldoBancario({
            ...dataSaldoBancario,
            [name]: value
        });
    }, [dataSaldoBancario]);

    const irParaAnaliseDre = async() => {
        // Ao setar para false, quando a função a seguir setar o click do item do menu
        // a pagina não ira automaticamente para a url do item

        await contextSideBar.setIrParaUrl(false)
        SidebarLeftService.setItemActive("analise_dre")

        // Necessário voltar o estado para true, para clicks nos itens do menu continuarem funcionando corretamente
        contextSideBar.setIrParaUrl(true)
    }
    
    const handleTransacoesConciliadas = async (ordenacao) => {
        setLoadingConciliadas(true);
        let transacoes_conciliadas = await getTransacoes(
            periodoConta.periodo, 
            periodoConta.conta, 
            'True',
            stateFiltros.filtrar_por_acao_CONCILIADO, 
            ordenacao && ordenacao.ordenar_por_numero_do_documento ? ordenacao.ordenar_por_numero_do_documento : '',
            ordenacao && ordenacao.ordenar_por_data_especificacao ? ordenacao.ordenar_por_data_especificacao : '',
            ordenacao && ordenacao.ordenar_por_valor ? ordenacao.ordenar_por_valor : '',
            ordenacao && ordenacao.ordenar_por_imposto ? ordenacao.ordenar_por_imposto : '',
        );
        setTransacoesConciliadas(transacoes_conciliadas);
        setLoadingConciliadas(false);
    };

    const handleTransacoesNaoConciliadas = async (ordenacao) => {
        setLoadingNaoConciliadas(true);
        let transacoes_nao_conciliadas = await getTransacoes(
            periodoConta.periodo, 
            periodoConta.conta, 
            'False',
            stateFiltros.filtrar_por_acao_NAO_CONCILIADO, 
            ordenacao && ordenacao.ordenar_por_numero_do_documento ? ordenacao.ordenar_por_numero_do_documento : '',
            ordenacao && ordenacao.ordenar_por_data_especificacao ? ordenacao.ordenar_por_data_especificacao : '',
            ordenacao && ordenacao.ordenar_por_valor ? ordenacao.ordenar_por_valor : '',
            ordenacao && ordenacao.ordenar_por_imposto ? ordenacao.ordenar_por_imposto : '',
        );
        setTransacoesNaoConciliadas(transacoes_nao_conciliadas);
        setLoadingNaoConciliadas(false);
    };

    return (
        <>
        <div className="detalhe-das-prestacoes-container mb-5 mt-5">
            <div className="row">
                <div className="col-12 d-flex bd-highlight mt-4">
                    <div className="flex-grow-1 bd-highlight align-self-center detalhe-das-prestacoes-texto-cabecalho pl-0"><h3>Conciliação Bancária</h3></div>

                    {parametros && parametros.state && parametros.state && parametros.state && parametros.state.origem === 'ir_para_conciliacao_bancaria' &&
                        <div className="bd-highlight detalhe-das-prestacoes-texto-cabecalho">
                            <Link
                                to={{pathname: `/consulta-detalhamento-analise-da-dre/${parametros.state.prestacaoDeContasUuid}/`,
                                    state: {
                                        origem: 'ir_para_conciliacao_bancaria',
                                        periodoFormatado: parametros && parametros.state && parametros.state.periodoFormatado ? parametros.state.periodoFormatado : ""
                                    }
                                }}
                                className="btn btn-outline-success"
                                onClick={irParaAnaliseDre}
                            >
                                Voltar para Análise DRE
                            </Link>
                        </div>
                    }
                </div>
            </div>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                    <SelectPeriodoConta
                        periodoConta={periodoConta}
                        handleChangePeriodoConta={handleChangePeriodoConta}
                        periodosAssociacao={periodosAssociacao}
                        contasAssociacao={contasAssociacao}
                    />

                    {periodoConta.periodo && periodoConta.conta ? (
                        <>
                            <TopoComBotoes
                                contaConciliacao={contaConciliacao}
                                periodoFechado={periodoFechado}
                                origem={origem}
                            />

                            <TabelaValoresPendentesPorAcao
                                valoresPendentes={valoresPendentes}
                                valorTemplate={valorTemplate}
                            />

                            <DataSaldoBancario
                                valoresPendentes={valoresPendentes}
                                dataSaldoBancario={dataSaldoBancario}
                                handleChangaDataSaldo={handleChangaDataSaldo}
                                periodoFechado={periodoFechado}
                                nomeComprovanteExtrato={nomeComprovanteExtrato}
                                dataAtualizacaoComprovanteExtrato={dataAtualizacaoComprovanteExtratoView}
                                exibeBtnDownload={exibeBtnDownload}
                                msgErroExtensaoArquivo={msgErroExtensaoArquivo}
                                changeUploadExtrato={changeUploadExtrato}
                                reiniciaUploadExtrato={reiniciaUploadExtrato}
                                downloadComprovanteExtrato={downloadComprovanteExtrato}
                                salvarExtratoBancario={salvarExtratoBancario}
                                btnSalvarExtratoBancarioDisable={btnSalvarExtratoBancarioDisable}
                                setBtnSalvarExtratoBancarioDisable={setBtnSalvarExtratoBancarioDisable}
                                classBtnSalvarExtratoBancario={classBtnSalvarExtratoBancario}
                                setClassBtnSalvarExtratoBancario={setClassBtnSalvarExtratoBancario}
                                checkSalvarExtratoBancario={checkSalvarExtratoBancario}
                                setCheckSalvarExtratoBancario={setCheckSalvarExtratoBancario}
                                erroDataSaldo={erroDataSaldo}
                                permiteEditarCamposExtrato={permiteEditarCamposExtrato}
                            />

                            <p className="detalhe-das-prestacoes-titulo-lancamentos mt-3 mb-3">Gastos pendentes de conciliação</p>
                            <FiltrosTransacoes
                                conciliado='NAO_CONCILIADO'
                                stateFiltros={stateFiltros}
                                tabelasDespesa={tabelasDespesa}
                                handleChangeFiltros={handleChangeFiltros}
                                handleSubmitFiltros={handleTransacoesNaoConciliadas}
                            />

                            <TabelaTransacoes
                                transacoes={transacoesNaoConciliadas}
                                checkboxTransacoes={checkboxTransacoes}
                                periodoFechado={periodoFechado}
                                handleChangeCheckboxTransacoes={handleChangeCheckboxTransacoes}
                                tabelasDespesa={tabelasDespesa}
                                setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                                handleCallbackOrdernar={handleTransacoesNaoConciliadas}
                                loading={loadingNaoConciliadas}
                                emptyListComponent={<p className="mt-2"><strong>Não existem gastos não conciliados...</strong></p>}
                            />                            

                            <p className="detalhe-das-prestacoes-titulo-lancamentos mt-5 mb-3">Gastos conciliados</p>
                            <FiltrosTransacoes
                                conciliado='CONCILIADO'
                                stateFiltros={stateFiltros}
                                tabelasDespesa={tabelasDespesa}
                                handleChangeFiltros={handleChangeFiltros}
                                handleSubmitFiltros={handleTransacoesConciliadas}
                            />

                            <TabelaTransacoes
                                transacoes={transacoesConciliadas}
                                checkboxTransacoes={checkboxTransacoes}
                                periodoFechado={periodoFechado}
                                handleChangeCheckboxTransacoes={handleChangeCheckboxTransacoes}
                                tabelasDespesa={tabelasDespesa}
                                setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                                handleCallbackOrdernar={handleTransacoesConciliadas}
                                loading={loadingConciliadas}
                                emptyListComponent={<p className="mt-2"><strong>Não existem gastos conciliados...</strong></p>}
                            />                            

                            <Justificativa
                                textareaJustificativa={textareaJustificativa}
                                handleChangeTextareaJustificativa={handleChangeTextareaJustificativa}
                                periodoFechado={periodoFechado}
                                btnSalvarJustificativaDisable={btnSalvarJustificativaDisable}
                                setBtnJustificativaSalvarDisable={setBtnSalvarJustificativaDisable}
                                checkSalvarJustificativa={checkSalvarJustificativa}
                                setCheckSalvarJustificativa={setCheckSalvarJustificativa}
                                salvarJustificativa={salvarJustificativa}
                                classBtnSalvarJustificativa={classBtnSalvarJustificativa}
                                setClassBtnSalvarJustificativa={setClassBtnSalvarJustificativa}

                            />

                            <section>
                                <ModalLegendaInformacao
                                    show={showModalLegendaInformacao}
                                    primeiroBotaoOnclick={() => setShowModalLegendaInformacao(false)}
                                    titulo="Legenda Informação"
                                    primeiroBotaoTexto="Fechar"
                                    primeiroBotaoCss="outline-success"
                                />
                            </section>
                        </>
                    ):
                        <MsgImgCentralizada
                            texto='Selecione um período e uma conta acima para visualizar os demonstrativos'
                            img={Img404}
                        />
                    }
                </>
            }
        </div>

        </>
    )
};