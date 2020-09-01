import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";

export const CardNotificacoes = ({toggleBtnNotificacoes, clickBtnNotificacoes}) => {
    const notificacoes = [
        {
            status: "urgente",
            titulo: "Documentos faltantes na prestação de contas",
            remetente: "DRE",
            categoria: "Prestação de Contas",
            mensagem: "A prestação de contas foi recebida pela Diretoria Regional de Educação Ipiranga, porém o Demonstrativo Financeiro do PTRF não consta no SEI. A prestação foi devolvida para acertos.",
        },
        {
            status: "2 - urgente",
            titulo: "2 - Documentos faltantes na prestação de contas",
            remetente: "2 - DRE",
            categoria: "2 - Prestação de Contas",
            mensagem: "2 - A prestação de contas foi recebida pela Diretoria Regional de Educação Ipiranga, porém o Demonstrativo Financeiro do PTRF não consta no SEI. A prestação foi devolvida para acertos.",
        },

    ];
    return (
        <>
            <div className="accordion mt-5" id="accordionNotificacoes">

                {notificacoes && notificacoes.length > 0 && notificacoes.map((notificacao, index)=>

                    <div className="card mt-3" key={index}>
                        <div className="card-header" id="headingOne">

                                <div className="row">
                                    <div className="col-11">

                                        <div className="row">
                                            <div className="col-2 align-self-center">
                                                {notificacao.status}
                                            </div>
                                            <div className="col-10">
                                                <p className="mb-0">{notificacao.titulo}</p>
                                                <p className="mb-0"><span>Remetente: {notificacao.remetente}</span> | <span>Categoria: {notificacao.categoria}</span></p>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="col-1">
                                        <button onClick={() => toggleBtnNotificacoes(index)}
                                                className="btn btn-link btn-block text-left px-0" type="button"
                                                data-toggle="collapse" data-target={`#collapse${index}`}
                                                aria-expanded="true" aria-controls={`collapse${index}`}>
                                            <span className='span-icone-toogle'>
                                                <FontAwesomeIcon
                                                    style={{marginRight: "0", color: 'black'}}
                                                    icon={clickBtnNotificacoes[index] ? faChevronUp : faChevronDown}
                                                />
                                            </span>
                                        </button>
                                    </div>
                                </div>

                        </div>

                        <div id={`collapse${index}`} className="collapse" aria-labelledby="headingOne" data-parent="#accordionNotificacoes">
                            <div className="card-body">
                                {notificacao.mensagem}
                            </div>
                        </div>
                    </div>

                )}

            </div>
        </>
    );
};