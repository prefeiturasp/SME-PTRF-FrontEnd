import React, {memo} from "react";

const TabelaFiqueDeOlho = ({acoesTemplate}) => {
    return (
        <table className="table table-bordered tabela-textos-fique-de-olho">
            <thead>
                <tr>
                    <th scope="col">Textos do fique de olho</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>ASSOCIAÇÕES - Prestação de Contas</td>
                    <td>{acoesTemplate('associacoes')}</td>
                </tr>
                <tr className='bg-cinza'>
                    <td>DIRETORIAS -  Acompanhamento Prestação de Contas</td>
                    <td>{acoesTemplate('dres')}</td>
                </tr>
            </tbody>
        </table>
    )
};

export default memo(TabelaFiqueDeOlho)