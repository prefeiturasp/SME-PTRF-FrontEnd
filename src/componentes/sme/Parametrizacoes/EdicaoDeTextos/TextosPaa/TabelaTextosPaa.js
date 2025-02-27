import React, {memo} from "react";

const TabelaTextosPaa = ({acoesTemplate}) => {
    return (
        <table className="table table-bordered tabela-textos-fique-de-olho">
            <thead>
                <tr>
                    <th scope="col">Textos do PAA</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Explicação sobre o PAA</td>
                    <td>{acoesTemplate('explicacao_sobre_paa')}</td>
                </tr>
            </tbody>
        </table>
    )
};

export default memo(TabelaTextosPaa)