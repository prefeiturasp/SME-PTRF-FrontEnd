import React, {memo} from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import IconeEditarRetificacao from "../BlocoRetificacao/IconeEditarRetificacao";
const dataTemplate = useDataTemplate()

const InfoRetificacaoRelatorio = ({consolidadoDre}) => {
    return(
        <>
            {consolidadoDre && consolidadoDre.data_publicacao &&
                <div className='mb-0 fonte-12 fonte-normal'>
                    <strong>Data da publicação:</strong> {dataTemplate(null, null, consolidadoDre.data_publicacao)}
                    <IconeEditarRetificacao
                        consolidadoDre={consolidadoDre}
                    />
                </div>
            }
        </>
    )
}

export default memo(InfoRetificacaoRelatorio)