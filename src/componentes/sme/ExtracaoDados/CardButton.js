import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import './extracao-dados.scss'

export const CardButton = ( { children, ...props }) => {
    return (
            <button className="extracao-card-button" {...props} >
                <FontAwesomeIcon icon={faDownload} />
                { children } 
            </button>
        )
} 