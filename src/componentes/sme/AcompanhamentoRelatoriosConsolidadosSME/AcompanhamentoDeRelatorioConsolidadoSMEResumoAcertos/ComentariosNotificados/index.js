import React from 'react';
import './styles.scss'

export const ComentariosNotificados = ({}) => {
    return (
        <>
            <h5 className="mb-4 mt-5"><strong>Comentários Notificados</strong></h5>

            <span className='mb-2'><strong>Data da notificação :</strong>20/20/2020</span>
            <input className="form-control form-control-md mb-2" type="text"  defaultValue={'A entrada da prestação de contas está muito baixa'}/>

            <span className='mb-2'><strong>Data da notificação :</strong>20/20/2020</span>
            <input className="form-control form-control-md" type="text"  defaultValue={'A entrada da prestação de contas está muito baixa'}/>
        </>
        )
}