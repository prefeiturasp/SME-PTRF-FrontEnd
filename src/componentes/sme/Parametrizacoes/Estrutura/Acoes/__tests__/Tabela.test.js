import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {TabelaAcoes} from "../TabelaAcoes";
import ReactTooltip from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { mockAcoes } from "../__fixtures__/mockData";

const mockHandleEditFormModal = jest.fn();

// Mock da callback acoesTemplate
const mockAcoesTemplate = (rowData) => {
    return (
        <div>
            <button
                className="btn-editar-membro"
                onClick={() => mockHandleEditFormModal(rowData)}
            >
                <div data-tip="Editar" data-for={`tooltip-id-${rowData.uuid}`}>
                    <ReactTooltip id={`tooltip-id-${rowData.uuid}`} />
                    <FontAwesomeIcon
                        style={{ fontSize: '20px', marginRight: "0", color: "#00585E" }}
                        icon={faEdit}
                    />
                </div>
            </button>
        </div>
    );
};
const mockAceitaCapital = (rowData) => <div>{rowData.aceita_capital}</div>
const mockAceitaCusteio = (rowData) => <div>{rowData.aceita_custeio}</div>
const mockAceitaLivre = (rowData) => <div>{rowData.aceita_livre}</div>
const mockRecursosEternos = (rowData) => <div>{rowData.e_recursos_proprios}</div>
const mockconferirUnidades = () => <div>Conferir Unidades</div>

const defaultProps = {
    todasAsAcoes: mockAcoes,
    rowsPerPage: 20,
    acoesTemplate: mockAcoesTemplate,
    conferirUnidadesTemplate: mockconferirUnidades,
    aceitaCapitalTemplate: mockAceitaCapital,
    aceitaCusteioTemplate: mockAceitaCusteio,
    aceitaLivreTemplate: mockAceitaLivre,
    recursosPropriosTemplate: mockRecursosEternos
}

describe("Tabela Component", () => {

    it('deve renderizar a tabela com os dados fornecidos', () => {
        render(<TabelaAcoes {...defaultProps} />);

        // Verifica se os nomes dos membros aparecem
        mockAcoes.forEach((row, index) => {
            if (index < 20) {
                expect(screen.getByText(row.nome)).toBeInTheDocument();
            }else{
                expect(screen.queryByText(row.nome)).not.toBeInTheDocument();
            }
        });

        const tabela = screen.getByRole("grid");
        const rows = tabela.querySelectorAll("tbody tr");
        expect(rows).toHaveLength(20);
        const row = rows[0]
        const cells = row.querySelectorAll("td");
        expect(cells).toHaveLength(7); // todas as colunas da tabela
        const actionsCell = cells[6]
        expect(actionsCell).not.toBeEmptyDOMElement(); // Ações não está vazia
        const botaoEditar = actionsCell.querySelector("button");
        expect(botaoEditar).toBeInTheDocument();
        fireEvent.click(botaoEditar);
        expect(mockHandleEditFormModal).toHaveBeenCalled()
    });

});
