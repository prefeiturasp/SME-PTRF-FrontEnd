import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabelaAcoesDasAssociacoes as Tabela } from "../TabelaAcoesDasAssociacoes";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
 import { mockAcoes } from "../__fixtures__/mockData";

// Mock da função handleEditFormModal
const mockHandleEditFormModal = jest.fn();

// Mock da callback acoesTemplate
const mockAcoesTemplate = (rowData) => {
    return (
        <div>
            <button onClick={() => mockHandleEditFormModal(rowData)}>
                <div data-tooltip-content="Editar" data-tooltip-id={`tooltip-id-${rowData.uuid}`}>
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

describe("Tabela Componente", () => {

    it('deve renderizar a tabela com os dados fornecidos', () => {
        render(<Tabela rowsPerPage={20} todasAsAcoes={mockAcoes} acoesTemplate={mockAcoesTemplate} 
            firstPage={1}
        />);

        const tabela = screen.getByRole("table");
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
