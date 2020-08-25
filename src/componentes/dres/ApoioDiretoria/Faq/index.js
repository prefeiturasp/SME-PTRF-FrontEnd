import React, {useEffect, useState} from "react";
import {getFaqCategorias} from "../../../../services/dres/ApoioDiretoria.service";

export const Faq = ()=>{

    const [faqCategorias, setFaqCategorias] = useState([]);

    const getCategorias = async ()=>{
        let categorias = await getFaqCategorias();
        console.log("Categorias ", categorias);
        setFaqCategorias(categorias);
    };

    useEffect(()=>{
        getCategorias();
    }, []);

    return(
      <>
          <h1>Componente Faq Dre</h1>
      </>
    );
};