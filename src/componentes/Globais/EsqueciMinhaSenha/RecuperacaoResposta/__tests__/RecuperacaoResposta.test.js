import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecuperacaoResposta } from '../index';
import { RespostaSucesso } from '../respostaSucesso';
import { RespostaErro } from '../respostaErro';

jest.mock('../../../../../utils/Loading', () => () => (
    <div data-testid="loading">Carregando...</div>
));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon }) => <span data-testid={`icon-${icon.iconName}`} />,
}));

beforeEach(() => {
    delete window.location;
    window.location = { assign: jest.fn() };
});

// =============================================================================
// RecuperacaoResposta (index.js)
// =============================================================================

describe('RecuperacaoResposta', () => {
    it('renderiza o título "Recuperação de Senha"', () => {
        render(<RecuperacaoResposta recuperacaoResposta={null} emailComMascara="" respostaDeErro="" />);
        expect(screen.getByText('Recuperação de Senha')).toBeInTheDocument();
    });

    it('exibe RespostaSucesso quando recuperacaoResposta tem conteúdo', () => {
        render(
            <RecuperacaoResposta
                recuperacaoResposta={{ detail: 'ok' }}
                emailComMascara="te***@email.com"
                respostaDeErro=""
            />
        );
        expect(screen.getByText(/te\*\*\*@email\.com/)).toBeInTheDocument();
        expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
    });

    it('exibe RespostaErro quando recuperacaoResposta é null', () => {
        render(
            <RecuperacaoResposta
                recuperacaoResposta={null}
                emailComMascara=""
                respostaDeErro="Usuário não encontrado"
            />
        );
        expect(screen.getByText('Usuário não encontrado')).toBeInTheDocument();
    });

    it('exibe RespostaErro quando recuperacaoResposta é objeto vazio', () => {
        render(
            <RecuperacaoResposta
                recuperacaoResposta={{}}
                emailComMascara=""
                respostaDeErro="Algum erro"
            />
        );
        expect(screen.getByText('Algum erro')).toBeInTheDocument();
    });

    it('exibe RespostaErro quando recuperacaoResposta é undefined', () => {
        render(
            <RecuperacaoResposta
                recuperacaoResposta={undefined}
                emailComMascara=""
                respostaDeErro=""
            />
        );
        // Sem recuperacaoResposta, cai no RespostaErro — verifica mensagem padrão
        expect(screen.getByText(/erro ocorreu/i)).toBeInTheDocument();
    });
});

// =============================================================================
// RespostaSucesso
// =============================================================================

describe('RespostaSucesso', () => {
    it('renderiza o email com máscara', () => {
        render(<RespostaSucesso emailComMascara="te***@email.com" />);
        expect(screen.getByText(/te\*\*\*@email\.com/)).toBeInTheDocument();
    });

    it('renderiza a mensagem de instrução', () => {
        render(<RespostaSucesso emailComMascara="te***@email.com" />);
        expect(screen.getByText(/Seu link de recuperação de senha foi enviado para/i)).toBeInTheDocument();
    });

    it('renderiza a mensagem "Verifique sua caixa de entrada!"', () => {
        render(<RespostaSucesso emailComMascara="te***@email.com" />);
        expect(screen.getByText('Verifique sua caixa de entrada!')).toBeInTheDocument();
    });

    it('renderiza o botão Continuar habilitado', () => {
        render(<RespostaSucesso emailComMascara="te***@email.com" />);
        expect(screen.getByRole('button', { name: 'Continuar' })).not.toBeDisabled();
    });

    it('renderiza o ícone de check', () => {
        render(<RespostaSucesso emailComMascara="te***@email.com" />);
        expect(screen.getByTestId('icon-circle-check')).toBeInTheDocument();
    });

    it('não exibe loading inicialmente', () => {
        render(<RespostaSucesso emailComMascara="te***@email.com" />);
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    it('ao clicar em Continuar navega para /login', () => {
        render(<RespostaSucesso emailComMascara="te***@email.com" />);
        fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
        expect(window.location.assign).toHaveBeenCalledWith('/login');
    });

    it('ao clicar em Continuar exibe loading', () => {
        render(<RespostaSucesso emailComMascara="te***@email.com" />);
        fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('ao clicar em Continuar o botão fica desabilitado e some (loading substitui o conteúdo)', () => {
        render(<RespostaSucesso emailComMascara="te***@email.com" />);
        fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
        // Quando loading=true, o botão deixa de ser renderizado
        expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument();
    });
});

// =============================================================================
// RespostaErro
// =============================================================================

describe('RespostaErro', () => {
    it('renderiza a mensagem padrão quando respostaDeErro é undefined', () => {
        render(<RespostaErro respostaDeErro={undefined} />);
        expect(screen.getByText(/Não encontramos o usuário solicitado, tente novamente/i)).toBeInTheDocument();
    });

    it('renderiza a mensagem padrão quando respostaDeErro é "Não encontrado."', () => {
        render(<RespostaErro respostaDeErro="Não encontrado." />);
        expect(screen.getByText(/Não encontramos o usuário solicitado, tente novamente/i)).toBeInTheDocument();
    });

    it('renderiza a mensagem padrão quando respostaDeErro é null', () => {
        render(<RespostaErro respostaDeErro={null} />);
        expect(screen.getByText(/Não encontramos o usuário solicitado, tente novamente/i)).toBeInTheDocument();
    });

    it('renderiza a mensagem personalizada quando respostaDeErro tem outro valor', () => {
        render(<RespostaErro respostaDeErro="Email bloqueado pelo administrador." />);
        expect(screen.getByText('Email bloqueado pelo administrador.')).toBeInTheDocument();
    });

    it('não renderiza a mensagem padrão quando há mensagem personalizada', () => {
        render(<RespostaErro respostaDeErro="Outro erro" />);
        expect(screen.queryByText(/Não encontramos o usuário solicitado/i)).not.toBeInTheDocument();
    });

    it('renderiza o botão Continuar habilitado', () => {
        render(<RespostaErro respostaDeErro="" />);
        expect(screen.getByRole('button', { name: 'Continuar' })).not.toBeDisabled();
    });

    it('renderiza o ícone de erro', () => {
        render(<RespostaErro respostaDeErro="" />);
        expect(screen.getByTestId('icon-circle-xmark')).toBeInTheDocument();
    });

    it('não exibe loading inicialmente', () => {
        render(<RespostaErro respostaDeErro="" />);
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    it('ao clicar em Continuar navega para /esqueci-minha-senha/', () => {
        render(<RespostaErro respostaDeErro="" />);
        fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
        expect(window.location.assign).toHaveBeenCalledWith('/esqueci-minha-senha/');
    });

    it('ao clicar em Continuar exibe loading', () => {
        render(<RespostaErro respostaDeErro="" />);
        fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('ao clicar em Continuar o botão some (loading substitui o conteúdo)', () => {
        render(<RespostaErro respostaDeErro="" />);
        fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
        expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument();
    });
});
