import React, {memo} from "react";
import {useLocation} from 'react-router-dom'
import {BotoesTopo} from "./BotoesTopo";
import {PaginasContainer} from "../../../paginas/PaginasContainer";

const ArquivosDeCarga = ({tipo_de_carga}) => {
    let location = useLocation();
    console.log('ArquivosDeCarga ', location)

    return (
        <PaginasContainer>
            <>
                <div className="page-content-inner">
                    <BotoesTopo/>
                </div>
            </>
        </PaginasContainer>
    );
};

export default memo(ArquivosDeCarga)

