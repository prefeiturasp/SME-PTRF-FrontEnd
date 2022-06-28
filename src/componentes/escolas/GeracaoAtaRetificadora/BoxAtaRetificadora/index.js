import React, {useCallback, useEffect, useState} from "react";
import {getAtas, getDownloadAtaPdf, getGerarAtaPdf} from "../../../../services/escolas/AtasAssociacao.service";
import {ModalNaoPodeGerarAta} from "../../GeracaoDaAta/ModalNaoPodeGerarAta";
import Spinner from "../../../../assets/img/spinner.gif";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

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
        if (uuidAtaRetificacao){
            let dados_ata = await getAtas(uuidAtaRetificacao);
            setDadosAtaRetificadora(dados_ata)
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
            const camposInvalidos = e.response.data.campos_invalidos.join(', ');
            setTextoModalAta(`<p>Você não pode gerar o PDF de uma ata incompleta. Para completa-la preencha os campos ${camposInvalidos}.</p>`)
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
                            { statusPc !== 'DEVOLVIDA' &&
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