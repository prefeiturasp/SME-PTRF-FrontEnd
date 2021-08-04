import React, {useEffect, useRef, useState} from "react";
import {useParams, Redirect} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {
    getDesfazerConclusaoAnalise, getMotivosAprovadoComRessalva,
    getPrestacaoDeContasDetalhe
} from "../../../../services/dres/PrestacaoDeContas.service";
import {getTabelasPrestacoesDeContas, getReceberPrestacaoDeContas, getReabrirPrestacaoDeContas, getListaDeCobrancas, getAddCobranca, getDeletarCobranca, getDesfazerRecebimento, getAnalisarPrestacaoDeContas, getDesfazerAnalise, getSalvarAnalise, getInfoAta, getConcluirAnalise, getListaDeCobrancasDevolucoes, getAddCobrancaDevolucoes, getDespesasPorFiltros, getTiposDevolucao} from "../../../../services/dres/PrestacaoDeContas.service";
import {getDespesa} from "../../../../services/escolas/Despesas.service";
import moment from "moment";
import {ModalReabrirPc} from "../ModalReabrirPC";
import {ModalErroPrestacaoDeContasPosterior} from "../ModalErroPrestacaoDeContasPosterior";
import {ModalNaoRecebida} from "../ModalNaoRecebida";
import {ModalRecebida} from "../ModalRecebida";
import {ModalConcluirAnalise} from "../ModalConcluirAnalise";
import {ModalVoltarParaAnalise} from "../ModalVoltarParaAnalise";
import {getDespesasTabelas} from "../../../../services/escolas/Despesas.service";
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {GetComportamentoPorStatus} from "./GetComportamentoPorStatus";
import {ModalSalvarPrestacaoDeContasAnalise} from "../../../../utils/Modais";

require("ordinal-pt-br");

