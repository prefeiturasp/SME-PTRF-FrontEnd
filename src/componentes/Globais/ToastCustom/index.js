import React from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast-custom.scss'

const Msg = (titulo, texto) => {
    return(
        <div>
            <p className='mb-0 fonte-16'><strong>{titulo}</strong></p>
            <p className='mb-0 fonte-16'>{texto}</p>
        </div>
    )
}

const ToastCustom = (titulo, texto, tipo, posicao, autoClose) => {
    return (
        toast[tipo](
            Msg(titulo, texto),
            {
                position: posicao,
                autoClose: autoClose,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme:"dark",
                className: 'toast-custom-margin-top'
            })
    )
}

const ToastCustomSuccess = (titulo, texto, tipo='success', posicao='top-right', autoClose=true) =>{
    ToastCustom(titulo, texto, tipo, posicao, autoClose)
}

const ToastCustomGrandeSuccess = (titulo, texto, tipo='success', posicao='top-right', autoClose=true) => {

    let box = document.querySelector('.page-content-inner');
    let width = box.offsetWidth;

    let root = document.documentElement;
    root.style.setProperty('--toastify-toast-width', width+'px');

    ToastCustom(titulo, texto, tipo, posicao, autoClose)
}

export const toastCustom = {
    ToastCustomSuccess,
    ToastCustomGrandeSuccess,
}