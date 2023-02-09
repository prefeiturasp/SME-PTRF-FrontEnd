import React from "react";
import './ata-parecer-tecnico.scss';
import { exibeDateTimePT_BR_Ata } from "../../../../utils/ValidacoesAdicionaisFormularios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from "react-tooltip";
import {getDownloadAtaParecerTecnico} from "../../../../services/dres/AtasParecerTecnico.service";
import {postCriarAtaAtrelarAoConsolidadoDre} from "../../../../services/dres/RelatorioConsolidado.service";

export const AtaParecerTecnico = ({consolidadoDre, podeAcessarInfoConsolidado}) => {

    const onClickVerAta = (uuid_ata) =>{
        window.location.assign(`/visualizacao-da-ata-parecer-tecnico/${uuid_ata}/${consolidadoDre.ja_publicado}`)
    };


    const criarAtaAtrelarAoConsolidado = async (dre_uuid, periodo_uuid, consolidado_uuid=null) =>{
        let payload = {
            dre: dre_uuid,
            periodo: periodo_uuid,
            consolidado: consolidado_uuid,
        }
        try {
            let ata = await postCriarAtaAtrelarAoConsolidadoDre(payload)
            onClickVerAta(ata.uuid)
        }catch (e) {
            console.log("Erro ao criar a Ata - criarAtaAtrelarAoConsolidado", e)
        }
    }

    const downloadAtaParecerTecnico = async () =>{
        await getDownloadAtaParecerTecnico(consolidadoDre.ata_de_parecer_tecnico.uuid);
    };

    const mensagem = (ata) => {
        if(!ata || ata.uuid === undefined){
            return "Documento pendente de geração";
        }
        else if(ata.uuid && ata.alterado_em){
            return "Último preenchimento em " + exibeDateTimePT_BR_Ata(ata.alterado_em);
        }
        else if(ata.uuid && ata.alterado_em === null){
            return "Ata não preenchida";
        }
    }

    const classeMensagem = (ata) => {
        if(!ata || ata.uuid === undefined || ata.alterado_em === null){
            return "ata-nao-preenchida"
        }
        else if(ata.uuid && ata.alterado_em){
            return "ata-preenchida"
        }
    }

    return (
        <>
            <div className="rounded-bottom border">
                <div className='row px-2'>
                    <div className="col-12 col-md-8">
                        <div className='mt-2 mb-3'>
                            <p className='fonte-14 mb-1'><strong>Ata de apresentação do Parecer Técnico Conclusivo</strong></p>
                            <p className={`fonte-12 mb-2 ${classeMensagem(consolidadoDre.ata_de_parecer_tecnico)}`}>
                                <span>{mensagem(consolidadoDre.ata_de_parecer_tecnico)}</span>
                                {consolidadoDre.ata_de_parecer_tecnico && consolidadoDre.ata_de_parecer_tecnico.arquivo_pdf &&
                                    <button className='btn-editar-membro' type='button'>
                                        <FontAwesomeIcon
                                            onClick={() => downloadAtaParecerTecnico()}
                                            style={{fontSize: '18px'}}
                                            icon={faDownload}
                                        />
                                    </button>
                                }
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 align-self-center text-right">
                        {consolidadoDre.ata_de_parecer_tecnico && consolidadoDre.ata_de_parecer_tecnico.uuid ? (
                            <button
                                onClick={() => onClickVerAta(consolidadoDre.ata_de_parecer_tecnico.uuid)}
                                type="button"
                                className="btn btn-outline-success btn-sm"
                            >
                                {consolidadoDre.ja_publicado ? "Consultar" : "Preencher"} ata
                            </button>
                            ):
                            <>
                                <span data-html={true} data-tip={!podeAcessarInfoConsolidado(consolidadoDre) ? "Não é possível preencher a ata. A análise da(s) prestação(ões) de contas em retificação ainda não foi concluída." : ""}>
                                <button
                                    onClick={() => criarAtaAtrelarAoConsolidado(consolidadoDre.dre_uuid, consolidadoDre.periodo_uuid, consolidadoDre.uuid ? consolidadoDre.uuid : null)}
                                    type="button"
                                    className="btn btn-outline-success btn-sm"
                                    disabled={!podeAcessarInfoConsolidado(consolidadoDre)}
                                >
                                    Preencher ata
                                </button>
                                </span>
                                <ReactTooltip html={true}/>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}