import React, {useCallback, useEffect, useRef, useState} from "react";
import {useParams, Redirect, useLocation} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {
    getDesfazerConclusaoAnalise,
    getMotivosAprovadoComRessalva,
    getMotivosReprovacao,
    getPrestacaoDeContasDetalhe,
    patchDesfazerReceberAposAcertos,
    getUltimaAnalisePc,
    postAnaliseAjustesSaldoPorConta,
    deleteAnaliseAjustesSaldoPorConta
} from "../../../../services/dres/PrestacaoDeContas.service";
import {getTabelasPrestacoesDeContas, getReceberPrestacaoDeContas, getReabrirPrestacaoDeContas, getListaDeCobrancas, getAddCobranca, getDeletarCobranca, getDesfazerRecebimento, getAnalisarPrestacaoDeContas, getDesfazerAnalise, getSalvarAnalise, getInfoAta, getConcluirAnalise, getListaDeCobrancasDevolucoes, getAddCobrancaDevolucoes, getDespesasPorFiltros, getTiposDevolucao} from "../../../../services/dres/PrestacaoDeContas.service";
import {patchReceberAposAcertos} from "../../../../services/dres/PrestacaoDeContas.service";
import {getDespesa} from "../../../../services/escolas/Despesas.service";
import moment from "moment";
import {ModalReabrirPc} from "../ModalReabrirPC";
import {ModalErroPrestacaoDeContasPosterior} from "../ModalErroPrestacaoDeContasPosterior";
import {ModalNaoRecebida} from "../ModalNaoRecebida";
import {ModalRecebida} from "../ModalRecebida";
import {ModalConcluirAnalise} from "../ModalConcluirAnalise";
import {ModalVoltarParaAnalise} from "../ModalVoltarParaAnalise";
import { ModalDeleteAjusteSaldoPC } from "../ModalDeleteAjusteSaldoPC";
import {getDespesasTabelas} from "../../../../services/escolas/Despesas.service";
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {GetComportamentoPorStatus} from "./GetComportamentoPorStatus";
import {ModalSalvarPrestacaoDeContasAnalise} from "../../../../utils/Modais";
import Loading from "../../../../utils/Loading";
import {toastCustom} from "../../../Globais/ToastCustom";


require("ordinal-pt-br");

