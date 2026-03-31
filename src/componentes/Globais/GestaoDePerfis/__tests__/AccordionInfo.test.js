import { render, screen, fireEvent } from '@testing-library/react';
import { AccordionInfo } from '../AccordionInfo';

jest.mock('@fortawesome/react-fontawesome', () => ({
    // eslint-disable-next-line react/prop-types
    FontAwesomeIcon: ({ icon }) => <span data-testid="fa-icon" data-icon={icon?.iconName || ''} />,
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faChevronDown: { iconName: 'chevron-down' },
    faChevronUp: { iconName: 'chevron-up' },
}));

const GRUPOS_MOCK = [
    { nome: 'Grupo A', descricao: 'Descrição do grupo A' },
    { nome: 'Grupo B', descricao: 'Descrição do grupo B' },
];

describe('AccordionInfo', () => {
    describe('quando grupos está vazio ou ausente', () => {
        it('não renderiza nada quando grupos é undefined', () => {
            render(
                <AccordionInfo clickBtnInfo={false} setClickBtnInfo={jest.fn()} grupos={undefined} />
            );
            expect(screen.queryByText('Confira os grupos de acesso existentes')).not.toBeInTheDocument();
        });

        it('não renderiza nada quando grupos é array vazio', () => {
            render(
                <AccordionInfo clickBtnInfo={false} setClickBtnInfo={jest.fn()} grupos={[]} />
            );
            expect(screen.queryByText('Confira os grupos de acesso existentes')).not.toBeInTheDocument();
        });
    });

    describe('quando grupos possui itens', () => {
        it('renderiza o accordion com o título', () => {
            render(
                <AccordionInfo clickBtnInfo={false} setClickBtnInfo={jest.fn()} grupos={GRUPOS_MOCK} />
            );
            expect(screen.getByText('Confira os grupos de acesso existentes')).toBeInTheDocument();
        });

        it('renderiza todos os grupos com nome e descrição', () => {
            render(
                <AccordionInfo clickBtnInfo={false} setClickBtnInfo={jest.fn()} grupos={GRUPOS_MOCK} />
            );
            expect(screen.getByText(/"Grupo A"/)).toBeInTheDocument();
            expect(screen.getByText(/Descrição do grupo A/)).toBeInTheDocument();
            expect(screen.getByText(/"Grupo B"/)).toBeInTheDocument();
            expect(screen.getByText(/Descrição do grupo B/)).toBeInTheDocument();
        });

        it('exibe ícone chevron-down quando clickBtnInfo é false', () => {
            render(
                <AccordionInfo clickBtnInfo={false} setClickBtnInfo={jest.fn()} grupos={GRUPOS_MOCK} />
            );
            const icons = screen.getAllByTestId('fa-icon');
            expect(icons.some(i => i.dataset.icon === 'chevron-down')).toBe(true);
        });

        it('exibe ícone chevron-up quando clickBtnInfo é true', () => {
            render(
                <AccordionInfo clickBtnInfo={true} setClickBtnInfo={jest.fn()} grupos={GRUPOS_MOCK} />
            );
            const icons = screen.getAllByTestId('fa-icon');
            expect(icons.some(i => i.dataset.icon === 'chevron-up')).toBe(true);
        });

        it('chama setClickBtnInfo com valor invertido ao clicar no botão de texto', () => {
            const setClickBtnInfo = jest.fn();
            render(
                <AccordionInfo clickBtnInfo={false} setClickBtnInfo={setClickBtnInfo} grupos={GRUPOS_MOCK} />
            );
            fireEvent.click(screen.getByText('Confira os grupos de acesso existentes'));
            expect(setClickBtnInfo).toHaveBeenCalledWith(true);
        });

        it('chama setClickBtnInfo com valor invertido ao clicar no botão de ícone', () => {
            const setClickBtnInfo = jest.fn();
            render(
                <AccordionInfo clickBtnInfo={true} setClickBtnInfo={setClickBtnInfo} grupos={GRUPOS_MOCK} />
            );
            const iconButton = screen.getByText('Confira os grupos de acesso existentes')
                .closest('.accordion')
                .querySelector('.col-1 button');
            fireEvent.click(iconButton);
            expect(setClickBtnInfo).toHaveBeenCalledWith(false);
        });

        it('renderiza um único grupo corretamente', () => {
            render(
                <AccordionInfo
                    clickBtnInfo={false}
                    setClickBtnInfo={jest.fn()}
                    grupos={[{ nome: 'Único', descricao: 'Apenas um' }]}
                />
            );
            expect(screen.getByText(/"Único"/)).toBeInTheDocument();
            expect(screen.getByText(/Apenas um/)).toBeInTheDocument();
        });
    });
});
