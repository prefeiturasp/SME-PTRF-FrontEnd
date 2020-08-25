import React, {useEffect, useState, Fragment} from "react";
import {getFaqCategorias} from "../../../../services/dres/ApoioDiretoria.service";
import '../apoio-diretoria.scss'

export const Faq = ()=>{

    const [faqCategorias, setFaqCategorias] = useState([]);
    const [clickBtnEscolheCategoria, setClickBtnEscolheCategoria] = useState(false);

    useEffect(()=>{
        getCategorias();
    }, []);

    const getCategorias = async ()=>{
        let categorias = await getFaqCategorias();
        console.log("Categorias ", categorias);
        setFaqCategorias(categorias);
    };

    const getFaqCategoria = async ()=>{
        
    }

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
                          toggleIcon(index)
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