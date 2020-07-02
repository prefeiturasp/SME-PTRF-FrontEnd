import React, {useEffect, useState} from "react";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import Loading from "../../../utils/Loading";
import {MenuInterno} from "../../MenuInterno";
import {getContas} from "../../../services/Associacao.service";
import {FormDadosDasContas} from "./FormDadosDasContas";

export const DadosDasContas = () => {

    const initial = [{
        tipo_conta: "",
        banco_nome: "",
        agencia: "",
        conta_associacao: "",
        numero_conta: "",
    }];


    const [loading, setLoading] = useState(true);
    const [intialValues, setIntialValues] = useState(initial);

    useEffect(() =>{
        const buscaContas = async ()=>{
            let contas = await getContas();
            setIntialValues(contas)
        };
        buscaContas();
    }, []);

    useEffect(()=>{
        setLoading(false)
    }, []);

    const setaCampoReadonly=(nome_conta) =>{
        return nome_conta === "Cartão"
    };

    const onSubmit = async (values) => {
        console.log("onSubmit ", values)
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
                <div className="row">
                    <div className="col-12">
                        <MenuInterno
                            caminhos_menu_interno = {UrlsMenuInterno}
                        />
                        <FormDadosDasContas
                            intialValues={intialValues}
                            onSubmit={onSubmit}
                            setaCampoReadonly={setaCampoReadonly}
                        />

                    </div>
                </div>
            }
        </>
    )
};