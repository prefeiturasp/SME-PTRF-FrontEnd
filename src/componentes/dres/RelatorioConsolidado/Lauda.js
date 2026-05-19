import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {getDownloadLauda} from "../../../services/dres/Laudas.service";
import {formataNomeDRE} from "../../../utils/ValidacoesAdicionaisFormularios";

const Lauda = ({consolidadoDre}) => {

    const retornaClasseMensagem = (texto) => {
        let classeMensagem = "documento-gerado";
        if (texto === 'NAO_GERADOS') {
            classeMensagem = "documento-pendente"
        }
        if (texto === 'EM_PROCESSAMENTO') {
            classeMensagem = "documento-processando"
        }
        return classeMensagem
    }

    const downloadLauda = async (lauda) => {
        const slugDre = consolidadoDre?.dre_nome
            ? formataNomeDRE(consolidadoDre.dre_nome).toLowerCase()
            : '';
        const arquivoFallback = slugDre ? `Lauda_${slugDre}.pdf` : 'Lauda.pdf';

        await getDownloadLauda(lauda.uuid, arquivoFallback);
    };

    return (
        <> {consolidadoDre?.gerou_uma_retificacao && consolidadoDre.laudas.length === 0 ?
            <div className="border">
                <div className="col-12 col-md-8">
                    <div className='mt-2 mb-3'>
                        <p className='fonte-14 mb-1 mr-5'><strong>Lauda</strong></p>
                        <p className={`fonte-12 mb-0`}>
                            <span style={{'color': '#B40C02'}}>{'Documento pedente de geração'}</span></p>
                    </div>
                </div>
            </div>
            :
            <div className="border">
                {consolidadoDre.laudas && consolidadoDre.laudas.length > 0 &&
                    <>
                        {consolidadoDre.laudas.map((lauda) =>
                            lauda.sem_movimentacao ? (
                                    <div className='row px-2' key={lauda.uuid}>
                                        <div className="col-12 col-md-8">
                                            <div className='mt-2 mb-3'>
                                                <p className='fonte-14 mb-1'>
                                                    <strong>Lauda</strong>
                                                </p>
                                                <p className={`fonte-12 mb-0`}>
                                                    <span>{lauda.mensagem_sem_movimentacao}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) :
                                <div className='row px-2' key={lauda.uuid}>
                                    <div className="col-12 col-md-8">
                                        <div className='mt-2 mb-3'>
                                            <p className='fonte-14 mb-1'>
                                                <strong>Lauda</strong>
                                            </p>
                                            <p className={`fonte-12 mb-0 ${retornaClasseMensagem(lauda.status)}`}>
                                                <span>{lauda.status_geracao_arquivo}</span>
                                                <button className='btn-editar-membro' type='button'>
                                                    <FontAwesomeIcon
                                                        onClick={() => downloadLauda(lauda)}
                                                        style={{fontSize: '18px'}}
                                                        icon={faDownload}/>
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </>
                }
            </div>
        } </>
    )

}
export default memo(Lauda)
