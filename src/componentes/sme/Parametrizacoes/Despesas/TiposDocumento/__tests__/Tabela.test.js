import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tabela from "../Tabela";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { mockData } from "../__fixtures__/mockData";
import fs from 'fs';
import path from 'path';

// Mock da função handleEditFormModal
const mockHandleEditFormModal = jest.fn();

// Mock da callback acoesTemplate
const mockAcoesTemplate = (rowData) => {
    return (
        <div>
            <button
                className="btn-editar-membro"
                onClick={() => mockHandleEditFormModal(rowData)}
            >
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

describe("Tabela Component", () => {

    it('deve renderizar a tabela com os dados fornecidos', () => {
        render(<Tabela rowsPerPage={20} lista={mockData} acoesTemplate={mockAcoesTemplate} />);

        // Verifica se os nomes dos membros aparecem
        mockData.forEach((row, index) => {
            if (index < 20) {
                expect(screen.getByText(row.nome)).toBeInTheDocument();
            }else{
                expect(screen.queryByText(row.nome)).not.toBeInTheDocument();
            }
        });

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

    it('deve aplicar o background #F4F4F4 no elemento com p-highlight', () => {
        render(<Tabela rowsPerPage={20} lista={mockData} acoesTemplate={mockAcoesTemplate} />);

        const columnHeader = screen.getByRole('columnheader', { name: /nome/i });

        expect(columnHeader).toHaveClass('field-name-tipo-documento');
    });

    it('deve definir o background da coluna Nome como #F4F4F4', () => {
        const caminhoScss = path.resolve(
            process.cwd(),
            'src/componentes/sme/Parametrizacoes/Despesas/TiposDocumento/scss/Table.scss'
        );

        const scss = fs.readFileSync(caminhoScss, 'utf8');

        const seletorColunaNome =
            '#main .p-datatable .p-datatable-thead > tr > th.field-name-tipo-documento.p-highlight';

        const inicioRegra = scss.indexOf(seletorColunaNome);

        expect(inicioRegra).toBeGreaterThanOrEqual(0);

        const fimRegra = scss.indexOf('}', inicioRegra);
        const regraCss = scss.slice(inicioRegra, fimRegra + 1);

        expect(regraCss).toContain(
            'background-color: #F4F4F4 !important;'
        );
    });
});
