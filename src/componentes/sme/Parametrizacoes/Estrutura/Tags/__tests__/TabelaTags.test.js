import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TabelaTags from "../TabelaTags";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { mockData } from "../__fixtures__/mockData";

const mockHandleEditFormModal = jest.fn();

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

describe("TabelaTags Component", () => {
    it("Deve renderizar a tabela com os dados fornecidos", () => {
        render(
            <TabelaTags 
                rowsPerPage={20} 
                listaDeTags={mockData} 
                acoesTemplate={mockAcoesTemplate} 
            />
        );

        mockData.forEach((row, index) => {
            if (index < 20) {
                expect(screen.getByText(row.nome)).toBeInTheDocument();
            } else {
                expect(screen.queryByText(row.nome)).not.toBeInTheDocument();
            }
        });

        const tabela = screen.getByRole("grid");
        expect(tabela).toBeInTheDocument();

        const rows = screen.getAllByRole("row");
        expect(rows.length).toBeGreaterThanOrEqual(4);

        const actionButtons = screen.getAllByRole("button");
        expect(actionButtons.length).toBeGreaterThan(0);

        fireEvent.click(actionButtons[0]);
        expect(mockHandleEditFormModal).toHaveBeenCalled();
    });
});
