import React, {useCallback, useEffect, useState} from "react";
import {getAtas, getDownloadAtaPdf, getGerarAtaPdf} from "../../../../services/escolas/AtasAssociacao.service";
import {ModalNaoPodeGerarAta} from "../../GeracaoDaAta/ModalNaoPodeGerarAta";
import Spinner from "../../../../assets/img/spinner.gif";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {getPeriodoFechado} from "../../../../services/escolas/Associacao.service";

export const BoxAtaRetificadora = ({
                                       corBoxAtaRetificadora,
                                       textoBoxAtaRetificadora,
                                       dataBoxAtaRetificadora,
                                       onClickVisualizarAta,
                                       uuidPrestacaoConta,
                                       uuidAtaRetificacao,
                                       statusPc
}) => {
    const [dadosAtaRetificadora, setDadosAtaRetificadora] = useState({});
    const [docPrestacaoConta, setDocPrestacaoConta] = useState({});
    const [showNaoPodeGerarAta, setShowNaoPodeGerarAta] = useState(false);
    const [textoModalAta, setTextoModalAta] = useState('<p>Você não pode gerar o PDF de uma ata incompleta.</p>');

    useEffect(() => {
        if (uuidAtaRetificacao && dadosAtaRetificadora && dadosAtaRetificadora.status_geracao_pdf && dadosAtaRetificadora.status_geracao_pdf === 'EM_PROCESSAMENTO'){
            const timer = setInterval(() => {
                getDadosAta();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        }
    });

    const getDadosAta = useCallback(async ()=>{
        let periodo_prestacao_de_contas = JSON.parse(localStorage.getItem("periodoPrestacaoDeConta"));
        if (uuidAtaRetificacao){
            let dados_ata = await getAtas(uuidAtaRetificacao);
            let doc_pc = periodo_prestacao_de_contas.data_inicial ? await getPeriodoFechado(periodo_prestacao_de_contas.data_inicial) : null;
            setDadosAtaRetificadora(dados_ata)
            setDocPrestacaoConta(doc_pc)
        }
    }, [uuidAtaRetificacao])

    useEffect(()=>{
        getDadosAta()
    }, [getDadosAta])

    const gerarAtaPDF = async () => {
        try {
            await getGerarAtaPdf(uuidPrestacaoConta, uuidAtaRetificacao)
            getDadosAta()
        }
        catch (e) {
            let mensagem = ''
            let camposInvalidos = e.response.data.campos_invalidos
            camposInvalidos.map((element) => {
                mensagem += typeof(element) === 'object' ? ` ${element['msg_presente']}` : ` ${element}, `
            })
            setTextoModalAta(`<p>Você não pode gerar o PDF de uma ata incompleta. Para completa-la ${camposInvalidos[0]['msg_presente'] ? mensagem :  `preencha os campo(s) ${mensagem}`}.</p>`.replace(/,(?=[^,]*$)/, '')) // Regex remove espaço em branco e virgula no final. ⮕ (/,(?=[^,]*$)/,) ''
            setShowNaoPodeGerarAta(true)
        }
    }

    const download_ata_pdf = async () => {
        await getDownloadAtaPdf(uuidAtaRetificacao)
    }

    return (
        <div className="row mt-2">
            <div className="col-12">
                <div className="col-12">
                    <div className="row mt-3 container-box-prestacao-de-contas-por-periodo pt-4 pb-4">
                        <div className="col-12 col-md-8">
                            <p className='fonte-14 mb-1'><strong>{textoBoxAtaRetificadora}</strong></p>

                            <p className={`fonte-12 mb-1 status-data-${corBoxAtaRetificadora}`}>
                                {dataBoxAtaRetificadora}

                                {dadosAtaRetificadora && dadosAtaRetificadora.status_geracao_pdf && dadosAtaRetificadora.status_geracao_pdf === "EM_PROCESSAMENTO" ? (
                                    <span className='text-body'> Gerando ata em PDF<img src={Spinner} style={{height: "22px"}} alt=''/></span>
                                    ) : dadosAtaRetificadora && dadosAtaRetificadora.status_geracao_pdf && dadosAtaRetificadora.status_geracao_pdf === "CONCLUIDO" &&
                                    <button className='btn-editar-membro'
                                            type='button'
                                            onClick={download_ata_pdf}
                                    >
                                        <FontAwesomeIcon
                                            style={{fontSize: '18px'}}
                                            icon={faDownload}
                                        />
                                        &nbsp;PDF
                                    </button>
                                }

                            </p>
                        </div>
                        <section>
                        <ModalNaoPodeGerarAta 
                            show={showNaoPodeGerarAta}
                            handleClose={() => { setShowNaoPodeGerarAta(false) }}
                            setShowNaoPodeGerarAta={setShowNaoPodeGerarAta}
                            titulo="Campo em ata incompletos"
                            texto={textoModalAta}
                            primeiroBotaoTexto="Fechar"
                            primeiroBotaoCss="outline-success"
                        />
                        </section>
                        <div className="col-12 col-md-4 align-self-center">
                            <button onClick={()=>onClickVisualizarAta()}  type="button" className="btn btn-success float-right">{statusPc !== 'DEVOLVIDA' ? "Visualizar ata" : "Visualizar prévia da ata"}</button>
                            { statusPc !== 'DEVOLVIDA' && docPrestacaoConta.gerar_ou_editar_ata_retificacao &&
                                <button
                                    onClick={() => gerarAtaPDF()}
                                    type="button"
                                    className="btn btn-outline-success float-right mr-2"
                                >
                                    gerar ata
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};