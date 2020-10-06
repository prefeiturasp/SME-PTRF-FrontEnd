import React, {useEffect, useState, Fragment} from "react";
import {getFaqCategorias, getFaqPorCategoria} from "../../../../services/dres/ApoioDiretoria.service";
import '../apoio-diretoria.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../utils/Loading";

export const Faq = () => {

    const [faqCategorias, setFaqCategorias] = useState([]);
    const [faqsPorCategoria, setFaqsPorCategoria] = useState([]);
    const [clickBtnEscolheCategoria, setClickBtnEscolheCategoria] = useState({0: true});
    const [clickBtnFaq, setClickBtnFaq] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategorias();
        getPrimeiraFaqCategoria()
        setLoading(false);

    }, []);

    const getCategorias = async () => {
        setLoading(true);
        let categorias = await getFaqCategorias();
        setFaqCategorias(categorias);
        setLoading(false);
    };

    const getFaqsDeUmaCategoria = async (categoria__uuid) => {
        setLoading(true);
        let faqs = await getFaqPorCategoria(categoria__uuid);
        setFaqsPorCategoria(faqs);
        setLoading(false);
    };

    const getPrimeiraFaqCategoria = async ()=>{
        let categorias = await getFaqCategorias();
        if (categorias && categorias.length > 0){
            getFaqsDeUmaCategoria(categorias[0].uuid)
        }
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
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                    <ul className="nav nav-pills mt-4 container-faq-categorias">
                        {faqCategorias && faqCategorias.length > 0 && faqCategorias.map((categoria, index) =>
                            <Fragment key={index}>
                                <li className="nav-item">
                                    <button
                                        onClick={() => {
                                            toggleBtnEscolheCategoria(index);
                                            getFaqsDeUmaCategoria(categoria.uuid)
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
                        {faqsPorCategoria && faqsPorCategoria.length > 0 && faqsPorCategoria.map((faq, index) =>
                            <div className="card" key={index}>
                                <div className="card-header" id="headingOne">
                                    <h2 className="mb-0">
                                        <div className="row">
                                            <div className="col-11">
                                                <button onClick={() => toggleBtnFaq(index)}
                                                        className="btn btn-link btn-block text-left btn-container-pergunta pl-0"
                                                        type="button" data-toggle="collapse"
                                                        data-target={`#collapse${index}`} aria-expanded="true"
                                                        aria-controls={`collapse${index}`}>
                                                    {faq.pergunta}
                                                </button>
                                            </div>
                                            <div className="col-1">
                                                <button onClick={() => toggleBtnFaq(index)}
                                                        className="btn btn-link btn-block text-left" type="button"
                                                        data-toggle="collapse" data-target={`#collapse${index}`}
                                                        aria-expanded="true" aria-controls={`collapse${index}`}>
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
            }
        </>
    );
};