import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutoCompleteModal from '../AutoCompleteModal';

let capturedAutoCompleteProps = {};

jest.mock('primereact/autocomplete', () => ({
    AutoComplete: ({ inputRef, value, placeholder, disabled, name, inputId, inputClassName, onChange, ...rest }) => {
        capturedAutoCompleteProps = { inputRef, value, placeholder, disabled, name, inputId, inputClassName, onChange, ...rest };
        return (
            <input
                data-testid="autocomplete-input"
                ref={inputRef}
                value={value || ''}
                placeholder={placeholder}
                disabled={disabled}
                name={name}
                id={inputId}
                className={inputClassName}
                onChange={(e) => onChange?.(e)}
                readOnly
            />
        );
    },
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ style }) => (
        <span
            data-testid="search-icon"
            data-color={style?.color}
            data-size={style?.fontSize}
        />
    ),
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faSearch: 'faSearch',
}));

const defaultProps = {
    value: '',
    name: 'testName',
    inputId: 'testInputId',
    suggestions: [],
    completeMethod: jest.fn(),
    field: 'nome',
    onChange: jest.fn(),
    onSelect: jest.fn(),
};

describe('AutoCompleteModal', () => {
    beforeEach(() => {
        capturedAutoCompleteProps = {};
        jest.clearAllMocks();
    });

    describe('Renderização básica', () => {
        it('renderiza o componente sem erros', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            expect(screen.getByTestId('autocomplete-input')).toBeInTheDocument();
        });

        it('renderiza a estrutura de layout com classes corretas', () => {
            const { container } = render(<AutoCompleteModal {...defaultProps} />);
            expect(container.querySelector('.d-flex.bd-highlight')).toBeInTheDocument();
            expect(container.querySelector('.flex-grow-1.bd-highlight')).toBeInTheDocument();
        });

        it('exibe o ícone de busca por padrão', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            expect(screen.getByTestId('search-icon')).toBeInTheDocument();
        });
    });

    describe('Prop showSearchIcon', () => {
        it('oculta o ícone de busca quando showSearchIcon=false', () => {
            render(<AutoCompleteModal {...defaultProps} showSearchIcon={false} />);
            expect(screen.queryByTestId('search-icon')).not.toBeInTheDocument();
        });

        it('exibe o ícone de busca quando showSearchIcon=true', () => {
            render(<AutoCompleteModal {...defaultProps} showSearchIcon={true} />);
            expect(screen.getByTestId('search-icon')).toBeInTheDocument();
        });
    });

    describe('Prop searchIconColor e searchIconSize', () => {
        it('passa a cor padrão ao ícone de busca', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            expect(screen.getByTestId('search-icon')).toHaveAttribute('data-color', '#42474A');
        });

        it('passa a cor personalizada ao ícone de busca', () => {
            render(<AutoCompleteModal {...defaultProps} searchIconColor="#FF0000" />);
            expect(screen.getByTestId('search-icon')).toHaveAttribute('data-color', '#FF0000');
        });

        it('passa o tamanho padrão ao ícone de busca', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            expect(screen.getByTestId('search-icon')).toHaveAttribute('data-size', '18px');
        });

        it('passa o tamanho personalizado ao ícone de busca', () => {
            render(<AutoCompleteModal {...defaultProps} searchIconSize="24px" />);
            expect(screen.getByTestId('search-icon')).toHaveAttribute('data-size', '24px');
        });
    });

    describe('Prop placeholder', () => {
        it('usa placeholder vazio por padrão', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            expect(screen.getByTestId('autocomplete-input')).toHaveAttribute('placeholder', '');
        });

        it('exibe placeholder personalizado quando não está carregando', () => {
            render(<AutoCompleteModal {...defaultProps} placeholder="Pesquisar..." />);
            expect(screen.getByTestId('autocomplete-input')).toHaveAttribute('placeholder', 'Pesquisar...');
        });

        it('exibe loadingText como placeholder quando loading=true', () => {
            render(<AutoCompleteModal {...defaultProps} loading={true} placeholder="Pesquisar..." />);
            expect(screen.getByTestId('autocomplete-input')).toHaveAttribute('placeholder', 'Carregando...');
        });

        it('exibe loadingText personalizado quando loading=true', () => {
            render(<AutoCompleteModal {...defaultProps} loading={true} loadingText="Aguarde..." />);
            expect(screen.getByTestId('autocomplete-input')).toHaveAttribute('placeholder', 'Aguarde...');
        });
    });

    describe('Prop disabled', () => {
        it('não está desabilitado por padrão', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            expect(capturedAutoCompleteProps.disabled).toBe(false);
        });

        it('está desabilitado quando disabled=true', () => {
            render(<AutoCompleteModal {...defaultProps} disabled={true} />);
            expect(capturedAutoCompleteProps.disabled).toBe(true);
        });

        it('está desabilitado quando loading=true', () => {
            render(<AutoCompleteModal {...defaultProps} loading={true} />);
            expect(capturedAutoCompleteProps.disabled).toBe(true);
        });

        it('está desabilitado quando disabled=true e loading=true', () => {
            render(<AutoCompleteModal {...defaultProps} disabled={true} loading={true} />);
            expect(capturedAutoCompleteProps.disabled).toBe(true);
        });
    });

    describe('Repasse de props ao AutoComplete', () => {
        it('repassa name ao AutoComplete', () => {
            render(<AutoCompleteModal {...defaultProps} name="meuCampo" />);
            expect(capturedAutoCompleteProps.name).toBe('meuCampo');
        });

        it('repassa inputId ao AutoComplete', () => {
            render(<AutoCompleteModal {...defaultProps} inputId="meuId" />);
            expect(capturedAutoCompleteProps.inputId).toBe('meuId');
        });

        it('repassa value ao AutoComplete', () => {
            render(<AutoCompleteModal {...defaultProps} value="texto de teste" />);
            expect(capturedAutoCompleteProps.value).toBe('texto de teste');
        });

        it('repassa suggestions ao AutoComplete', () => {
            const suggestions = [{ nome: 'Opção 1' }, { nome: 'Opção 2' }];
            render(<AutoCompleteModal {...defaultProps} suggestions={suggestions} />);
            expect(capturedAutoCompleteProps.suggestions).toEqual(suggestions);
        });

        it('repassa field ao AutoComplete', () => {
            render(<AutoCompleteModal {...defaultProps} field="descricao" />);
            expect(capturedAutoCompleteProps.field).toBe('descricao');
        });

        it('repassa inputClassName padrão ao AutoComplete', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            expect(capturedAutoCompleteProps.inputClassName).toBe('form-control');
        });

        it('repassa inputClassName personalizado ao AutoComplete', () => {
            render(<AutoCompleteModal {...defaultProps} inputClassName="minha-classe" />);
            expect(capturedAutoCompleteProps.inputClassName).toBe('minha-classe');
        });

        it('repassa completeMethod ao AutoComplete', () => {
            const completeMethod = jest.fn();
            render(<AutoCompleteModal {...defaultProps} completeMethod={completeMethod} />);
            expect(capturedAutoCompleteProps.completeMethod).toBe(completeMethod);
        });

        it('repassa onChange ao AutoComplete', () => {
            const onChange = jest.fn();
            render(<AutoCompleteModal {...defaultProps} onChange={onChange} />);
            expect(capturedAutoCompleteProps.onChange).toBe(onChange);
        });

        it('repassa onSelect ao AutoComplete', () => {
            const onSelect = jest.fn();
            render(<AutoCompleteModal {...defaultProps} onSelect={onSelect} />);
            expect(capturedAutoCompleteProps.onSelect).toBe(onSelect);
        });

        it('repassa itemTemplate ao AutoComplete', () => {
            const itemTemplate = (item) => <span>{item.nome}</span>;
            render(<AutoCompleteModal {...defaultProps} itemTemplate={itemTemplate} />);
            expect(capturedAutoCompleteProps.itemTemplate).toBe(itemTemplate);
        });

        it('repassa props extras via spread ao AutoComplete', () => {
            render(<AutoCompleteModal {...defaultProps} minLength={3} delay={300} />);
            expect(capturedAutoCompleteProps.minLength).toBe(3);
            expect(capturedAutoCompleteProps.delay).toBe(300);
        });
    });

    describe('useEffect — portal container', () => {
        const getPortalContainer = () =>
            Array.from(document.body.children).find(
                (el) => el.style.position === 'fixed' && el.style.zIndex === '99999'
            );

        it('adiciona um container fixo ao document.body ao montar', () => {
            expect(getPortalContainer()).toBeUndefined();
            render(<AutoCompleteModal {...defaultProps} />);
            expect(getPortalContainer()).toBeDefined();
        });

        it('o container adicionado tem position fixed e zIndex 99999', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            const portal = getPortalContainer();
            expect(portal.style.position).toBe('fixed');
            expect(portal.style.zIndex).toBe('99999');
            expect(portal.style.pointerEvents).toBe('auto');
        });

        it('remove o container do document.body ao desmontar', () => {
            const { unmount } = render(<AutoCompleteModal {...defaultProps} />);
            expect(getPortalContainer()).toBeDefined();
            act(() => { unmount(); });
            expect(getPortalContainer()).toBeUndefined();
        });
    });

    describe('getPanelStyle', () => {
        it('retorna panelStyle com zIndex na renderização inicial (inputRef ainda null)', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            expect(capturedAutoCompleteProps.panelStyle).toHaveProperty('zIndex', 99999);
        });

        it('retorna panelStyle com width e minWidth após re-renderização (inputRef preenchido)', () => {
            const { rerender } = render(<AutoCompleteModal {...defaultProps} />);
            // Após o mount, inputRef.current é o elemento DOM; re-renderizar executa getPanelStyle com ele
            rerender(<AutoCompleteModal {...defaultProps} value="novo valor" />);
            expect(capturedAutoCompleteProps.panelStyle).toHaveProperty('zIndex', 99999);
            expect(capturedAutoCompleteProps.panelStyle).toHaveProperty('width');
            expect(capturedAutoCompleteProps.panelStyle).toHaveProperty('minWidth');
        });
    });

    describe('Prop style', () => {
        it('repassa style padrão ao AutoComplete', () => {
            render(<AutoCompleteModal {...defaultProps} />);
            expect(capturedAutoCompleteProps.style).toEqual({ width: '100%', borderLeft: 'none' });
        });

        it('repassa style personalizado ao AutoComplete', () => {
            const customStyle = { width: '50%', borderLeft: '1px solid red' };
            render(<AutoCompleteModal {...defaultProps} style={customStyle} />);
            expect(capturedAutoCompleteProps.style).toEqual(customStyle);
        });
    });
});
