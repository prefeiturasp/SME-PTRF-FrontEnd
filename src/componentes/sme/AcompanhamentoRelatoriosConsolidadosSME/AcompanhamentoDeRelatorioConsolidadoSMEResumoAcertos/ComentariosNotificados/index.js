import React, { Fragment, useEffect, useState } from 'react';
import './styles.scss'
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";

export const ComentariosNotificados = ({comentarios}) => {
    const dataTemplate = useDataTemplate()

    const [comentariosNotificados, setComentariosNotificados] = useState([])

    useEffect(() => {
        let comentariosNotificadosFiltrados = comentarios.reduce(function(notificados, comentario){
              if(comentario.notificado) {
                return [...notificados, comentario];
              }
              return [...notificados];
        }, []);

        setComentariosNotificados(comentariosNotificadosFiltrados)
    },[comentarios])

    return (
            comentariosNotificados.length > 0 ?
                (
                <>
                    <h5 className="mb-4 mt-5"><strong>Comentários Notificados</strong></h5>

                    {comentarios.map((value, index) => {
                        if (value.notificado) {
                            return (
                                <Fragment key={index}>
                                <span className='mb-2'><strong>Data da notificação : </strong>{dataTemplate(null, null, value.notificado_em)}</span>
                                <input className="form-control form-control-md mb-2" type="text"  defaultValue={value.comentario}/>
                                </Fragment>
                            )
                        }
                    })}
                    
                </>
                ) : <></>
        )
}