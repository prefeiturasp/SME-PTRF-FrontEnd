import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CabecalhoDocumento from '../CabecalhoDocumento';

describe('CabecalhoDocumento', () => {
    it('exibe o nome do tipo de documento quando presente', () => {
        render(
            <CabecalhoDocumento
                documentos={[{ tipo_documento_prestacao_conta: { nome: 'Extrato Bancário' } }]}
            />
        );

        expect(screen.getByText('Nome do documento')).toBeInTheDocument();
        expect(screen.getByText('Extrato Bancário')).toBeInTheDocument();
    });

    it('não quebra e exibe vazio quando documentos é undefined', () => {
        const { container } = render(<CabecalhoDocumento documentos={undefined} />);

        expect(screen.getByText('Nome do documento')).toBeInTheDocument();
        expect(container.querySelector('p:nth-of-type(2)')).toHaveTextContent('');
    });

    it('exibe vazio quando documentos é uma lista vazia', () => {
        const { container } = render(<CabecalhoDocumento documentos={[]} />);

        expect(container.querySelector('p:nth-of-type(2)')).toHaveTextContent('');
    });

    it('exibe vazio quando o documento não possui tipo_documento_prestacao_conta', () => {
        const { container } = render(<CabecalhoDocumento documentos={[{}]} />);

        expect(container.querySelector('p:nth-of-type(2)')).toHaveTextContent('');
    });
});
