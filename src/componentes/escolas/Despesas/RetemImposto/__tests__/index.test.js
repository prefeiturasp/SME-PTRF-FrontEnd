import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RetemImposto } from "../index";

describe("RetemImposto", () => {
    let mockFormikProps;
    let mockMostraModalExcluirImposto;

    beforeEach(() => {
        mockFormikProps = {
            handleChange: jest.fn(),
            handleBlur: jest.fn(),
            setFieldValue: jest.fn(),
            values: {
                retem_imposto: false
            }
        };
        mockMostraModalExcluirImposto = jest.fn();
    });

    const renderComponent = (props = {}) => {
        return render(
            <RetemImposto
                formikProps={mockFormikProps}
                eh_despesa_com_retencao_imposto={(values) => values.retem_imposto}
                disabled={false}
                mostraModalExcluirImposto={mockMostraModalExcluirImposto}
                {...props}
            />
        );
    };

    it("renderiza o componente com a pergunta", () => {
        renderComponent();
        expect(screen.getByText("Este serviço teve/terá retenção de imposto por parte da Associação?")).toBeInTheDocument();
    });

    it("seleciona 'Sim' para retenção de imposto", () => {
        renderComponent();
        const radioSim = screen.getByLabelText("Sim");
        fireEvent.click(radioSim);
        
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("retem_imposto", true);
    });

    it("seleciona 'Não' para retenção de imposto e abre modal", () => {
        mockFormikProps.values.retem_imposto = true;
        renderComponent();
        const radioNao = screen.getByLabelText("Não");
        fireEvent.click(radioNao);
        
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("retem_imposto", false);
        expect(mockMostraModalExcluirImposto).toHaveBeenCalled();
    });

    it("respeita a prop disabled nos radio buttons", () => {
        renderComponent({ disabled: true });
        
        const radios = screen.getAllByRole("radio");
        radios.forEach(radio => {
            expect(radio).toBeDisabled();
        });
    });
});
