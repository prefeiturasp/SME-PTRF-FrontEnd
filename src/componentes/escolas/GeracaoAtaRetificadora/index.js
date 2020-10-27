import React, {useState, useEffect} from "react";
import {getAtaRetificadora, getIniciarAtaRetificadora} from "../../../services/escolas/PrestacaoDeContas.service";
import {exibeDateTimePT_BR_Ata} from "../../../utils/ValidacoesAdicionaisFormularios";
import {BoxAtaRetificadora} from "./BoxAtaRetificadora";
import "../GeracaoDaAta/geracao-da-ata.scss"

export const GeracaoAtaRetificadora = ({uuidPrestacaoConta, statusPrestacaoDeConta}) => {
    const [dadosAtaRetificadora, setDadosAtaRetificadora] = useState(false);
    const [corBoxAtaRetificadora, setCorBoxAtaRetificadora] = useState("");
    const [textoBoxAtaRetificadora, setTextoBoxAtaRetificadora] = useState("");
    const [dataBoxAtaRetificadora, setDataBoxAtaRetificadora] = useState("");

    useEffect(() => {
        carregagaDadosAtaRetificadora();
    }, []);


    const carregagaDadosAtaRetificadora = async () => {
        try {
            let dados = await getAtaRetificadora(uuidPrestacaoConta);
            setDadosAtaRetificadora(dados);
            console.log("DADOS 01 ", dados);
            setTextoBoxAtaRetificadora(dados.nome);
            if (dados.alterado_em === null){
                setCorBoxAtaRetificadora("vermelho");
                setDataBoxAtaRetificadora("Ata não preenchida");
            }
            else {
                setCorBoxAtaRetificadora("verde");
                setDataBoxAtaRetificadora("Último preenchimento em "+exibeDateTimePT_BR_Ata(dados.alterado_em));
            }
        } catch (e) {
            if (statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === "DEVOLVIDA") {
                let dados = await getIniciarAtaRetificadora(uuidPrestacaoConta);
                setDadosAtaRetificadora(dados)
                setCorBoxAtaRetificadora("vermelho");
                setTextoBoxAtaRetificadora(dados.nome);
                setDataBoxAtaRetificadora("Ata não preenchida");
            }
        }
    };

    const onClickVisualizarAta = () =>{
        console.log('onClickVisualizarAta ', dataBoxAtaRetificadora)
        window.location.assign(`/visualizacao-da-ata/${dadosAtaRetificadora.uuid}`)
    };

    console.log("DADOS 01 ", dadosAtaRetificadora);

    return (
        <>
            {dataBoxAtaRetificadora &&
                <BoxAtaRetificadora
                    corBoxAtaRetificadora={corBoxAtaRetificadora}
                    textoBoxAtaRetificadora={textoBoxAtaRetificadora}
                    dataBoxAtaRetificadora={dataBoxAtaRetificadora}
                    onClickVisualizarAta={onClickVisualizarAta}
                />
            }

        </>
    )

};