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
        let nome_dre = "";
        let tipo_conta = "";
        let filename = "";

        if (consolidadoDre && consolidadoDre.dre_nome) {
            nome_dre = formataNomeDRE(consolidadoDre.dre_nome).toLowerCase();
        }

        if (lauda && lauda.tipo_conta) {
            tipo_conta = lauda.tipo_conta.toLowerCase();
            filename = `Lauda_${nome_dre}_${tipo_conta}.docx.txt`;
        } else {
            filename = `Lauda_${nome_dre}.docx.txt`
        }

        await getDownloadLauda(lauda.uuid, filename);
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
                                                    <strong>Lauda {lauda && lauda.tipo_conta ? "- Conta " + lauda.tipo_conta : ""}</strong>
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
                                                <strong>Lauda {lauda && lauda.tipo_conta ? "- Conta " + lauda.tipo_conta : ""}</strong>
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
