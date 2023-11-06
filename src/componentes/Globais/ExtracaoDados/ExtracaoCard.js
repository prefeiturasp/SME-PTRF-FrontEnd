import React from 'react';
import './extracao-dados.scss'

export const ExtracaoCard = ({titulo, descricao, tags, action}) => {
    return (
        <section className="extracao-card">
            <div className="extracao-card-container">
                <h4 className="extracao-card-title">{ titulo }</h4>
                <p className="extracao-card-description">{ descricao }</p>
                <div className="extracao-card-tags">
                    { tags.map(tag => <span key={tag} className="extracao-card-tag"> {tag} </span>) }
                </div>
            </div>
            <div className="extracao-card-action">
                 { action() }
            </div>
        </section>
    )
}
