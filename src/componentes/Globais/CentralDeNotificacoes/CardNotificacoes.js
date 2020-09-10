import React, {Fragment} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown, faUser} from "@fortawesome/free-solid-svg-icons";
import {slugify} from "../../../utils/ValidacoesAdicionaisFormularios";

export const CardNotificacoes = ({notificacoes, toggleBtnNotificacoes, clickBtnNotificacoes, handleChangeMarcarComoLida}) => {

    console.log("Card Noticacoes ", notificacoes)

    return (
        <>
            <div className="accordion mt-1" id="accordionNotificacoes">

                <h1>{notificacoes.data}</h1>

                {notificacoes && notificacoes && notificacoes.length > 0 && notificacoes.map((notificacao, index)=>
                    <Fragment key={index}>

                        <p className="data-notificacoes mt-3">{notificacao.data}</p>

                        {notificacao.infos && notificacao.infos.length > 0 && notificacao.infos.map((info)=>

                            <div className="card mt-3" key={info.uuid}>
                                <div className={`card-header card-tipo-${slugify(info.tipo)}`} id={`heading_${info.uuid}`}>

                                    <div className="row">
                                        <div className="col-11">

                                            <div className="row">
                                                <div className="col-md-3 col-xl-2 align-self-center">
                                                    <span className={`span-tipo-${slugify(info.tipo)}`}>{info.tipo}</span>
                                                </div>
                                                <div className="col-md-9 col-xl-10">
                                                    <p className="mb-0 titulo-notificacao">{info.titulo}</p>
                                                    <p className="mb-0"><span className="remetente-categoria"><FontAwesomeIcon style={{marginRight: "3px", color: '#7D7D7D'}} icon={faUser}/>Remetente: {info.remetente}</span> | <span className="remetente-categoria">Categoria: {info.categoria}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-1">
                                            <button
                                                onClick={() => toggleBtnNotificacoes(info.uuid)}
                                                className="btn btn-link btn-block text-left px-0" type="button"
                                                data-toggle="collapse" data-target={`#collapse_${info.uuid}`}
                                                aria-expanded="true" aria-controls={`collapse_${info.uuid}`}
                                            >
                                                <span className='span-icone-toogle'>
                                                    <FontAwesomeIcon
                                                        style={{marginRight: "0", color: 'black'}}
                                                        icon={clickBtnNotificacoes[info.uuid] ? faChevronUp : faChevronDown}
                                                    />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div id={`collapse_${info.uuid}`} className="collapse" aria-labelledby="headingOne" data-parent="#accordionNotificacoes">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-10">
                                                {info.descricao}
                                            </div>
                                            <div className="col-2 align-self-center">
                                                <input
                                                    //checked={conciliados}
                                                    type="checkbox"
                                                    //value={checkboxDespesas}
                                                    onChange={(e)=>handleChangeMarcarComoLida(e, info.uuid)}
                                                    name="checkConferido"
                                                    id="exampleCheck1"
                                                    className="form-check-input"
                                                    defaultChecked={info.lido}
                                                />
                                                <label className="form-check-label marcar-como-lida" htmlFor="exampleCheck1">Marcar como lida</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )}
                    </Fragment>
                )}
            </div>
        </>
    );
};