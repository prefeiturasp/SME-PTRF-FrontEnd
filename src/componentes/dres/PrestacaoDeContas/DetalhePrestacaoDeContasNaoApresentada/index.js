import React, {useEffect, useState} from "react";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import Cabecalho from "../DetalhePrestacaoDeContas/Cabecalho";
import {BotoesAvancarRetroceder} from "../DetalhePrestacaoDeContas/BotoesAvancarRetroceder";
import {TrilhaDeStatus} from "../DetalhePrestacaoDeContas/TrilhaDeStatus";
import {
    getAddCobranca, getDeletarCobranca,
    getListaDeCobrancasPcNaoApresentada,
    getTabelasPrestacoesDeContas
} from "../../../../services/dres/PrestacaoDeContas.service";
import {FormRecebimentoPelaDiretoria} from "../DetalhePrestacaoDeContas/FormRecebimentoPelaDiretoria";
import moment from "moment";
import {CobrancaPrestacaoDeContas} from "../DetalhePrestacaoDeContas/CobrancaPrestacaoDeContas";

export const DetalhePrestacaoDeContasNaoApresentada = () =>{

    const prestacaoDeContas = JSON.parse(localStorage.getItem('prestacao_de_contas_nao_apresentada'));

    const initialFormRecebimentoPelaDiretoria = {
        tecnico_atribuido: "",
        data_recebimento: "",
        status: "NAO_APRESENTADA",
    };

    const initialListaCobranca = {
        uuid: "",
        prestacao_conta: '',
        data:'',
        tipo: '',
    };

    const [stateFormRecebimentoPelaDiretoria] = useState(initialFormRecebimentoPelaDiretoria);
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});
    const [listaDeCobrancas, setListaDeCobrancas] = useState(initialListaCobranca);
    const [dataCobranca, setDataCobranca] = useState('');

    useEffect(()=>{
        carregaTabelaPrestacaoDeContas();
        carregaListaDeCobrancas();
    }, []);

    const carregaTabelaPrestacaoDeContas = async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaPrestacoes(tabela_prestacoes);
    };

    const carregaListaDeCobrancas = async () =>{
        if (prestacaoDeContas.periodo_uuid){
            let lista = await getListaDeCobrancasPcNaoApresentada(prestacaoDeContas.associacao.uuid, prestacaoDeContas.periodo_uuid);
            setListaDeCobrancas(lista)
        }
    };

    const addCobranca = async () =>{
        let data_cobranca = dataCobranca ? moment(new Date(dataCobranca), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        if (data_cobranca){
            let payload = {
                associacao: prestacaoDeContas.associacao.uuid,
                periodo: prestacaoDeContas.periodo_uuid,
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

    const handleChangeDataCobranca = (name, value) =>{
        setDataCobranca(value);
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
        }else if(_index === 50){
            return 'Quinguasésima'
        }else if(_index === 60){
            return 'Sextagésima'
        }else if(_index === 70){
            return 'Séptimagésima'
        }else if(_index === 80){
            return 'Octagésima'
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

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                    <>
                        {prestacaoDeContas &&
                            <>
                            <Cabecalho
                                prestacaoDeContas={prestacaoDeContas}
                                exibeSalvar={false}
                            />
                                <BotoesAvancarRetroceder
                                    prestacaoDeContas={prestacaoDeContas}
                                    textoBtnAvancar={"Receber"}
                                    textoBtnRetroceder={"Reabrir PC"}
                                    metodoAvancar={undefined}
                                    metodoRetroceder={undefined}
                                    disabledBtnAvancar={true}
                                    disabledBtnRetroceder={true}
                                />
                                <TrilhaDeStatus
                                    prestacaoDeContas={prestacaoDeContas}
                                />
                                <FormRecebimentoPelaDiretoria
                                    handleChangeFormRecebimentoPelaDiretoria={undefined}
                                    stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                                    tabelaPrestacoes={tabelaPrestacoes}
                                    disabledNome={true}
                                    disabledData={true}
                                    disabledStatus={true}
                                    exibeMotivo={false}
                                    exibeRecomendacoes={false}
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
                        }

                    </>

            </div>
        </PaginasContainer>
    )
};