export const DetalhePrestacaoDeContas = () =>{
    let {prestacao_conta_uuid} = useParams();

    const { hash } = useLocation();

    const scrollToLocation = useCallback(() => {
        const { hash } = window.location;
        if (hash !== '') {
            let retries = 0;
            const id = hash.replace('#', '');
            const scroll = () => {
                retries += 0;
                if (retries > 50) return;
                const element = document.getElementById(id);
                if (element) {
                    setTimeout(() => element.scrollIntoView(), 0);
                } else {
                    setTimeout(scroll, 100);
                }
            };
            scroll();
        }
    }, [])

    useEffect(() => {
        // if not a hash link, scroll to top
        if (hash === '') {
            window.scrollTo(0, 0);
        }
        // else scroll to id
        else {
            scrollToLocation()
        }
    }, [scrollToLocation, hash]); // do this on route change

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
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true, key_0: true});
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
    const [motivosReprovacao, setMotivosReprovacao] = useState([]);
    const [showErroPrestacaoDeContasPosterior, setshowErroPrestacaoDeContasPosterior] = useState(false);
    const [tituloErroPrestacaoDeContasPosterior, setTituloErroPrestacaoDeContasPosterior] = useState('');
    const [textoErroPrestacaoDeContasPosterior, setTextoErroPrestacaoDeContasPosterior] = useState('');
    const [btnSalvarDisabled, setBtnSalvarDisabled] = useState(true);
    const [showModalSalvarAnalise, setShowModalSalvarAnalise] = useState(false);
    const [loading, setLoading] = useState(true);
    const [valoresReprogramadosAjustes, setValoresReprogramadosAjustes] = useState([])
    const [adicaoAjusteSaldo, setAdicaoAjusteSaldo] = useState(false);
    const [formErrosAjusteSaldo, setFormErrosAjusteSaldo] = useState([])
    const [ajusteSaldoSalvoComSucesso, setAjusteSaldoSalvoComSucesso] = useState([]);
    const [showDeleteAjusteSaldoPC, setShowDeleteAjusteSaldoPC] = useState(false);

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

    useEffect(() => {
        const carregaMotivosReprovacao = async () => {
            const resp = await getMotivosReprovacao();
            setMotivosReprovacao(resp);
        };
        carregaMotivosReprovacao();
    }, []);

    const getAnalisePrestacao = async ()=>{
        if (prestacao_conta_uuid) {
            let prestacao = await getPrestacaoDeContasDetalhe(prestacao_conta_uuid);
            if (prestacao && prestacao.analises_de_conta_da_prestacao && prestacao.analises_de_conta_da_prestacao.length > 0){
                let arrayAnalises = [];
                prestacao.analises_de_conta_da_prestacao.map((conta)=>{
                        arrayAnalises.push({
                            uuid: conta.uuid,
                            conta_associacao: conta.conta_associacao.uuid,
                            data_extrato: conta.data_extrato,
                            saldo_extrato: conta.saldo_extrato ? valorTemplate(conta.saldo_extrato) : null,
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

            // Devolutiva da Associacao
            setDataRecebimentoDevolutiva(prestacao.data_recebimento_apos_acertos ? moment(prestacao.data_recebimento_apos_acertos) : '')

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
        setLoading(false)
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
        setLoading(true)
        let dt_recebimento = stateFormRecebimentoPelaDiretoria.data_recebimento ? moment(new Date(stateFormRecebimentoPelaDiretoria.data_recebimento), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        let payload = {
            data_recebimento: dt_recebimento,
        };
        await getReceberPrestacaoDeContas(prestacaoDeContas.uuid, payload);
        await carregaPrestacaoDeContas();
        toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi alterada para “Recebida”.')
        setRedirectListaPc(false);
        setLoading(false)
    };

    const reabrirPrestacaoDeContas = async ()=>{
        setLoading(true);
        try {
            await getReabrirPrestacaoDeContas(prestacaoDeContas.uuid);
            toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi reaberta.')
            setTextoErroPrestacaoDeContasPosterior('')
            setTituloErroPrestacaoDeContasPosterior('')
            setLoading(false);
            setRedirectListaPc(true)
        }catch (e){
            console.log("reabrirPrestacaoDeContas ", e.response)
            if (e.response && e.response.data && e.response.data.mensagem){
                setTituloErroPrestacaoDeContasPosterior('Reabrir período de Prestação de Contas')
                setTextoErroPrestacaoDeContasPosterior(e.response.data.mensagem)
                setshowErroPrestacaoDeContasPosterior(true)
            }
            setLoading(false);
        }
    };

    const desfazerRecebimento = async () =>{
        setLoading(true)
        await getDesfazerRecebimento(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
        toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi alterada para “Não recebida”.')
        setLoading(false)
    };

    const analisarPrestacaoDeContas = async () =>{
        setLoading(true)
        await getAnalisarPrestacaoDeContas(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
        toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi alterada para “Em análise”.')
        setLoading(false)
    };

    const desfazerAnalise = async () =>{
        setLoading(true)
        await getDesfazerAnalise(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
        toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi alterada para “Recebida”.')
        setLoading(false)
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

    const toggleBtnTabelaAcoes = (uuid) => {
        setClickBtnTabelaAcoes({
            [uuid]: !clickBtnTabelaAcoes[uuid]
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
                        saldo_extrato: null,
                    }
                ])
            }
        }
    };

    const onClickAdicionarAcertoSaldo = (conta) => {
        setAdicaoAjusteSaldo(true);
        let lista = analisesDeContaDaPrestacao;

        lista.push({
            conta_associacao: conta.uuid,
            data_extrato: '',
            saldo_extrato: null,
        })

        setAnalisesDeContaDaPrestacao(lista)
    }

    const onClickSalvarAcertoSaldo = async (conta, analise_de_conta, index) => {
        let uuid_analise;
        let data_extrato = null;
        let saldo_extato = null;

        if(prestacaoDeContas && prestacaoDeContas.analise_atual && prestacaoDeContas.analise_atual.uuid){
            uuid_analise = prestacaoDeContas.analise_atual.uuid
        }
        else{
            let ultima_analise =  await getUltimaAnalisePc(prestacaoDeContas.uuid)
            uuid_analise = ultima_analise.uuid
        }

        if(analise_de_conta){
            if(analise_de_conta.data_extrato){
                data_extrato = moment(analise_de_conta.data_extrato).format("YYYY-MM-DD") 
            }

            if(analise_de_conta.saldo_extrato){
                saldo_extato = trataNumericos(analise_de_conta.saldo_extrato)
            }
        }

        let payload = {
            analise_prestacao_conta: uuid_analise,
            conta_associacao: conta.uuid,
            prestacao_conta: prestacaoDeContas.uuid,
            data_extrato: data_extrato,
            saldo_extrato: saldo_extato
        }

        try {
            await postAnaliseAjustesSaldoPorConta(payload);
            setAdicaoAjusteSaldo(false);
            setAjusteSaldoSalvoComSucesso(prevState => ({
                ...prevState,
                [index]: true
            }))
            
            console.log("Criação realizada com sucesso!")
            // rever api para carregar dados apos salvar
            /* carregaPrestacaoDeContas(); */
        } catch (e) {
            console.log("Erro ao fazer criação", e.response)
            setAjusteSaldoSalvoComSucesso(prevState => ({
                ...prevState,
                [index]: false
            }))
        }
    }

    const onClickDeletarAcertoSaldo = () => {
        setShowDeleteAjusteSaldoPC(true);
    }

    const onClickDescartarAcerto = () => {
        let arrayAnalise = analisesDeContaDaPrestacao;
        let analise_index = getObjetoIndexAnalise().analise_index;
        arrayAnalise.splice(analise_index);
        setAnalisesDeContaDaPrestacao(()=>[
            ...arrayAnalise
        ])
        setAdicaoAjusteSaldo(false);
        
        let erros = {
            data: null,
            saldo: null
        }

        setFormErrosAjusteSaldo(prevState => ({
            ...prevState,
            [analise_index]: erros
        }))
    }


    const validaAjustesSaldo = (info_ue, index, info_dre, origem) => {
        let erros = formErrosAjusteSaldo[index] ? formErrosAjusteSaldo[index] : {data: null, saldo: null}

        if(origem === "data"){
            if(info_ue && info_ue.data_extrato && (index > -1 && info_dre && info_dre.data_extrato)){
                let data_ue = moment(info_ue.data_extrato, "DD-MM-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                let data_dre = moment(info_dre.data_extrato, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        
                let diff = moment(data_ue, "YYYY-MM-DD HH:mm:ss").diff(moment(data_dre, "YYYY-MM-DD HH:mm:ss"))
                let dias = moment.duration(diff).asDays();
        
                if(dias === 0){
                    erros.data = "Mesma data que UE";
    
                    setFormErrosAjusteSaldo(prevState => ({
                        ...prevState,
                        [index]: erros
                    }))
                }
                else{
                    erros.data = null;
                    
                    setFormErrosAjusteSaldo(prevState => ({
                        ...prevState,
                        [index]: erros
                    }))
                }
            }
            else if(info_dre && info_dre.data_extrato === null){
                erros.data = null;
    
                setFormErrosAjusteSaldo(prevState => ({
                    ...prevState,
                    [index]: erros
                }))
            }
        }
        else if(origem === "saldo"){
            if(info_ue && info_ue.saldo_extrato && (index > -1 && info_dre && info_dre.saldo_extrato)){
                let saldo_ue = trataNumericos(info_ue.saldo_extrato);
                let saldo_dre = trataNumericos(info_dre.saldo_extrato);
    
                if(saldo_ue === saldo_dre){
                    erros.saldo = "Mesmo saldo que UE";
    
                    setFormErrosAjusteSaldo(prevState => ({
                        ...prevState,
                        [index]: erros
                    }))
                }
                else{
                    erros.saldo = null;
        
                    setFormErrosAjusteSaldo(prevState => ({
                        ...prevState,
                        [index]: erros
                    }))
                }
    
            }
            else if(info_dre && info_dre.saldo_extrato === null){
                erros.saldo = null;
    
                setFormErrosAjusteSaldo(prevState => ({
                    ...prevState,
                    [index]: erros
                }))
            }
        }
    }

    const handleOnKeyDownAjusteSaldo = (e, saldo) => {
        /* Função necessária para que o usuário consiga apagar a máscara do input */
        let backspace = 8
        let teclaPressionada = e.keyCode

        let arrayAnalise = analisesDeContaDaPrestacao;
        let analise_index = getObjetoIndexAnalise().analise_index;

        if(teclaPressionada === backspace){
            if(saldo === 0 || saldo === "R$0,00"){
                arrayAnalise[analise_index]['saldo_extrato'] = null;
                setAnalisesDeContaDaPrestacao(()=>[
                    ...arrayAnalise
                ])
            }
        }
    }

    const exibeAtaPorConta = async (conta) =>{
        let info_ata_por_conta = infoAta.contas.find(element => element.conta_associacao.nome === conta);
        setInfoAtaPorConta(info_ata_por_conta);
        setAdicaoAjusteSaldo(false);
        let analise = analisesDeContaDaPrestacao.find(element => element.conta_associacao === info_ata_por_conta.conta_associacao.uuid);

        let get_analise = await getAnalisePrestacao();

        if (analise === undefined && !get_analise){
            setAnalisesDeContaDaPrestacao(analise=>[
                ...analise,
                {
                    conta_associacao: info_ata_por_conta.conta_associacao.uuid,
                    data_extrato: '',
                    saldo_extrato: null,
                }
            ])
        }else {
            setAnalisesDeContaDaPrestacao(analisesDeContaDaPrestacao)
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

        if(analise_index > -1) {
            arrayAnalise[analise_index].conta_associacao = infoAtaPorConta.conta_associacao.uuid;
            arrayAnalise[analise_index][name] = value;
        }
        

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

    const [selectMotivosReprovacao, setSelectMotivosReprovacao] = useState([]);
    const [checkBoxOutrosMotivosReprovacao, setCheckBoxOutrosMotivosReprovacao] = useState(false);
    const [txtOutrosMotivosReprovacao, setTxtOutrosMotivosReprovacao] = useState('');

    const [txtRecomendacoes, setTxtRecomendacoes] = useState('');

    const handleChangeSelectMultipleMotivos = (e) => {
        let target = e.target;
        let value = Array.from(target.selectedOptions, option => option.value);
        setMotivos(value);
    };

    const handleChangeSelectMultipleMotivosReprovacao = (e) => {
        let target = e.target;
        let value = Array.from(target.selectedOptions, option => option.value);
        setSelectMotivosReprovacao(value);
    };

    const handleChangeCheckBoxOutrosMotivos = (event) =>{
        setCheckBoxOutrosMotivos(event.target.checked);
        if (!event.target.checked){
            setTxtOutrosMotivos('');
        }
    };

    const handleChangeCheckBoxOutrosMotivosReprovacao = (event) =>{
        setCheckBoxOutrosMotivosReprovacao(event.target.checked);
        if (!event.target.checked){
            setCheckBoxOutrosMotivosReprovacao('');
        }
    };

    const handleChangeTxtOutrosMotivos = (event) =>{
        setTxtOutrosMotivos(event.target.value)
    };

    const handleChangeTxtOutrosMotivosReprovacao = (event) =>{
        setTxtOutrosMotivosReprovacao(event.target.value)
    };

    const handleChangeTxtRecomendacoes = (event) =>{
        setTxtRecomendacoes(event.target.value)
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
        setshowErroPrestacaoDeContasPosterior(false);
        setShowDeleteAjusteSaldoPC(false);
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

    const onDeletarAjustePcTrue = async () => {
        setShowDeleteAjusteSaldoPC(false);

        let analise = prestacaoDeContas.analises_de_conta_da_prestacao.find(element => element.conta_associacao.uuid === infoAtaPorConta.conta_associacao.uuid)


        let arrayAnalise = analisesDeContaDaPrestacao;
        
        let analise_index = getObjetoIndexAnalise().analise_index;
        arrayAnalise.splice(analise_index);
        setAnalisesDeContaDaPrestacao(()=>[
            ...arrayAnalise
        ])
        setAdicaoAjusteSaldo(false)

        deleteAnaliseAjustesSaldoPorConta(analise.uuid);
    }

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
        setLoading(true);
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
            let uuid_motivos = recupera_uuid_motivos(motivos)
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status,
                motivos_aprovacao_ressalva: uuid_motivos,
                outros_motivos_aprovacao_ressalva: txtOutrosMotivos,
                recomendacoes: txtRecomendacoes,
                devolucoes_ao_tesouro_da_prestacao:devolucao_ao_tesouro_tratado
            }
        }else if (stateConcluirAnalise.status === 'REPROVADA'){
            let uuid_motivos = recupera_uuid_motivos(selectMotivosReprovacao)
            payload={
                devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
                analises_de_conta_da_prestacao: analisesDeContaDaPrestacao,
                resultado_analise: stateConcluirAnalise.status,
                motivos_reprovacao: uuid_motivos,
                outros_motivos_reprovacao: txtOutrosMotivosReprovacao,
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
                    toastCustom.ToastCustomSuccess('Status alterado com sucesso', `A prestação de conta foi alterada para “${formataStatus(stateConcluirAnalise.status)}”.`)
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
                toastCustom.ToastCustomSuccess('Status alterado com sucesso', `A prestação de conta foi alterada para “${formataStatus(stateConcluirAnalise.status)}”.`)
            }catch (e){
                console.log("onConcluirAnalise ", e.response)
                if (e.response && e.response.data && e.response.data.mensagem){
                    setTituloErroPrestacaoDeContasPosterior('Conclusão da análise da Prestação de Contas')
                    setTextoErroPrestacaoDeContasPosterior(e.response.data.mensagem)
                    setshowErroPrestacaoDeContasPosterior(true)
                }
            }
        }
        setLoading(false);
    };

    const onVoltarParaAnalise = async () => {
        setLoading(true);
        setShowVoltarParaAnalise(false);
        await getDesfazerConclusaoAnalise(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
        toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi alterada para “Em análise”.')
        setLoading(false);
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
            despesas_por_filtros = despesas_por_filtros.results
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

    // Receber apos acertos
    const [dataRecebimentoDevolutiva, setDataRecebimentoDevolutiva] = useState('')

    const handleChangedataRecebimentoDevolutiva = (name, value) => {
        setDataRecebimentoDevolutiva(value);
    };

    const receberAposAcertos = async (prestacao_de_contas) => {
        setLoading(true)
        let data_formatada = moment(new Date(dataRecebimentoDevolutiva)).format('YYYY-MM-DD')
        let payload = {
            data_recebimento_apos_acertos: data_formatada,
        }
        try {
            await patchReceberAposAcertos(prestacao_de_contas.uuid, payload)
            toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi alterada para “Recebida após acertos”.')
        }catch (e) {
            console.log("Erro ao Receber após acertos", e.response)
        }
        await carregaPrestacaoDeContas();
        setLoading(false)
    }


    const desfazerReceberAposAcertos =async (prestacao_de_contas) => {
        setLoading(true)
        try {
            await patchDesfazerReceberAposAcertos(prestacao_de_contas.uuid)
            toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi alterada para “Apresentada após acertos”.')
        }catch (e) {
            console.log("Erro ao Desfazer Apresentada após acertos", e.response)
        }
        await carregaPrestacaoDeContas();
        setLoading(false)
    }

    const formataStatus = (status) => {
        if(status === "APROVADA"){
            return "Aprovada"
        }
        else if(status === "APROVADA_RESSALVA"){
            return "Aprovada com ressalvas"
        }
        else if(status === "REPROVADA"){
            return "Reprovada"
        }

        return ""
    }

    const recupera_uuid_motivos = (lista_motivos) => {
        let lista_uuid = [];

        for(let motivo=0; motivo<=lista_motivos.length-1; motivo++){
            let uuid = lista_motivos[motivo].uuid;
            lista_uuid.push(uuid)
        }

        return lista_uuid;
    }

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
                    {loading ? (
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        ) :

                            prestacaoDeContas && prestacaoDeContas.status &&
                                <GetComportamentoPorStatus
                                    valoresReprogramadosAjustes={valoresReprogramadosAjustes}
                                    setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
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
                                    carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                                    dataRecebimentoDevolutiva={dataRecebimentoDevolutiva}
                                    handleChangedataRecebimentoDevolutiva={handleChangedataRecebimentoDevolutiva}
                                    receberAposAcertos={receberAposAcertos}
                                    desfazerReceberAposAcertos={desfazerReceberAposAcertos}
                                    setLoading={setLoading}
                                    adicaoAjusteSaldo={adicaoAjusteSaldo}
                                    setAdicaoAjusteSaldo={setAdicaoAjusteSaldo}
                                    onClickAdicionarAcertoSaldo={onClickAdicionarAcertoSaldo}
                                    onClickDescartarAcerto={onClickDescartarAcerto}
                                    formErrosAjusteSaldo={formErrosAjusteSaldo}
                                    validaAjustesSaldo={validaAjustesSaldo}
                                    handleOnKeyDownAjusteSaldo={handleOnKeyDownAjusteSaldo}
                                    onClickSalvarAcertoSaldo={onClickSalvarAcertoSaldo}
                                    ajusteSaldoSalvoComSucesso={ajusteSaldoSalvoComSucesso}
                                    onClickDeletarAcertoSaldo={onClickDeletarAcertoSaldo}
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
                        setMotivos={setMotivos}
                        txtOutrosMotivos={txtOutrosMotivos}
                        handleChangeSelectMultipleMotivos={handleChangeSelectMultipleMotivos}
                        checkBoxOutrosMotivos={checkBoxOutrosMotivos}
                        handleChangeCheckBoxOutrosMotivos={handleChangeCheckBoxOutrosMotivos}
                        handleChangeTxtOutrosMotivos={handleChangeTxtOutrosMotivos}
                        handleChangeTxtRecomendacoes={handleChangeTxtRecomendacoes}
                        txtRecomendacoes={txtRecomendacoes}
                        motivosReprovacao={motivosReprovacao}
                        txtOutrosMotivosReprovacao={txtOutrosMotivosReprovacao}
                        selectMotivosReprovacao={selectMotivosReprovacao}
                        setSelectMotivosReprovacao={setSelectMotivosReprovacao}
                        handleChangeSelectMultipleMotivosReprovacao={handleChangeSelectMultipleMotivosReprovacao}
                        checkBoxOutrosMotivosReprovacao={checkBoxOutrosMotivosReprovacao}
                        handleChangeCheckBoxOutrosMotivosReprovacao={handleChangeCheckBoxOutrosMotivosReprovacao}
                        handleChangeTxtOutrosMotivosReprovacao={handleChangeTxtOutrosMotivosReprovacao}
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
                <section>
                    <ModalDeleteAjusteSaldoPC
                        show={showDeleteAjusteSaldoPC}
                        handleClose={onHandleClose}
                        onDeletarAjustePcTrue={onDeletarAjustePcTrue}
                        titulo="Excluir correção do saldo"
                        texto="Deseja confirmar a exclusão do saldo corrigido?"
                        primeiroBotaoTexto="Voltar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar exclusão"
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