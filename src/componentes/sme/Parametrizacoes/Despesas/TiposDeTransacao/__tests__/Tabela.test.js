import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tabela from "../Tabela";
import ReactTooltip from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { mockData } from "../__fixtures__/mockData";

// Mock da função handleEditFormModal
const mockHandleEditFormModal = jest.fn();

// Mock da callback acoesTemplate
const mockAcoesTemplate = (rowData) => {
    return (
        <div>
            <button
                className="btn-editar"
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

describe("Tabela Component", () => {

    it('Deve renderizar a tabela com os dados fornecidos', () => {
        render(<Tabela rowsPerPage={20} lista={mockData} acoesTemplate={mockAcoesTemplate} />);

        mockData.forEach((row, index) => {
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
        expect(cells).toHaveLength(3);
        const actionsCell = cells[2]
        expect(actionsCell).not.toBeEmptyDOMElement();
        const botaoEditar = actionsCell.querySelector("button");
        expect(botaoEditar).toBeInTheDocument();
        fireEvent.click(botaoEditar);
        expect(mockHandleEditFormModal).toHaveBeenCalled()
    });

});
