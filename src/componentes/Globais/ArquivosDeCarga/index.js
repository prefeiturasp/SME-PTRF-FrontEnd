import React, {memo, useCallback, useEffect, useState} from "react";
import {Redirect, useParams} from 'react-router-dom'
import {BotoesTopo} from "./BotoesTopo";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {getTabelaArquivos, getArquivosFiltros} from "../../../services/sme/Parametrizacoes.service";

const ArquivosDeCarga = () => {
    const url_params = useParams();
    console.log('ArquivosDeCarga useParams ', url_params);

    const [tabelaArquivos, setTabelaArquivos] = useState([]);
    const [arquivos, setArquivos] = useState([]);

    const carregaTabelaArquivos = useCallback(async ()=>{
        let tabela = await getTabelaArquivos();
        setTabelaArquivos(tabela)
    }, []);

    useEffect(()=>{
        carregaTabelaArquivos();
    }, [carregaTabelaArquivos]);

    const carregaArquivosPeloTipoDeCarga = useCallback(async ()=>{
        try {
            let arquivos = await getArquivosFiltros(url_params.tipo_de_carga);
            console.log("Arquivos ", arquivos);
            setArquivos(arquivos)
        }catch (e) {
            console.log("Erro ao carregar arquivos")
        }
    }, [url_params]);

    useEffect(()=>{
        carregaArquivosPeloTipoDeCarga()
    }, [carregaArquivosPeloTipoDeCarga]);

    return (
        <PaginasContainer>
            <>
                {url_params.tipo_de_carga !== 'CARGA_ASSOCIACOES' ? (
                        <Redirect
                            to={{
                                pathname: '/painel-parametrizacoes',
                            }}
                        />
                ) :
                    <div className="page-content-inner">
                        <BotoesTopo/>
                    </div>
                }

            </>
        </PaginasContainer>
    );
};

export default memo(ArquivosDeCarga)

