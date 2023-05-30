import React, {useEffect, useState} from "react";
import {getUnidades} from "../../../services/dres/Unidades.service"
import {ListaDeUnidades} from "./ListaDeUnidades";
import Loading from "../../../utils/Loading";
import {FiltroDeUnidades} from "./FiltroDeUnidades";
import Img404 from "../../../assets/img/img-404.svg";
import {MsgImgCentralizada} from "../Mensagens/MsgImgCentralizada";
import { ModalLegendaInformacao } from "../../Globais/ModalLegendaInformacao/ModalLegendaInformacao";

export const EscolheUnidade = (props) =>{

    const {dre_uuid, visao} = props

    const initialStateFiltros = {
        nome_ou_codigo: "",
    };

    const mensagemListaVaziaSemFiltroAplicado = 'Use parte do nome ou código EOL para localizar a unidade para qual você deseja viabilizar o acesso de suporte.'
    const mensagemListaVaziaComFiltroAplicadoDRE = 'Não foi encontrada nenhuma unidade que corresponda ao filtro aplicado. Certifique-se que a unidade procurada é uma unidade subordinada à sua DRE.'
    const mensagemListaVaziaComFiltroAplicadoSME = 'Não foi encontrada nenhuma unidade que corresponda ao filtro aplicado.'

    const [loading, setLoading] = useState(false);
    const [listaUnidades, setListaUnidades] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [mensagemListaVazia, setMensagemListaVazia] = useState(mensagemListaVaziaSemFiltroAplicado)
    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false)

    useEffect(()=>{
        carregaListaUnidades();
    }, [stateFiltros]);

    useEffect( () => {
        if (stateFiltros.nome_ou_codigo === "") {
            setMensagemListaVazia(mensagemListaVaziaSemFiltroAplicado);
        } else {
            if (visao === 'DRE') setMensagemListaVazia(mensagemListaVaziaComFiltroAplicadoDRE);
            if (visao === 'SME') setMensagemListaVazia(mensagemListaVaziaComFiltroAplicadoSME);
        }
    }, [stateFiltros]);

    const carregaListaUnidades = async ()=>{
        if (stateFiltros.nome_ou_codigo !== "") {
            setLoading(true)
            try {
                let listaUnidades = await getUnidades(dre_uuid, stateFiltros.nome_ou_codigo);
                console.log(listaUnidades)
                setListaUnidades(listaUnidades);
            }catch (e) {
                console.log("Erro ao carregar lista de unidades.", e)
            }
            setLoading(false)
        }
        else {
            setListaUnidades([])
        }
    };

    const escolherUnidade = (unidadeSelecionada) => {
        props.onSelecionaUnidade(unidadeSelecionada)
    }

    const handleSubmitFiltros = (event, filtros)=>{
        event.preventDefault();
        setStateFiltros(filtros);
    };

    const limpaFiltros = () => {
        setStateFiltros(initialStateFiltros);
    };

    return(
        <div style={{paddingTop: "15px"}}>
            <FiltroDeUnidades
                stateFiltros={stateFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
                filtroInicial={initialStateFiltros}
            />

            {loading && <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0"/>}

            {!loading && listaUnidades && listaUnidades.length > 0 &&
                <ListaDeUnidades
                    listaUnidades={listaUnidades}
                    rowsPerPage={10}
                    acaoAoEscolherUnidade={escolherUnidade}
                    textoAcaoEscolher={"Viabilizar acesso"}
                    setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                />
            }

            {!loading && (!listaUnidades || listaUnidades.length === 0) &&
                <MsgImgCentralizada
                    texto={mensagemListaVazia}
                    img={Img404}
                />
            }

            <section>
                <ModalLegendaInformacao
                    show={showModalLegendaInformacao}
                    primeiroBotaoOnclick={() => setShowModalLegendaInformacao(false)}
                    titulo="Legenda Informação"
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="outline-success"
                    entidadeDasTags="associacao"
                />
            </section>

        </div>
    )
}
