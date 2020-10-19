import React, {useEffect, useRef, useState} from "react";
import {useParams, Redirect} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {
    getDesfazerConclusaoAnalise,
    getPrestacaoDeContasDetalhe
} from "../../../../services/dres/PrestacaoDeContas.service";
import {Cabecalho} from "./Cabecalho";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import {BotoesAvancarRetroceder} from "./BotoesAvancarRetroceder";
import {FormRecebimentoPelaDiretoria} from "./FormRecebimentoPelaDiretoria";
import {getTabelasPrestacoesDeContas, getReceberPrestacaoDeContas, getReabrirPrestacaoDeContas, getListaDeCobrancas, getAddCobranca, getDeletarCobranca, getDesfazerRecebimento, getAnalisarPrestacaoDeContas, getDesfazerAnalise, getSalvarAnalise, getInfoAta, getConcluirAnalise, getListaDeCobrancasDevolucoes, getAddCobrancaDevolucoes, getDespesasPorFiltros, getTiposDevolucao} from "../../../../services/dres/PrestacaoDeContas.service";
import moment from "moment";
import {ModalReabrirPc} from "../ModalReabrirPC";
import {ModalNaoRecebida} from "../ModalNaoRecebida";
import {ModalRecebida} from "../ModalRecebida";
import {ModalConcluirAnalise} from "../ModalConcluirAnalise";
import {ModalVoltarParaAnalise} from "../ModalVoltarParaAnalise";
import {CobrancaPrestacaoDeContas} from "./CobrancaPrestacaoDeContas";
import {CobrancaDevolucoesPrestacaoDeContas} from "./CobrancaDevolucoesPrestacaoDeContas";
import {DevolucoesPrestacaoDeContas} from "./DevolucoesPrestacaoDeContas";
import {InformacoesPrestacaoDeContas} from "./InformacoesPrestacaoDeContas";
import {InformacoesDevolucaoAoTesouro} from "./InformacoesDevolucaoAoTesouro";
import {ResumoFinanceiroSeletorDeContas} from "./ResumoFinanceiroSeletorDeContas";
import {ResumoFinanceiroTabelaTotais} from "./ResumoFinanceiroTabelaTotais";
import {ResumoFinanceiroTabelaAcoes} from "./ResumoFinanceiroTabelaAcoes";
import {AnalisesDeContaDaPrestacao} from "./AnalisesDeContaDaPrestacao";
import {getDespesasTabelas} from "../../../../services/escolas/Despesas.service";

require("ordinal-pt-br");

