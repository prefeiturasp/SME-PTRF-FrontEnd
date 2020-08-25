import React, {useEffect, useState, Fragment} from "react";
import {getFaqCategorias, getFaqPorCategoria} from "../../../../services/dres/ApoioDiretoria.service";
import '../apoio-diretoria.scss'

export const Faq = ()=>{

    const [faqCategorias, setFaqCategorias] = useState([]);
    const [faqsPorCategoria, setFaqsPorCategoria] = useState([]);
    const [clickBtnEscolheCategoria, setClickBtnEscolheCategoria] = useState(false);

    useEffect(()=>{
        getCategorias();
    }, []);

    const getCategorias = async ()=>{
        let categorias = await getFaqCategorias();
        console.log("Categorias ", categorias);
        setFaqCategorias(categorias);
    };

    const getFaqCategoria = async (categoria__uuid)=>{
        let faqs = await getFaqPorCategoria(categoria__uuid);
        console.log("Faqs ", faqs)
        setFaqsPorCategoria(faqs)
    };

    const toggleIcon = (id) => {
        setClickBtnEscolheCategoria({
            [id]: !clickBtnEscolheCategoria[id]
        });
    };

    return(
      <>
          <ul className="nav nav-pills mt-5 container-faq-categorias">
          {faqCategorias && faqCategorias.length > 0 && faqCategorias.map((categoria, index)=>
              <Fragment key={index}>
                  <li className="nav-item">
                      <button
                          onClick={()=>{
                            toggleIcon(index);
                              getFaqCategoria(categoria.uuid)
                        }}
                          className= {`nav-link btn-escolhe-categoria mr-3 ${clickBtnEscolheCategoria[index] ? "btn-escolhe-categoria-active" : ""}`}
                      >
                          {categoria.nome}
                      </button>
                  </li>

              </Fragment>
          )}
          </ul>
      </>
    );
};