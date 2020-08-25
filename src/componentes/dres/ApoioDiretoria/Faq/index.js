import React, {useEffect, useState, Fragment} from "react";
import {getFaqCategorias, getFaqPorCategoria} from "../../../../services/dres/ApoioDiretoria.service";
import '../apoio-diretoria.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";

export const Faq = () => {

    const [faqCategorias, setFaqCategorias] = useState([]);
    const [faqsPorCategoria, setFaqsPorCategoria] = useState([]);
    const [clickBtnEscolheCategoria, setClickBtnEscolheCategoria] = useState(false);
    const [clickBtnFaq, setClickBtnFaq] = useState(false);

    useEffect(() => {
        getCategorias();
    }, []);

    const getCategorias = async () => {
        let categorias = await getFaqCategorias();
        console.log("Categorias ", categorias);
        setFaqCategorias(categorias);
    };

    const getFaqCategoria = async (categoria__uuid) => {
        let faqs = await getFaqPorCategoria(categoria__uuid);
        console.log("Faqs ", faqs)
        setFaqsPorCategoria(faqs)
    };

    const toggleBtnEscolheCategoria = (id) => {
        setClickBtnEscolheCategoria({
            [id]: !clickBtnEscolheCategoria[id]
        });
    };

    const toggleBtnFaq = (id) => {
        setClickBtnFaq({
            [id]: !clickBtnFaq[id]
        });
    };

    return (
        <>
            <ul className="nav nav-pills mt-5 container-faq-categorias">
                {faqCategorias && faqCategorias.length > 0 && faqCategorias.map((categoria, index) =>
                    <Fragment key={index}>
                        <li className="nav-item">
                            <button
                                onClick={() => {
                                    toggleBtnEscolheCategoria(index);
                                    getFaqCategoria(categoria.uuid)
                                }}
                                className={`nav-link btn-escolhe-categoria mr-3 ${clickBtnEscolheCategoria[index] ? "btn-escolhe-categoria-active" : ""}`}
                            >
                                {categoria.nome}
                            </button>
                        </li>
                    </Fragment>
                )}
            </ul>
            <div className="accordion mt-5" id="accordionFaq">
                {faqsPorCategoria && faqsPorCategoria.length > 0 && faqsPorCategoria.map((faq, index)=>
                    <div className="card" key={index}>
                        <div className="card-header" id="headingOne">
                            <h2 className="mb-0">
                                <div className="row">
                                    <div className="col-11">
                                        <button onClick={()=>toggleBtnFaq(index)} className="btn btn-link btn-block text-left btn-container-pergunta pl-0" type="button" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                            {faq.pergunta}
                                        </button>
                                    </div>
                                    <div className="col-1">
                                        <button onClick={()=>toggleBtnFaq(index)} className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                            <span className='span-icone-toogle'>
                                                <FontAwesomeIcon
                                                    style={{marginRight: "0", color: 'black'}}
                                                    icon={clickBtnFaq[index] ? faChevronUp : faChevronDown}
                                                />
                                            </span>
                                        </button>
                                    </div>
                                </div>

                            </h2>
                        </div>

                        <div id={`collapse${index}`} className="collapse" aria-labelledby="headingOne" data-parent="#accordionFaq">
                            <div className="card-body">
                                {faq.resposta}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};