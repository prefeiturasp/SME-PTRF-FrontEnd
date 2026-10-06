import React from "react";
import FiqueDeOlho from "../../../Globais/FiqueDeOlho/FiqueDeOlho";
import { useGetFiqueDeOlhoMembroAssociacao } from "../hooks/useGetFiqueDeOlhoMembroAssociacao";

export const FiqueDeOlhoMembroAssociacao = () => {
    const { data: fiqueDeOlhoMembrosAssociacao } = useGetFiqueDeOlhoMembroAssociacao();

    const texto = fiqueDeOlhoMembrosAssociacao?.results?.[0]?.texto;

    return <FiqueDeOlho texto={texto} />;
};
