import React, {useState, useEffect} from "react";
import Spinner from "../../../../../assets/img/spinner.gif"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import Loading from "../../../../../utils/Loading";


export const RelatorioAposAcertos = ({analiseSequenciaVisualizacao, podeGerarPrevia}) => {
    const dataTemplate = useDataTemplate();
    const [disableBtnPrevia, setDisableBtnPrevia] = useState(true)
    const [versaoRascunho, setVersaoRascunho] = useState(true);

    return (
        false ? (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        ) :
            <div className="relacao-bens-container mt-5">
                <p className="relacao-bens-title">Relatório dos acertos </p>

                <article>
                    <div className="info">
                        {podeGerarPrevia
                            ?
                                <p className="fonte-14 mb-1"><strong>Relatório de devoluções para acertos</strong></p>
                            :
                                <p className="fonte-14 mb-1"><strong>{analiseSequenciaVisualizacao?.versao_numero}º Relatório de devoluções para acertos</strong></p>
                        }

                        <p className={`fonte-12 mb-1 ${'documento-gerado'}`}>
                            {`Documento gerado em ${dataTemplate(null, null, analiseSequenciaVisualizacao?.sequenciaConferencia?.data_limite)} às 00:00`}
                                <button 
                                    onClick={() => console.log('downloadDocumentoPrevia()')} 
                                    disabled={true} type="button" title="Download"
                                    className="btn-editar-membro"
                                >
                                    <FontAwesomeIcon
                                        style={{fontSize: '15px', marginRight: "0", color: "#00585E"}}
                                        icon={faDownload}
                                    />
                                </button>
                            {false ? <img alt="" src={Spinner} style={{height: "22px"}}/> : ''}
                        </p>
                    </div>

                    <div className="actions">
                        {podeGerarPrevia && versaoRascunho
                            ? 
                                <button onClick={(e) => () => console.log('gerarPrevia()')} type="button" disabled={disableBtnPrevia} className="btn btn-outline-success mr-2">Gerar prévia</button>
                            : 
                                null
                        }
                    </div>
                    
                </article>
            </div>  
    )
};