import React, {useEffect, useState} from "react";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import Loading from "../../../utils/Loading";
import {MenuInterno} from "../../MenuInterno";

export const DadosDasContas = () => {
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        setLoading(false)
    }, []);

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
                <div className="row">
                    <div className="col-12">
                        <MenuInterno
                            caminhos_menu_interno = {UrlsMenuInterno}
                        />
                        <h1>Dados da contas</h1>
                    </div>
                </div>
            }
        </>
    )
};