export const DetalhePrestacaoDeContas = () =>{
    let {prestacao_conta_uuid} = useParams();

    const formRef = useRef();

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
        motivos_reprovacao: '',
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
                visao_criacao: "DRE",
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
    const [camposObrigatorios, setCamposObrigatorios] = useState(false);
    const [motivosAprovadoComRessalva, setMotivosAprovadoComRessalva] = useState([]);
    const [showErroPrestacaoDeContasPosterior, setshowErroPrestacaoDeContasPosterior] = useState(false);
    const [tituloErroPrestacaoDeContasPosterior, setTituloErroPrestacaoDeContasPosterior] = useState('');
    const [textoErroPrestacaoDeContasPosterior, setTextoErroPrestacaoDeContasPosterior] = useState('');
    const [btnSalvarDisabled, setBtnSalvarDisabled] = useState(true);
    const [showModalSalvarAnalise, setShowModalSalvarAnalise] = useState(false);

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
            setTiposDevolucao(resp);
        };
        carregaTiposDevolucao();
    }, []);

    useEffect(() => {
        const carregaMotivosAprovadoComRessalva = async () => {
            const resp = await getMotivosAprovadoComRessalva();
            setMotivosAprovadoComRessalva(resp);
        };
        carregaMotivosAprovadoComRessalva();
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
                devolucao_ao_tesouro: prestacao.devolucao_ao_tesouro === 'Não' ? prestacao.devolucao_ao_tesouro : 'Sim' ,
            });

            if (prestacao && prestacao.devolucoes_ao_tesouro_da_prestacao && prestacao.devolucoes_ao_tesouro_da_prestacao.length > 0 ){
                let devolucoes_ao_tesouro_da_prestacao = [];
                prestacao.devolucoes_ao_tesouro_da_prestacao.map((devolucao, index)=>{
                    buscaDespesa(devolucao.despesa.uuid, index);
                    devolucoes_ao_tesouro_da_prestacao.push({
                        busca_por_cpf_cnpj: "",
                        busca_por_tipo_documento: "",
                        busca_por_numero_documento: "",
                        despesa: devolucao.despesa.uuid,
                        tipo: devolucao.tipo.uuid,
                        data: devolucao.data,
                        devolucao_total: devolucao.devolucao_total ? 'true' : 'false',
                        valor: devolucao.valor ?  valorTemplate(devolucao.valor) : '',
                        motivo: devolucao.motivo,
                        visao_criacao: devolucao.visao_criacao,
                    })
                });
                setInitialFormDevolucaoAoTesouro({devolucoes_ao_tesouro_da_prestacao})
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
        try {
            await getReabrirPrestacaoDeContas(prestacaoDeContas.uuid);
            setTextoErroPrestacaoDeContasPosterior('')
            setTituloErroPrestacaoDeContasPosterior('')
            setRedirectListaPc(true)
        }catch (e){
            console.log("reabrirPrestacaoDeContas ", e.response)
            if (e.response && e.response.data && e.response.data.mensagem){
                setTituloErroPrestacaoDeContasPosterior('Reabrir período de Prestação de Contas')
                setTextoErroPrestacaoDeContasPosterior(e.response.data.mensagem)
                setshowErroPrestacaoDeContasPosterior(true)
            }
        }
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
        setBtnSalvarDisabled(false);
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

    const [motivos, setMotivos] = useState([]);
    const [checkBoxOutrosMotivos, setCheckBoxOutrosMotivos] = useState(false);
    const [txtOutrosMotivos, setTxtOutrosMotivos] = useState('');

    const handleChangeSelectMultipleMotivos = (e) => {
        let target = e.target;
        let value = Array.from(target.selectedOptions, option => option.value);
        setMotivos(value);
    };

    const handleChangeCheckBoxOutrosMotivos = (event) =>{
        setCheckBoxOutrosMotivos(event.target.checked);
        if (!event.target.checked){
            setTxtOutrosMotivos('');
        }
    };

    const handleChangeTxtOutrosMotivos = (event) =>{
        setTxtOutrosMotivos(event.target.value)
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
        setBtnSalvarDisabled(false);
        setInformacoesPrestacaoDeContas({
            ...informacoesPrestacaoDeContas,
            [name]: value
        });
    };

    const onHandleClose = () => {
        setShowReabrirPc(false);
        setShowNaoRecebida(false);
        setShowRecebida(false);
        setShowConcluirAnalise(false);
        setShowVoltarParaAnalise(false);
        setshowErroPrestacaoDeContasPosterior(false)
    };

    const onCloseModalSalvarAnalise = () => {
        setShowModalSalvarAnalise(false);
    }

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

    const salvarAnalise = async () =>{
        let devolucao_ao_tesouro_tratado;
        if (formRef.current && informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim') {
            devolucao_ao_tesouro_tratado = formRef.current.values.devolucoes_ao_tesouro_da_prestacao;
            if (devolucao_ao_tesouro_tratado.length > 0 ){
                devolucao_ao_tesouro_tratado.map((devolucao, )=>{
                    delete devolucao.busca_por_cpf_cnpj;
                    delete devolucao.busca_por_tipo_documento;
                    delete devolucao.busca_por_numero_documento;
                    devolucao.data = devolucao.data ?  moment(devolucao.data).format("YYYY-MM-DD") : null;
                    devolucao.valor = devolucao.valor ? trataNumericos(devolucao.valor) : '';
                    devolucao.devolucao_total = devolucao.devolucao_total === 'true' ? true : false;
                })
            }
        }else {
            devolucao_ao_tesouro_tratado=[];
        }

        analisesDeContaDaPrestacao.map((analise)=>{
            analise.data_extrato = analise.data_extrato ?  moment(analise.data_extrato).format("YYYY-MM-DD") : null;
            analise.saldo_extrato = analise.saldo_extrato ? trataNumericos(analise.saldo_extrato) : 0;
        });
        const payload = {
            devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro !== 'Não',
            analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
            devolucoes_ao_tesouro_da_prestacao:devolucao_ao_tesouro_tratado
        };

        if (formRef.current && informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim') {
            let validar =  await validateFormDevolucaoAoTesouro(formRef.current.values);
            if (!camposObrigatorios && Object.entries(validar).length === 0){
                await getSalvarAnalise(prestacaoDeContas.uuid, payload);
                setShowModalSalvarAnalise(true);
                setBtnSalvarDisabled(true);
                await carregaPrestacaoDeContas();
            }else {
                return formRef.current.setErrors( validar )
            }
        }else {
            await getSalvarAnalise(prestacaoDeContas.uuid, payload);
            setShowModalSalvarAnalise(true);
            setBtnSalvarDisabled(true);
            await carregaPrestacaoDeContas();
        }
    };

    const onConcluirAnalise = async () => {
        setShowConcluirAnalise(false);
        let devolucao_ao_tesouro_tratado;
        if (formRef.current) {
            devolucao_ao_tesouro_tratado = formRef.current.values.devolucoes_ao_tesouro_da_prestacao;
            if (devolucao_ao_tesouro_tratado.length > 0 ){
                devolucao_ao_tesouro_tratado.map((devolucao, index)=>{
                    delete devolucao.busca_por_cpf_cnpj;
                    delete devolucao.busca_por_tipo_documento;
                    delete devolucao.busca_por_numero_documento;
                    devolucao.data = devolucao.data ?  moment(devolucao.data).format("YYYY-MM-DD") : null;
                    devolucao.valor = devolucao.valor ? trataNumericos(devolucao.valor) : '';
                    devolucao.devolucao_total = devolucao.devolucao_total === 'true' ? true : false;
                })
            }
        }else {
            devolucao_ao_tesouro_tratado=[];
        }

        analisesDeContaDaPrestacao.map((analise)=>{
            analise.data_extrato = analise.data_extrato ?  moment(analise.data_extrato).format("YYYY-MM-DD") : null;
            analise.saldo_extrato = analise.saldo_extrato ? trataNumericos(analise.saldo_extrato) : 0;
        });

        let payload={};
        if (stateConcluirAnalise.status === 'APROVADA'){
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status,
                devolucoes_ao_tesouro_da_prestacao:devolucao_ao_tesouro_tratado
            }
        }else if (stateConcluirAnalise.status === 'APROVADA_RESSALVA'){
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status,
                motivos_aprovacao_ressalva: motivos,
                outros_motivos_aprovacao_ressalva: txtOutrosMotivos,
                devolucoes_ao_tesouro_da_prestacao:devolucao_ao_tesouro_tratado
            }
        }else if (stateConcluirAnalise.status === 'DEVOLVIDA'){
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status,
                data_limite_ue: moment(stateConcluirAnalise.data_limite_devolucao).format("YYYY-MM-DD"),
                devolucoes_ao_tesouro_da_prestacao:devolucao_ao_tesouro_tratado
            }
        }else if (stateConcluirAnalise.status === 'REPROVADA'){
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status,
                motivos_reprovacao: stateConcluirAnalise.motivos_reprovacao,
                devolucoes_ao_tesouro_da_prestacao:devolucao_ao_tesouro_tratado
            }
        }

        if (formRef.current && informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim') {
            let validar =  await validateFormDevolucaoAoTesouro(formRef.current.values);
            if (!camposObrigatorios && Object.entries(validar).length === 0){

                try {
                    await getConcluirAnalise(prestacaoDeContas.uuid, payload);
                    setTextoErroPrestacaoDeContasPosterior('')
                    setTituloErroPrestacaoDeContasPosterior('')
                    await carregaPrestacaoDeContas();
                }catch (e){
                    console.log("onConcluirAnalise ", e.response)
                    if (e.response && e.response.data && e.response.data.mensagem){
                        setTituloErroPrestacaoDeContasPosterior('Conclusão da análise da Prestação de Contas')
                        setTextoErroPrestacaoDeContasPosterior(e.response.data.mensagem)
                        setshowErroPrestacaoDeContasPosterior(true)
                    }
                }
            }else {
                return formRef.current.setErrors( validar )
            }
        }else {
            try {
                await getConcluirAnalise(prestacaoDeContas.uuid, payload);
                setTextoErroPrestacaoDeContasPosterior('')
                setTituloErroPrestacaoDeContasPosterior('')
                await carregaPrestacaoDeContas();
            }catch (e){
                console.log("onConcluirAnalise ", e.response)
                if (e.response && e.response.data && e.response.data.mensagem){
                    setTituloErroPrestacaoDeContasPosterior('Conclusão da análise da Prestação de Contas')
                    setTextoErroPrestacaoDeContasPosterior(e.response.data.mensagem)
                    setshowErroPrestacaoDeContasPosterior(true)
                }
            }
        }
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

    const buscaDespesaPorFiltros = async (index) =>{

        let valores, cpf, tipo_documento, numero_documento;

        if (formRef.current) {
            valores = formRef.current.values.devolucoes_ao_tesouro_da_prestacao[index];
            cpf = valores.busca_por_cpf_cnpj ? valores.busca_por_cpf_cnpj : "";
            tipo_documento = valores.busca_por_tipo_documento ? valores.busca_por_tipo_documento : '';
            numero_documento = valores.busca_por_numero_documento ? valores.busca_por_numero_documento : '';

            let despesas_por_filtros = await getDespesasPorFiltros(prestacaoDeContas.associacao.uuid, cpf, tipo_documento, numero_documento);
            setDespesas({
                ...despesas,
                [`devolucao_${index}`]: [...despesas_por_filtros]
            });
        }

    };

    const buscaDespesa = async (despesa_uuid, index) =>{
        if (despesa_uuid){
            let despesa = await getDespesa(despesa_uuid);
            setDespesas(prevState => ({ ...prevState,  [`devolucao_${index}`]: [despesa]}));
        }
    };

    const validateFormDevolucaoAoTesouro = async (values) => {
        const errors = {};
        values.devolucoes_ao_tesouro_da_prestacao.map((devolucao)=>{
            if (!devolucao.despesa || devolucao.devolucao_total === '' || !devolucao.tipo || !devolucao.valor){
                setCamposObrigatorios(true);
                errors.campos_obrigatorios = "Todos os campos são obrigatórios";
            }else {
                setCamposObrigatorios(false)
            }
        });
        return errors;
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
                        {
                            prestacaoDeContas && prestacaoDeContas.status &&
                                <GetComportamentoPorStatus
                                    prestacaoDeContas={prestacaoDeContas}
                                    receberPrestacaoDeContas={receberPrestacaoDeContas}
                                    setShowReabrirPc={setShowReabrirPc}
                                    stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                                    handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                                    tabelaPrestacoes={tabelaPrestacoes}
                                    listaDeCobrancas={listaDeCobrancas}
                                    dataCobranca={dataCobranca}
                                    handleChangeDataCobranca={handleChangeDataCobranca}
                                    addCobranca={addCobranca}
                                    deleteCobranca={deleteCobranca}
                                    retornaNumeroOrdinal={retornaNumeroOrdinal}
                                    analisarPrestacaoDeContas={analisarPrestacaoDeContas}
                                    setShowNaoRecebida={setShowNaoRecebida}
                                    salvarAnalise={salvarAnalise}
                                    setShowConcluirAnalise={setShowConcluirAnalise}
                                    setShowRecebida={setShowRecebida}
                                    handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                                    informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                                    initialFormDevolucaoAoTesouro={initialFormDevolucaoAoTesouro}
                                    formRef={formRef}
                                    despesas={despesas}
                                    buscaDespesaPorFiltros={buscaDespesaPorFiltros}
                                    buscaDespesa={buscaDespesa}
                                    valorTemplate={valorTemplate}
                                    despesasTabelas={despesasTabelas}
                                    tiposDevolucao={tiposDevolucao}
                                    validateFormDevolucaoAoTesouro={validateFormDevolucaoAoTesouro}
                                    infoAta={infoAta}
                                    clickBtnEscolheConta={clickBtnEscolheConta}
                                    toggleBtnEscolheConta={toggleBtnEscolheConta}
                                    exibeAtaPorConta={exibeAtaPorConta}
                                    infoAtaPorConta={infoAtaPorConta}
                                    analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                                    handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                                    getObjetoIndexAnalise={getObjetoIndexAnalise}
                                    toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                                    clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                                    listaDeCobrancasDevolucoes={listaDeCobrancasDevolucoes}
                                    dataCobrancaDevolucoes={dataCobrancaDevolucoes}
                                    handleChangeDataCobrancaDevolucoes={handleChangeDataCobrancaDevolucoes}
                                    addCobrancaDevolucoes={addCobrancaDevolucoes}
                                    deleteCobrancaDevolucoes={deleteCobrancaDevolucoes}
                                    setShowVoltarParaAnalise={setShowVoltarParaAnalise}
                                    btnSalvarDisabled={btnSalvarDisabled}
                                    setBtnSalvarDisabled={setBtnSalvarDisabled}
                                />
                        }
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
                    <ModalErroPrestacaoDeContasPosterior
                        show={showErroPrestacaoDeContasPosterior}
                        handleClose={onHandleClose}
                        titulo={tituloErroPrestacaoDeContasPosterior}
                        texto={`<p>${textoErroPrestacaoDeContasPosterior}</p>`}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
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
                        motivosAprovadoComRessalva={motivosAprovadoComRessalva}
                        handleChangeConcluirAnalise={handleChangeConcluirAnalise}
                        motivos={motivos}
                        txtOutrosMotivos={txtOutrosMotivos}
                        handleChangeSelectMultipleMotivos={handleChangeSelectMultipleMotivos}
                        checkBoxOutrosMotivos={checkBoxOutrosMotivos}
                        handleChangeCheckBoxOutrosMotivos={handleChangeCheckBoxOutrosMotivos}
                        handleChangeTxtOutrosMotivos={handleChangeTxtOutrosMotivos}
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
                <section>
                    <ModalSalvarPrestacaoDeContasAnalise
                        show={showModalSalvarAnalise}
                        handleClose={onCloseModalSalvarAnalise}
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