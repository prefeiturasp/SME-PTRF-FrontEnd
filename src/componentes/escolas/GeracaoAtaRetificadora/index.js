import React, {useState, useEffect} from "react";
import {getAtaRetificadora, getIniciarAtaRetificadora} from "../../../services/escolas/PrestacaoDeContas.service";
import {exibeDateTimePT_BR_Ata} from "../../../utils/ValidacoesAdicionaisFormularios";
import {BoxAtaRetificadora} from "./BoxAtaRetificadora";
import "../GeracaoDaAta/geracao-da-ata.scss"

export const GeracaoAtaRetificadora = ({uuidPrestacaoConta, statusPrestacaoDeConta, }) => {
    const [dadosAtaRetificadora, setDadosAtaRetificadora] = useState(false);
    const [corBoxAtaRetificadora, setCorBoxAtaRetificadora] = useState("");
    const [textoBoxAtaRetificadora, setTextoBoxAtaRetificadora] = useState("");
    const [dataBoxAtaRetificadora, setDataBoxAtaRetificadora] = useState("");
    const [gerarAtaRetificadora, setGerarAtaRetificadora] = useState(false);

    useEffect(() => {
        carregagaDadosAtaRetificadora();
    }, []);


    const carregagaDadosAtaRetificadora = async () => {
        try {
            let dados = await getAtaRetificadora(uuidPrestacaoConta);
            setDadosAtaRetificadora(dados);
            setTextoBoxAtaRetificadora(dados.nome);
            if (dados.alterado_em === null){
                setCorBoxAtaRetificadora("vermelho");
                setDataBoxAtaRetificadora("Ata não preenchida");
                setGerarAtaRetificadora(false)
            }
            else {
                setCorBoxAtaRetificadora("verde");
                setDataBoxAtaRetificadora("Último preenchimento em "+exibeDateTimePT_BR_Ata(dados.alterado_em));
                setGerarAtaRetificadora(true)
            }
        } catch (e) {
            debugger
            if (statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === "DEVOLVIDA" || statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === "DEVOLVIDA_RETORNADA") {
                let dados = await getIniciarAtaRetificadora(uuidPrestacaoConta);
                setDadosAtaRetificadora(dados)
                setCorBoxAtaRetificadora("vermelho");
                setTextoBoxAtaRetificadora(dados.nome);
                setDataBoxAtaRetificadora("Ata não preenchida");
            }
        }
    };

    const onClickVisualizarAta = () =>{
        window.location.assign(`/visualizacao-da-ata/${dadosAtaRetificadora.uuid}`)
    };
    return (
        <>
            {dataBoxAtaRetificadora &&
                <BoxAtaRetificadora
                    corBoxAtaRetificadora={corBoxAtaRetificadora}
                    textoBoxAtaRetificadora={textoBoxAtaRetificadora}
                    dataBoxAtaRetificadora={dataBoxAtaRetificadora}
                    onClickVisualizarAta={onClickVisualizarAta}
                    uuidPrestacaoConta={uuidPrestacaoConta}
                    uuidAtaRetificacao={dadosAtaRetificadora ? dadosAtaRetificadora.uuid : ""}
                    gerarAtaRetificadora={gerarAtaRetificadora}
                />
            }

        </>
    )

};