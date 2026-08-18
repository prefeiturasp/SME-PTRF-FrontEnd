import { Title } from "../FormualarioAssociacao/Title";
import { useAssociacoesFormularioContext } from "../hooks/useAssociacoesFormularioContext";
import { render, screen } from "@testing-library/react";

jest.mock("../hooks/useAssociacoesFormularioContext", () => ({
    useAssociacoesFormularioContext: jest.fn(),
}));

describe('Formulario Title', () => {
    it('should render "Adicionar Associação" when uuid is not present', () => {
        useAssociacoesFormularioContext.mockReturnValue({ uuid: null });

        render(<Title />);

        expect(screen.getByRole('heading', { name: 'Adicionar Associação' })).toBeInTheDocument();
    });

    it('should render "Editar Associação" when uuid is present', () => {
        useAssociacoesFormularioContext.mockReturnValue({ uuid: '12345' });

        render(<Title />);

        expect(screen.getByRole('heading', { name: 'Editar Associação' })).toBeInTheDocument();
    });
});
