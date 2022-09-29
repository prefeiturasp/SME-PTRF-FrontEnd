import React, {memo} from "react";
import BotaoAcertoDocumentoInclusaoGasto from "./BotaoAcertoDocumentoInclusaoGasto";
import BotaoAcertosDocumentosInclusaoCredito from "./BotaoAcertoDocumentoInclusaoCredito";

const BotoesDetalhesParaAcertosDeCategorias = ({analise_documento, prestacaoDeContasUuid, prestacaoDeContas}) =>{
    return(
        <>
            <div className='row'>
                <div className='col-12 px-4 py-2 text-right container-botoes-ajustes'>
                    {analise_documento && analise_documento.requer_inclusao_gasto &&
                        <BotaoAcertoDocumentoInclusaoGasto
                            analise_documento={analise_documento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                        />
                    }
                    {analise_documento && analise_documento.requer_inclusao_credito &&
                        <BotaoAcertosDocumentosInclusaoCredito
                            analise_documento={analise_documento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default memo(BotoesDetalhesParaAcertosDeCategorias)

