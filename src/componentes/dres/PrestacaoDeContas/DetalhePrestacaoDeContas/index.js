import React, {useEffect, useState} from "react";
import {useParams, Redirect} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPrestacaoDeContasDetalhe} from "../../../../services/dres/PrestacaoDeContas.service";
import {Cabecalho} from "./Cabecalho";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import {BotoesAvancarRetroceder} from "./BotoesAvancarRetroceder";
import {FormRecebimentoPelaDiretoria} from "./FormRecebimentoPelaDiretoria";
import {getTabelasPrestacoesDeContas, getReceberPrestacaoDeContas, getReabrirPrestacaoDeContas, getListaDeCobrancas, getAddCobranca, getDeletarCobranca} from "../../../../services/dres/PrestacaoDeContas.service";
import moment from "moment";
import {ModalReabrirPc} from "../ModalReabrirPC";
import {CobrancaPrestacaoDeContas} from "./CobrancaPrestacaoDeContas";
require("ordinal-pt-br");

export const DetalhePrestacaoDeContas = () =>{
    let {prestacao_conta_uuid} = useParams();

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


    const [prestacaoDeContas, setPrestacaoDeContas] = useState({});
    const [stateFormRecebimentoPelaDiretoria, setStateFormRecebimentoPelaDiretoria] = useState(initialFormRecebimentoPelaDiretoria);
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});
    const [showReabrirPc, setShowReabrirPc] = useState(false);
    const [redirectListaPc, setRedirectListaPc] = useState(false);
    const [listaDeCobrancas, setListaDeCobrancas] = useState(initialListaCobranca);
    const [dataCobranca, setDataCobranca] = useState('');

    useEffect(()=>{
        carregaPrestacaoDeContas();
        carregaTabelaPrestacaoDeContas();
    }, []);

    useEffect(()=>{
        carregaListaDeCobrancas();
    }, [prestacaoDeContas]);

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

    const receberPrestacaoDeContas = async ()=>{
        let dt_recebimento = stateFormRecebimentoPelaDiretoria.data_recebimento ? moment(new Date(stateFormRecebimentoPelaDiretoria.data_recebimento), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        let payload = {
            data_recebimento: dt_recebimento,
        };
        let pc_recebida = await getReceberPrestacaoDeContas(prestacaoDeContas.uuid, payload);
        setPrestacaoDeContas(pc_recebida);
        setRedirectListaPc(false);
    };

    const reabrirPrestacaoDeContas = async ()=>{
        await getReabrirPrestacaoDeContas(prestacaoDeContas.uuid);
        setRedirectListaPc(true)
    };

    const handleChangeDataCobranca = (name, value) =>{
        setDataCobranca(value);
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

    const deleteCobranca = async (cobranca_uuid) =>{
        await getDeletarCobranca(cobranca_uuid);
        if (cobranca_uuid){
            await carregaListaDeCobrancas()
        }

    };

    const retornaNumeroCardinal = (index) =>{

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
                //return modificada
            }else {
                return modificada.charAt(0).toUpperCase() + modificada.slice(1) + " " + array[1]
            }
        }
    };


    const handleChangeFormRecebimentoPelaDiretoria = (name, value) => {
        setStateFormRecebimentoPelaDiretoria({
            ...stateFormRecebimentoPelaDiretoria,
            [name]: value
        });
    };

    const onHandleClose = () => {
        setShowReabrirPc(false);
    };

    const onReabrirTrue = () => {
        setShowReabrirPc(false);
        reabrirPrestacaoDeContas();
    };

    const getComportamentoPorStatus = () =>{
        if (prestacaoDeContas.status === 'NAO_RECEBIDA'){
            return (
                <>
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
                    />
                    <CobrancaPrestacaoDeContas
                        listaDeCobrancas={listaDeCobrancas}
                        dataCobranca={dataCobranca}
                        handleChangeDataCobranca={handleChangeDataCobranca}
                        addCobranca={addCobranca}
                        deleteCobranca={deleteCobranca}
                        editavel={true}
                        retornaNumeroCardinal={retornaNumeroCardinal}
                    />
                </>
            )
        }
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
                        <Cabecalho
                            prestacaoDeContas={prestacaoDeContas}
                        />
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