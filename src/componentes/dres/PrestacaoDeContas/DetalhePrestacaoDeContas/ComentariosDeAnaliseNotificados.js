import React, {Fragment, memo} from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";

const ComentariosDeAnaliseNotificados = ({comentariosNotificados}) => {
    const dataTemplate = useDataTemplate()
    return (
        <>
            <p className='mb-2 fonte-14 lista-motivos'>Comentários já notificados</p>
            {comentariosNotificados && comentariosNotificados.length > 0 ? (
                    comentariosNotificados.map((comentario) => (
                        <Fragment key={comentario.uuid}>
                            <p className='mb-0 p-2 border'>{comentario.comentario}</p>
                            <p className='mb-2'><i>Notificado {dataTemplate(null, null, comentario.notificado_em)}</i></p>
                        </Fragment>
                    ))
                ) :
                <p data-qa="info-nao-existem-comentarios-notificados">Não existem comentários notificados</p>
            }
        </>
    )
}

export default memo(ComentariosDeAnaliseNotificados)