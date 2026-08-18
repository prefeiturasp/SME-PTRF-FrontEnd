import React, {useState, useEffect} from "react";
import {
    getFiqueDeOlhoPrestacoesDeContas,
} from "../../../services/escolas/PrestacaoDeContas.service";
import { useRecursoSelecionadoContext } from "../../../context/RecursoSelecionado";
import { TEXTOS_FIQUE_DE_OLHO } from "../../../constantes/textosFiqueDeOlho";

export const InformacoesIniciais = () => {
    const [fique_de_olho, setFiqueDeOlho] = useState("");
    const { recursoSelecionado } = useRecursoSelecionadoContext();

    useEffect(() => {
        buscaFiqueDeOlho();
    }, []);

    const buscaFiqueDeOlho = async () => {
        let fiqueDeOlho = await getFiqueDeOlhoPrestacoesDeContas(
            TEXTOS_FIQUE_DE_OLHO.UE_PRESTACAO_CONTAS,
            recursoSelecionado?.uuid
        )
        if (fiqueDeOlho?.results?.length > 0) {
            setFiqueDeOlho(fiqueDeOlho.results[0].texto);
        }
    };

    return (
        fique_de_olho?.trim() && (
            <div className="col-12 container-texto-introdutorio mb-4">
                <div dangerouslySetInnerHTML={{ __html: fique_de_olho }} />
            </div>
        )
    )
};