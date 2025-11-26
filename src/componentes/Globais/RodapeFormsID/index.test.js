import { render, screen } from '@testing-library/react';
import { RodapeFormsID } from '.';


describe('RodapeFormsID component', () => {
    beforeEach(() => {
        window.matchMedia = jest.fn().mockImplementation((query) => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));
    });

    test('não renderiza nada quando value é falsy', () => {
        const { container } = render(<RodapeFormsID value={null} />);
        
        // container deve estar vazio
        expect(container).toBeEmptyDOMElement();
    });

    test('renderiza o texto ID quando value é fornecido', () => {
        render(<RodapeFormsID value="12345" />);

        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
    });
    
    test('renderiza o value corretamente', () => {
        render(<RodapeFormsID value="ABC-999" />);
        
        expect(screen.getByText('ABC-999')).toBeInTheDocument();
    });

    test('renderiza o Row e Col do antd quando value existe', () => {
        const { container } = render(<RodapeFormsID value="teste" />);

        const row = container.querySelector('.ant-row');
        expect(row).toBeInTheDocument();

        const col = container.querySelector('.ant-col');
        expect(col).toBeInTheDocument();
    });

});