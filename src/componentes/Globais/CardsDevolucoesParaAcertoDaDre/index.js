import React, {memo, useCallback, useEffect, useState} from "react";
import {getAnalisesDePcDevolvidas} from "../../../services/dres/PrestacaoDeContas.service";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";
import SelectAnalisesDePcDevolvidas from "./SelectAnalisesDePcDevolvidas";
import CardsInfoDevolucaoSelecionada from "./CardsInfoDevolucaoSelecionada";
import './cards-devolucoes-para-acerto-dre.scss'
import Loading from "../../../utils/Loading";
import { mantemEstadoAnaliseDre as meapcservice } from "../../../services/mantemEstadoAnaliseDre.service";
import { visoesService } from "../../../services/visoes.service";

const CardsDevolucoesParaAcertoDaDre = ({prestacao_conta_uuid, analiseAtualUuid=false, setAnaliseAtualUuid, setPermitirTriggerOnclick=null}) =>{
    const [analisesDePcDevolvidas, setAnalisesDePcDevolvidas] = useState([])
    const [uuidAnalisePcDevolvida, setUuidAnalisePcDevolvida] = useState({})
    const [objetoConteudoCard, setObjetoConteudoCard] = useState({})
    const [loading, setLoading] = useState(true)

    // Manter o estado do Acompanhamento de PC
    let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado()

    useEffect(()=>{
        let mounted = true;
        const carregaAnalisesDePcDevolvidas = async () => {
            if (mounted) {
                setLoading(true);
                let analises_pc_devolvidas = await getAnalisesDePcDevolvidas(prestacao_conta_uuid)

                if (analises_pc_devolvidas && analises_pc_devolvidas.length > 0) {
                    let unis = analises_pc_devolvidas.map((analise, index) => {
                        let data_formatada = analise && analise.devolucao_prestacao_conta && analise.devolucao_prestacao_conta.data ? exibeDataPT_BR(analise.devolucao_prestacao_conta.data) : ""
                        return {
                            ...analise,
                            label_formatada: retornaNumeroOrdinal(index) + ' devolução ' + data_formatada,
                            versao_da_devolucao: retornaNumeroOrdinal(index)
                        }
                    })
                    let analises_pc_devolvidas_montada_reverse = unis.reverse()
                    setAnalisesDePcDevolvidas(analises_pc_devolvidas_montada_reverse)
                    setObjetoConteudoCard(analises_pc_devolvidas_montada_reverse[0])
                    setLoading(false)
                }else {
                    setAnalisesDePcDevolvidas(analises_pc_devolvidas)
                    setLoading(false)
                }
            }
        }
        carregaAnalisesDePcDevolvidas()
        return () =>{
            mounted = false;
        }
    }, [prestacao_conta_uuid])

    const montaObjetoConteudoCard = useCallback((uuid)=>{
        let obj = analisesDePcDevolvidas.find((elem => elem.uuid === uuid))
        setObjetoConteudoCard(obj)
    }, [analisesDePcDevolvidas])

    const setPrimeiraAnalisePcDevolvida = useCallback(() => {
        if (analiseAtualUuid){
            setAnaliseAtualUuid(analiseAtualUuid)
            setUuidAnalisePcDevolvida(analiseAtualUuid)
            montaObjetoConteudoCard(analiseAtualUuid)
        }else {
            if (analisesDePcDevolvidas && analisesDePcDevolvidas.length > 0){
                if(dados_analise_dre_usuario_logado && dados_analise_dre_usuario_logado.analise_pc_uuid){
                    setAnaliseAtualUuid(dados_analise_dre_usuario_logado.analise_pc_uuid)
                    setUuidAnalisePcDevolvida(dados_analise_dre_usuario_logado.analise_pc_uuid)
                    montaObjetoConteudoCard(dados_analise_dre_usuario_logado.analise_pc_uuid)
                }
                else{
                    setAnaliseAtualUuid(analisesDePcDevolvidas[0].uuid)
                    setUuidAnalisePcDevolvida(analisesDePcDevolvidas[0].uuid)
                    montaObjetoConteudoCard(analisesDePcDevolvidas[0].uuid)
                    salvaObjetoAnaliseDrePorUsuarioLocalStorage(analisesDePcDevolvidas[0].uuid)
                }
            }
        }
    }, [analisesDePcDevolvidas, setAnaliseAtualUuid, analiseAtualUuid, montaObjetoConteudoCard, dados_analise_dre_usuario_logado])

    useEffect(()=>{
        setPrimeiraAnalisePcDevolvida()
    }, [setPrimeiraAnalisePcDevolvida])

    const handleChangeSelectAnalisesDePcDevolvidas = useCallback((value, e)=>{
        // Necessário para controlar quando o ref_click_historico.current.click() é disparado
        if (setPermitirTriggerOnclick){
            setPermitirTriggerOnclick(false)
        }

        setUuidAnalisePcDevolvida(value)
        setAnaliseAtualUuid(value)
        let data_objeto = JSON.parse(e.target.options[e.target.selectedIndex].getAttribute('data-objeto'));
        setObjetoConteudoCard(data_objeto)
        
        meapcservice.limpaAnaliseDreUsuarioLogado(visoesService.getUsuarioLogin())
        salvaObjetoAnaliseDrePorUsuarioLocalStorage(data_objeto.uuid)

    }, [setAnaliseAtualUuid])

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

    const salvaObjetoAnaliseDrePorUsuarioLocalStorage = (analise_pc_uuid) =>{
        let objetoAnaliseDrePorUsuario = meapcservice.getAnaliseDreUsuarioLogado();
        
        objetoAnaliseDrePorUsuario.analise_pc_uuid = analise_pc_uuid
        meapcservice.setAnaliseDrePorUsuario(visoesService.getUsuarioLogin(), objetoAnaliseDrePorUsuario)
    }

    return(
        <>
            {objetoConteudoCard && !loading ? (
                <>
                    <SelectAnalisesDePcDevolvidas
                        uuidAnalisePcDevolvida={uuidAnalisePcDevolvida}
                        handleChangeSelectAnalisesDePcDevolvidas={handleChangeSelectAnalisesDePcDevolvidas}
                        analisesDePcDevolvidas={analisesDePcDevolvidas}
                    />

                    <CardsInfoDevolucaoSelecionada
                        objetoConteudoCard={objetoConteudoCard}
                    />
                </>
            ):
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            }
        </>
    )

}
export default memo(CardsDevolucoesParaAcertoDaDre)
