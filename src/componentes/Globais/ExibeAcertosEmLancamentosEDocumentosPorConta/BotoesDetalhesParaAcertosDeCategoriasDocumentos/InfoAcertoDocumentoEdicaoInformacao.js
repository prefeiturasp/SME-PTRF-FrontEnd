import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import LinkCustomSemAcao from "./LinkCustomSemAcao";

const InfoAcertoDocumentoEdicaoInformacao = ({analise_documento}) => {
    return (
        <>
            {analise_documento && analise_documento.informacao_conciliacao_atualizada
                ?
                    <LinkCustomSemAcao
                        classeCssBotao='texto-green text-center'
                    >
                        <>
                            <FontAwesomeIcon
                                style={{fontSize: '16px', color: '#00585E'}}
                                icon={faCheckCircle}
                            />
                            <strong> Justificativas e informações adicionais atualizada </strong>
                        </>
                    </LinkCustomSemAcao>

                :
                    null    
            }
        </>
    )
}

export default memo(InfoAcertoDocumentoEdicaoInformacao)