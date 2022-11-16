import React, { Fragment } from 'react';
import './styles.scss'
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";

export const ComentariosNotificados = ({comentarios}) => {
    const dataTemplate = useDataTemplate()
    return (
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
                
                return  <input className="form-control form-control-md mb-2" type="text"  defaultValue={value.comentario}/>
            })}
        </>
        )
}