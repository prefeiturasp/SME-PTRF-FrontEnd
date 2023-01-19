import React, {memo} from "react";
import BotaoAcertoDocumentoInclusaoGasto from "./BotaoAcertoDocumentoInclusaoGasto";
import BotaoAcertosDocumentosInclusaoCredito from "./BotaoAcertoDocumentoInclusaoCredito";

const BotoesDetalhesParaAcertosDeCategorias = ({analise_documento, prestacaoDeContasUuid, prestacaoDeContas, analisePermiteEdicao, uuid_acerto_documento, acerto}) =>{
    return(
        <>
            <div className='row'>
                <div className='col-12 px-4 py-2 text-right container-botoes-ajustes'>
                    {analise_documento && analise_documento.requer_inclusao_gasto &&
                        <BotaoAcertoDocumentoInclusaoGasto
                            analise_documento={analise_documento}
                            acerto={acerto}
                            uuid_acerto_documento={uuid_acerto_documento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            analisePermiteEdicao={analisePermiteEdicao}
                        />
                    }
                    {analise_documento && analise_documento.requer_inclusao_credito &&
                        <BotaoAcertosDocumentosInclusaoCredito
                            analise_documento={analise_documento}
                            acerto={acerto}
                            uuid_acerto_documento={uuid_acerto_documento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            analisePermiteEdicao={analisePermiteEdicao}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default memo(BotoesDetalhesParaAcertosDeCategorias)

