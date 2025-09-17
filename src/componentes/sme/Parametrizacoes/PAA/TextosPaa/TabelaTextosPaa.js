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
                    <td>{acoesTemplate('texto_pagina_paa_ue')}</td>
                </tr>
                <tr>
                    <td>Introdução da aba Relatórios</td>
                    <td>
                        <div className="d-flex flex-column">
                            <div className="mb-2">
                                <small className="text-muted">Introdução 1:</small>
                                {acoesTemplate('introducao_do_paa_ue_1')}
                            </div>
                            <div>
                                <small className="text-muted">Introdução 2:</small>
                                {acoesTemplate('introducao_do_paa_ue_2')}
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Conclusão da aba Relatórios</td>
                    <td>
                        <div className="d-flex flex-column">
                            <div className="mb-2">
                                <small className="text-muted">Conclusão 1:</small>
                                {acoesTemplate('conclusao_do_paa_ue_1')}
                            </div>
                            <div>
                                <small className="text-muted">Conclusão 2:</small>
                                {acoesTemplate('conclusao_do_paa_ue_2')}
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
};

export default memo(TabelaTextosPaa)