export const DetalhePrestacaoDeContas = () =>{
    let {prestacao_conta_uuid} = useParams();

    const formRef = useRef()

    const initialFormRecebimentoPelaDiretoria = {
        tecnico_atribuido: "",
        data_recebimento: "",
        status: "",
    };

    const initialListaCobranca = {
        uuid: "",
        prestacao_conta: '',
        data:'',
        tipo: '',
    };

    const initialListaCobrancaDevolucoes = {
        uuid: "",
        prestacao_conta: '',
        data:'',
        tipo: '',
    };

    const initialInformacoesPrestacaoDeContas = {
        processo_sei: "",
        ultima_analise: '',
        devolucao_ao_tesouro:'',
    };

    const initialConcluirAnalise = {
        status: "",
        resalvas: '',
        data_limite_devolucao:'',
    };

    const initialDevolucaoAoTesouro = {
        devolucoes_ao_tesouro_da_prestacao: [
            {
                busca_por_cpf_cnpj: "",
                busca_por_tipo_documento: "",
                busca_por_numero_documento: "",
                despesa: "",
                tipo: "",
                data: "",
                devolucao_total: "",
                valor: "",
                motivo: "",
            }
        ]

    };

    const [prestacaoDeContas, setPrestacaoDeContas] = useState({});
    const [stateFormRecebimentoPelaDiretoria, setStateFormRecebimentoPelaDiretoria] = useState(initialFormRecebimentoPelaDiretoria);
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});
    const [showReabrirPc, setShowReabrirPc] = useState(false);
    const [showNaoRecebida, setShowNaoRecebida] = useState(false);
    const [showRecebida, setShowRecebida] = useState(false);
    const [showConcluirAnalise, setShowConcluirAnalise] = useState(false);
    const [showVoltarParaAnalise, setShowVoltarParaAnalise] = useState(false);
    const [redirectListaPc, setRedirectListaPc] = useState(false);
    const [listaDeCobrancas, setListaDeCobrancas] = useState(initialListaCobranca);
    const [listaDeCobrancasDevolucoes, setListaDeCobrancasDevolucoes] = useState(initialListaCobrancaDevolucoes);
    const [dataCobranca, setDataCobranca] = useState('');
    const [dataCobrancaDevolucoes, setDataCobrancaDevolucoes] = useState('');
    const [informacoesPrestacaoDeContas, setInformacoesPrestacaoDeContas] = useState(initialInformacoesPrestacaoDeContas);
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [infoAta, setInfoAta] = useState({});
    const [infoAtaPorConta, setInfoAtaPorConta] = useState({});
    const [clickBtnTabelaAcoes, setClickBtnTabelaAcoes] = useState(false);
    const [analisesDeContaDaPrestacao, setAnalisesDeContaDaPrestacao] = useState([]);
    const [stateConcluirAnalise, setStateConcluirAnalise] = useState(initialConcluirAnalise);
    const [initialFormDevolucaoAoTesouro, setInitialFormDevolucaoAoTesouro] = useState(initialDevolucaoAoTesouro);
    const [despesas, setDespesas] = useState([]);
    const [despesasTabelas, setDespesasTabelas] = useState([]);
    const [tiposDevolucao, setTiposDevolucao] = useState([]);
    const [objetoDespesasUuid, setObjetoDespesasUuid] = useState([]);

    useEffect(()=>{
        carregaPrestacaoDeContas();
        carregaTabelaPrestacaoDeContas();
    }, []);

    useEffect(()=>{
        carregaListaDeCobrancas();
        carregaInfoAta();
        carregaListaDeCobrancasDevolucoes();
    }, [prestacaoDeContas]);

    useEffect(()=>{
        getPrimeiraAtaPorConta()
    }, [infoAta]);

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);
        };
        carregaTabelasDespesas();
    }, []);

    useEffect(() => {
        const carregaTiposDevolucao = async () => {
            const resp = await getTiposDevolucao();

            console.log("Tipos devolucao ", resp)

            setTiposDevolucao(resp);
        };
        carregaTiposDevolucao();
    }, []);

    const getAnalisePrestacao = async ()=>{
        if (prestacao_conta_uuid) {
            let prestacao = await getPrestacaoDeContasDetalhe(prestacao_conta_uuid);
            if (prestacao && prestacao.analises_de_conta_da_prestacao && prestacao.analises_de_conta_da_prestacao.length > 0){
                let arrayAnalises = [];
                prestacao.analises_de_conta_da_prestacao.map((conta)=>{
                        arrayAnalises.push({
                            conta_associacao: conta.conta_associacao.uuid,
                            data_extrato: conta.data_extrato,
                            saldo_extrato: valorTemplate(conta.saldo_extrato),
                        })
                    });
                setAnalisesDeContaDaPrestacao(arrayAnalises);
                return true
            }else {
                return false
            }
        }else {
            return undefined
        }
    };

    const carregaPrestacaoDeContas = async () => {
        if (prestacao_conta_uuid){
            let prestacao = await getPrestacaoDeContasDetalhe(prestacao_conta_uuid);
            console.log("PRESTAÇÂO XXXXXX ", prestacao)
            setPrestacaoDeContas(prestacao);
            setStateFormRecebimentoPelaDiretoria({
                ...stateFormRecebimentoPelaDiretoria,
                tecnico_atribuido: prestacao && prestacao.tecnico_responsavel && prestacao.tecnico_responsavel.nome ? prestacao.tecnico_responsavel.nome : '',
                data_recebimento: prestacao && prestacao.data_recebimento ? prestacao.data_recebimento : '',
                status: prestacao && prestacao.status ? prestacao.status : '',
            });

            setInformacoesPrestacaoDeContas({
                ...informacoesPrestacaoDeContas,
                processo_sei: prestacao && prestacao.processo_sei ? prestacao.processo_sei : '',
                ultima_analise: prestacao && prestacao.data_ultima_analise ? prestacao.data_ultima_analise : '',
                devolucao_ao_tesouro: prestacao && prestacao.devolucao_ao_tesouro ? prestacao.devolucao_ao_tesouro : '',
            });

            if (prestacao && prestacao.devolucoes_ao_tesouro_da_prestacao && prestacao.devolucoes_ao_tesouro_da_prestacao.length > 0 ){
                setInitialFormDevolucaoAoTesouro(prestacao.devolucoes_ao_tesouro_da_prestacao)
            }
        }
    };

    const carregaTabelaPrestacaoDeContas = async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaPrestacoes(tabela_prestacoes);
    };

    const carregaListaDeCobrancas = async () =>{
        if (prestacaoDeContas && prestacaoDeContas.uuid){
            let lista = await getListaDeCobrancas(prestacaoDeContas.uuid);
            setListaDeCobrancas(lista)
        }
    };

    const carregaListaDeCobrancasDevolucoes = async () =>{
        if (prestacaoDeContas && prestacaoDeContas.uuid && prestacaoDeContas.devolucoes_da_prestacao && prestacaoDeContas.devolucoes_da_prestacao.length > 0){
            let ultimo_item = prestacaoDeContas.devolucoes_da_prestacao.slice(-1);
            let lista = await getListaDeCobrancasDevolucoes(prestacaoDeContas.uuid, ultimo_item[0].uuid);
            setListaDeCobrancasDevolucoes(lista);
        }
    };

    const addCobranca = async () =>{
        let data_cobranca = dataCobranca ? moment(new Date(dataCobranca), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        if (data_cobranca){
            let payload = {
                prestacao_conta: prestacaoDeContas.uuid,
                data: data_cobranca,
                tipo: 'RECEBIMENTO'
            };
            await getAddCobranca(payload);
            await carregaListaDeCobrancas();
            setDataCobranca('')
        }
    };

    const addCobrancaDevolucoes = async () =>{
        let data_cobranca = dataCobrancaDevolucoes ? moment(new Date(dataCobrancaDevolucoes), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        if (data_cobranca){
            let payload = {
                prestacao_conta: prestacaoDeContas.uuid,
                data: data_cobranca,
                tipo: 'DEVOLUCAO'
            };
            await getAddCobrancaDevolucoes(payload);
            await carregaListaDeCobrancasDevolucoes();
            setDataCobrancaDevolucoes('')
        }
    };

    const deleteCobranca = async (cobranca_uuid) =>{
        await getDeletarCobranca(cobranca_uuid);
        if (cobranca_uuid){
            await carregaListaDeCobrancas()
        }
    };

    const deleteCobrancaDevolucoes = async (cobranca_uuid) =>{
        await getDeletarCobranca(cobranca_uuid);
        if (cobranca_uuid){
            await carregaListaDeCobrancasDevolucoes()
        }
    };

    const receberPrestacaoDeContas = async ()=>{
        let dt_recebimento = stateFormRecebimentoPelaDiretoria.data_recebimento ? moment(new Date(stateFormRecebimentoPelaDiretoria.data_recebimento), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        let payload = {
            data_recebimento: dt_recebimento,
        };
        await getReceberPrestacaoDeContas(prestacaoDeContas.uuid, payload);
        await carregaPrestacaoDeContas();
        setRedirectListaPc(false);
    };

    const reabrirPrestacaoDeContas = async ()=>{
        await getReabrirPrestacaoDeContas(prestacaoDeContas.uuid);
        setRedirectListaPc(true)
    };

    const desfazerRecebimento = async () =>{
        await getDesfazerRecebimento(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
    };

    const analisarPrestacaoDeContas = async () =>{
        await getAnalisarPrestacaoDeContas(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
    };

    const desfazerAnalise = async () =>{
        await getDesfazerAnalise(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
    };

    // Ata
    const carregaInfoAta = async () =>{
        if (prestacaoDeContas.uuid){
            let info_ata = await getInfoAta(prestacaoDeContas.uuid);
            setInfoAta(info_ata);
        }
    };

    const toggleBtnEscolheConta = (id) => {
        setClickBtnEscolheConta({
            [id]: !clickBtnEscolheConta[id]
        });
    };

    const toggleBtnTabelaAcoes = (id) => {
        setClickBtnTabelaAcoes({
            [id]: !clickBtnTabelaAcoes[id]
        });
    };

    const getPrimeiraAtaPorConta = async ()=>{
        if (infoAta && infoAta.contas && infoAta.contas.length > 0){
            let conta = infoAta.contas[0];
            setInfoAtaPorConta(conta);

            let get_analise = await getAnalisePrestacao();

            if (!get_analise){
                setAnalisesDeContaDaPrestacao(analise=>[
                    ...analise,
                    {
                        conta_associacao: conta.conta_associacao.uuid,
                        data_extrato: '',
                        saldo_extrato:'',
                    }
                ])
            }
        }
    };

    const exibeAtaPorConta = async (conta) =>{
        let info_ata_por_conta = infoAta.contas.find(element => element.conta_associacao.nome === conta);
        setInfoAtaPorConta(info_ata_por_conta);

        let analise = analisesDeContaDaPrestacao.find(element => element.conta_associacao === info_ata_por_conta.conta_associacao.uuid);

        let get_analise = await getAnalisePrestacao();

        if (analise === undefined || !get_analise){
            setAnalisesDeContaDaPrestacao(analise=>[
                ...analise,
                {
                    conta_associacao: info_ata_por_conta.conta_associacao.uuid,
                    data_extrato: '',
                    saldo_extrato:'',
                }
            ])
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

    const getObjetoIndexAnalise = () =>{
        if (analisesDeContaDaPrestacao && analisesDeContaDaPrestacao.length > 0){
            let analise_obj = analisesDeContaDaPrestacao.find(element => element.conta_associacao === infoAtaPorConta.conta_associacao.uuid);
            let analise_index = analisesDeContaDaPrestacao.indexOf(analise_obj);
            return {
                analise_obj: analise_obj,
                analise_index: analise_index,
            }
        }else {
            return -1
        }

    };

    const handleChangeAnalisesDeContaDaPrestacao = (name, value) =>{
        let arrayAnalise = analisesDeContaDaPrestacao;
        let analise_index = getObjetoIndexAnalise().analise_index;

        arrayAnalise[analise_index].conta_associacao = infoAtaPorConta.conta_associacao.uuid;
        arrayAnalise[analise_index][name] = value;

        setAnalisesDeContaDaPrestacao(()=>[
            ...arrayAnalise
        ])
    };

    const handleChangeConcluirAnalise = (name, value) => {
        setStateConcluirAnalise({
            ...stateConcluirAnalise,
            [name]: value
        });
    };

    // Fim Ata

    const handleChangeDataCobranca = (name, value) =>{
        setDataCobranca(value);
    };

    const handleChangeDataCobrancaDevolucoes = (name, value) =>{
        setDataCobrancaDevolucoes(value);
    };

    const handleChangeFormRecebimentoPelaDiretoria = (name, value) => {
        setStateFormRecebimentoPelaDiretoria({
            ...stateFormRecebimentoPelaDiretoria,
            [name]: value
        });
    };

    const handleChangeFormInformacoesPrestacaoDeContas = (name, value) => {
        setInformacoesPrestacaoDeContas({
            ...informacoesPrestacaoDeContas,
            [name]: value
        });
    };

    const salvarAnalise = async () =>{

        if (formRef.current) {
            console.log("AQUI salvarAnalise XXXXXX", formRef.current.values)
            //formRef.current.handleSubmit()
        }

/*        analisesDeContaDaPrestacao.map((analise)=>{
            analise.data_extrato = analise.data_extrato ?  moment(analise.data_extrato).format("YYYY-MM-DD") : null;
            analise.saldo_extrato = analise.saldo_extrato ? trataNumericos(analise.saldo_extrato) : 0;
        });
        const payload = {
            devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
            analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
        };

        await getSalvarAnalise(prestacaoDeContas.uuid, payload);
        await carregaPrestacaoDeContas();
        window.location.reload()*/
    };

    const onHandleClose = () => {
        setShowReabrirPc(false);
        setShowNaoRecebida(false);
        setShowRecebida(false);
        setShowConcluirAnalise(false);
        setShowVoltarParaAnalise(false);
    };

    const onReabrirTrue = async () => {
        setShowReabrirPc(false);
        await reabrirPrestacaoDeContas();
    };

    const onNaoRecebida = async () => {
        setShowNaoRecebida(false);
        await desfazerRecebimento();
    };

    const onRecebida = async () => {
        setShowRecebida(false);
        await desfazerAnalise();
    };

    const onConcluirAnalise = async () => {
        setShowConcluirAnalise(false);

        if (formRef.current) {
            console.log("AQUI onConcluirAnalise XXXXXX", formRef.current.values)
            //formRef.current.handleSubmit()
        }

        /*analisesDeContaDaPrestacao.map((analise)=>{
            analise.data_extrato = analise.data_extrato ?  moment(analise.data_extrato).format("YYYY-MM-DD") : null;
            analise.saldo_extrato = analise.saldo_extrato ? trataNumericos(analise.saldo_extrato) : 0;
        });

        let payload={};
        if (stateConcluirAnalise.status === 'APROVADA'){
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status
            }
        }else if (stateConcluirAnalise.status === 'APROVADA_RESSALVA'){
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status,
                ressalvas_aprovacao: stateConcluirAnalise.resalvas
            }
        }else if (stateConcluirAnalise.status === 'DEVOLVIDA'){
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status,
                data_limite_ue: moment(stateConcluirAnalise.data_limite_devolucao).format("YYYY-MM-DD")
            }
        }else if (stateConcluirAnalise.status === 'REPROVADA'){
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status,
            }
        }

        await getConcluirAnalise(prestacaoDeContas.uuid, payload);
        await carregaPrestacaoDeContas();*/
    };

    const onVoltarParaAnalise = async () => {
        setShowVoltarParaAnalise(false);
        await getDesfazerConclusaoAnalise(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
    };

    const retornaNumeroOrdinal = (index) =>{

        let _index = index + 1;

        if (_index === 10){
            return 'Décima'
        }else if(_index === 20){
            return 'Vigésima'
        }else if(_index === 30){
            return 'Trigésima'
        }else if(_index === 40){
            return 'Quadragésima'
        }else{
            let oridinal = _index.toOrdinal({ genero: "a"});
            let array = oridinal.split(' ');
            let primeira_palavra = array[0];
            let modificada = primeira_palavra.substring(0, primeira_palavra.length - 1) + 'a';
            if (array[1] === undefined){
                return modificada.charAt(0).toUpperCase() + modificada.slice(1)
            }else {
                return modificada.charAt(0).toUpperCase() + modificada.slice(1) + " " + array[1]
            }
        }
    };

    const getComportamentoPorStatus = () =>{
        if (prestacaoDeContas.status === 'NAO_RECEBIDA'){
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Receber"}
                        textoBtnRetroceder={"Reabrir PC"}
                        metodoAvancar={receberPrestacaoDeContas}
                        metodoRetroceder={()=>setShowReabrirPc(true)}
                        disabledBtnAvancar={!stateFormRecebimentoPelaDiretoria.data_recebimento}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={false}
                        disabledStatus={true}
                        exibeMotivo={false}
                    />
                    <CobrancaPrestacaoDeContas
                        listaDeCobrancas={listaDeCobrancas}
                        dataCobranca={dataCobranca}
                        handleChangeDataCobranca={handleChangeDataCobranca}
                        addCobranca={addCobranca}
                        deleteCobranca={deleteCobranca}
                        editavel={true}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                    />
                </>
            )
        }else if (prestacaoDeContas.status === 'RECEBIDA'){
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Analisar"}
                        textoBtnRetroceder={"Não recebida"}
                        metodoAvancar={analisarPrestacaoDeContas}
                        metodoRetroceder={()=>setShowNaoRecebida(true)}
                        disabledBtnAvancar={false}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                    />
                    <CobrancaPrestacaoDeContas
                        listaDeCobrancas={listaDeCobrancas}
                        dataCobranca={dataCobranca}
                        handleChangeDataCobranca={handleChangeDataCobranca}
                        addCobranca={addCobranca}
                        deleteCobranca={deleteCobranca}
                        editavel={false}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                    />
                </>
            )

        }else if (prestacaoDeContas.status === 'EM_ANALISE') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={true}
                        metodoSalvarAnalise={salvarAnalise}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Recebida"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowRecebida(true)}
                        disabledBtnAvancar={false}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                    />
                    <DevolucoesPrestacaoDeContas
                        prestacaoDeContas={prestacaoDeContas}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                        excluiUltimaCobranca={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={true}
                    />
                    <InformacoesDevolucaoAoTesouro
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        initialValues={initialFormDevolucaoAoTesouro}
                        formRef={formRef}
                        despesas={despesas}
                        buscaDespesaPorFiltros={buscaDespesaPorFiltros}
                        valorTemplate={valorTemplate}
                        despesasTabelas={despesasTabelas}
                        tiposDevolucao={tiposDevolucao}
                    />
                    <ResumoFinanceiroSeletorDeContas
                        infoAta={infoAta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                    />

                    <AnalisesDeContaDaPrestacao
                        infoAta={infoAtaPorConta}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={true}
                    />

                    <ResumoFinanceiroTabelaTotais
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                    />
                    <ResumoFinanceiroTabelaAcoes
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                    />
                </>
            )
        }else if (prestacaoDeContas.status === 'DEVOLVIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Recebida"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowRecebida(true)}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={true}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                    />
                    <DevolucoesPrestacaoDeContas
                        prestacaoDeContas={prestacaoDeContas}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                        excluiUltimaCobranca={true}
                    />
                    <CobrancaDevolucoesPrestacaoDeContas
                        listaDeCobrancasDevolucoes={listaDeCobrancasDevolucoes}
                        dataCobrancaDevolucoes={dataCobrancaDevolucoes}
                        handleChangeDataCobrancaDevolucoes={handleChangeDataCobrancaDevolucoes}
                        addCobrancaDevolucoes={addCobrancaDevolucoes}
                        deleteCobrancaDevolucoes={deleteCobrancaDevolucoes}
                        editavel={true}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <ResumoFinanceiroSeletorDeContas
                        infoAta={infoAta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                    />
                    <AnalisesDeContaDaPrestacao
                        infoAta={infoAtaPorConta}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}
                    />
                    <ResumoFinanceiroTabelaTotais
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                    />
                    <ResumoFinanceiroTabelaAcoes
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                    />
                </>
            )
        }else if (prestacaoDeContas.status === 'APROVADA_RESSALVA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />

                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Voltar para análise"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowVoltarParaAnalise(true)}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={false}
                        esconderBotaoAvancar={true}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        prestacaoDeContas={prestacaoDeContas}
                        exibeMotivo={true}
                    />
                    <DevolucoesPrestacaoDeContas
                        prestacaoDeContas={prestacaoDeContas}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                        excluiUltimaCobranca={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <ResumoFinanceiroSeletorDeContas
                        infoAta={infoAta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                    />
                    <AnalisesDeContaDaPrestacao
                        infoAta={infoAtaPorConta}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}
                    />
                    <ResumoFinanceiroTabelaTotais
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                    />
                    <ResumoFinanceiroTabelaAcoes
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                    />
                </>
            )
        }else if (prestacaoDeContas.status === 'APROVADA' || prestacaoDeContas.status === 'REPROVADA') {
        return (
            <>
                <Cabecalho
                    prestacaoDeContas={prestacaoDeContas}
                    exibeSalvar={false}
                />

                <BotoesAvancarRetroceder
                    prestacaoDeContas={prestacaoDeContas}
                    textoBtnAvancar={"Concluir análise"}
                    textoBtnRetroceder={"Voltar para análise"}
                    metodoAvancar={() => setShowConcluirAnalise(true)}
                    metodoRetroceder={() => setShowVoltarParaAnalise(true)}
                    disabledBtnAvancar={true}
                    disabledBtnRetroceder={false}
                    esconderBotaoAvancar={true}
                />
                <TrilhaDeStatus
                    prestacaoDeContas={prestacaoDeContas}
                />
                <FormRecebimentoPelaDiretoria
                    handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                    stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                    tabelaPrestacoes={tabelaPrestacoes}
                    disabledNome={true}
                    disabledData={true}
                    disabledStatus={true}
                    prestacaoDeContas={prestacaoDeContas}
                    exibeMotivo={false}
                />
                <DevolucoesPrestacaoDeContas
                    prestacaoDeContas={prestacaoDeContas}
                    retornaNumeroOrdinal={retornaNumeroOrdinal}
                    excluiUltimaCobranca={false}
                />
                <InformacoesPrestacaoDeContas
                    handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                    informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                    editavel={false}
                />
                <ResumoFinanceiroSeletorDeContas
                    infoAta={infoAta}
                    clickBtnEscolheConta={clickBtnEscolheConta}
                    toggleBtnEscolheConta={toggleBtnEscolheConta}
                    exibeAtaPorConta={exibeAtaPorConta}
                />
                <AnalisesDeContaDaPrestacao
                    infoAta={infoAtaPorConta}
                    analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                    handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                    getObjetoIndexAnalise={getObjetoIndexAnalise}
                    editavel={false}
                />
                <ResumoFinanceiroTabelaTotais
                    infoAta={infoAtaPorConta}
                    valorTemplate={valorTemplate}
                />
                <ResumoFinanceiroTabelaAcoes
                    infoAta={infoAtaPorConta}
                    valorTemplate={valorTemplate}
                    toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                    clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                />
            </>
        )
    }
    };

    const buscaDespesaPorFiltros = async (index) =>{

        let valores, cpf, tipo_documento, numero_documento;

        if (formRef.current) {
            valores = formRef.current.values.devolucoes_ao_tesouro_da_prestacao[index]
            cpf = valores.busca_por_cpf_cnpj ? valores.busca_por_cpf_cnpj : "";
            tipo_documento = valores.busca_por_tipo_documento ? valores.busca_por_tipo_documento : '';
            numero_documento = valores.busca_por_numero_documento ? valores.busca_por_numero_documento : '';

            let despesas_por_filtros = await getDespesasPorFiltros(prestacaoDeContas.associacao.uuid, cpf, tipo_documento, numero_documento)
            //console.log("buscaDespesaPorFiltros despesas ", despesas_por_filtros)

            setDespesas({
                ...despesas,
                [`devolucao_${index}`]: [...despesas_por_filtros]
            });
        }

    };

    const handleChangeObjetoDespesasUuid = (despesa_uuid) => {

        setObjetoDespesasUuid(analise=>[
            ...objetoDespesasUuid,
            {
                despesa_uui: despesa_uuid,
            }
        ])

    };

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                {!prestacao_conta_uuid ? (
                        <Redirect
                            to={{
                                pathname: `/dre-lista-prestacao-de-contas/`,
                            }}
                        />
                    ) :
                    <>
                        {getComportamentoPorStatus()}
                    </>
                }
                <section>
                    <ModalReabrirPc
                        show={showReabrirPc}
                        handleClose={onHandleClose}
                        onReabrirTrue={onReabrirTrue}
                        titulo="Reabrir período de Prestação de Contas"
                        texto="<p><strong>Atenção,</strong> a prestação de contas será reaberta para a Associação que poderá fazer alteração e precisará concluí-la novamente.</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
                <section>
                    <ModalNaoRecebida
                        show={showNaoRecebida}
                        handleClose={onHandleClose}
                        onReabrirTrue={onNaoRecebida}
                        titulo="Não receber Prestação de Contas"
                        texto="<p><strong>Atenção,</strong> a prestação de contas voltará para o status de Não recebida. As informações de recebimento serão perdidas. Confirma operação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
                <section>
                    <ModalRecebida
                        show={showRecebida}
                        handleClose={onHandleClose}
                        onReabrirTrue={onRecebida}
                        titulo="Receber Prestação de Contas"
                        texto="<p><strong>Atenção,</strong> a prestação de contas voltará para o status de Recebida. As informações de análise serão perdidas. Confirma operação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
                <section>
                    <ModalConcluirAnalise
                        show={showConcluirAnalise}
                        handleClose={onHandleClose}
                        onConcluirAnalise={onConcluirAnalise}
                        titulo="Conclusão da análise da Prestação de Contas"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                        tabelaPrestacoes={tabelaPrestacoes}
                        stateConcluirAnalise={stateConcluirAnalise}
                        handleChangeConcluirAnalise={handleChangeConcluirAnalise}
                    />
                </section>
                <section>
                    <ModalVoltarParaAnalise
                        show={showVoltarParaAnalise}
                        handleClose={onHandleClose}
                        onVoltarParaAnalise={onVoltarParaAnalise}
                        titulo="Voltar para análise"
                        texto="<p><strong>Atenção,</strong> a prestação de contas voltará para o status de Em análise. Confirma operação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
                {redirectListaPc &&
                    <Redirect
                        to={{
                            pathname: `/dre-lista-prestacao-de-contas/${prestacaoDeContas.periodo_uuid}/${prestacaoDeContas.status}`,
                        }}
                    />
                }
            </div>
        </PaginasContainer>
    )
};