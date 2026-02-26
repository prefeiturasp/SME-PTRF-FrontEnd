import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModalConfirmaPararAtualizacaoSaldo from '../ModalConfirmarPararAtualizacaoSaldo';
import { useAtivarSaldoPAA, useDesativarSaldoPAA } from '../hooks/usePararAtualizacaoSaldoPaa';
import { postAtivarAtualizacaoSaldoPAA } from '../../../../../../../services/escolas/Paa.service';

jest.mock('../hooks/usePararAtualizacaoSaldoPaa', () => ({
  useAtivarSaldoPAA: jest.fn(),
  useDesativarSaldoPAA: jest.fn(),
}));

jest.mock("../../../../../../../services/escolas/Paa.service", () => ({
  postDesativarAtualizacaoSaldoPAA: jest.fn(),
  postAtivarAtualizacaoSaldoPAA: jest.fn(),
}));

const mockMutateAtivar = jest.fn();
const mockMutateDesativar = jest.fn();

const propsMock = {
    open: true,
    onClose: jest.fn(),
    check: true,
    paa: { uuid: '1234' },
    onSubmitParadaSaldo: jest.fn(),
}

let onSuccessCallback;
let onErrorCallback;

const propsMockCheckTrue = {
    ...propsMock,
    check: true,
}
const propsMockCheckFalse = {
    ...propsMock,
    check: false,
}

const paaMock = { uuid: '123' };

const renderComponent = (props) => {
  return render(
    <ModalConfirmaPararAtualizacaoSaldo {...props}/>
  );
};

describe('ModalConfirmaPararAtualizacaoSaldo', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
            })),
        });

        useAtivarSaldoPAA.mockReturnValue({
            mutationPost: {
                mutate: mockMutateAtivar,
                isLoading: false
            }
        });
        useDesativarSaldoPAA.mockReturnValue({
            mutationPost: {
                mutate: mockMutateDesativar,
                isLoading: false
            }
        });
    });

  it('deve renderizar corretamente com `check=true`', () => {
    renderComponent(propsMockCheckTrue);

    expect(screen.getByText(/Parar atualização do saldo/i)).toBeInTheDocument();
    expect(screen.getByText(/bloqueado na data e hora atual/i)).toBeInTheDocument();
  });

  it('deve renderizar corretamente com `check=false`', () => {
    renderComponent(propsMockCheckFalse);

    expect(screen.getByText(/Desbloquear atualização do saldo/i)).toBeInTheDocument();
    expect(screen.getByText(/desbloqueado e atualizado/i)).toBeInTheDocument();
  });

  it('deve chamar `mutate` de desativar quando `check=true` e confirmar', () => {
    renderComponent(propsMockCheckTrue);

    const btnConfirmar = screen.getByTestId('botao-confirmar-congelamento');
    fireEvent.click(btnConfirmar);

    expect(mockMutateDesativar).toHaveBeenCalledWith({ uuid: '1234' });
    expect(mockMutateAtivar).not.toHaveBeenCalled();
  });

  it('deve chamar `mutate` de ativar quando `check=false` e confirmar, onSuccess', () => {
    useAtivarSaldoPAA.mockImplementation((onSuccess, onError) => {
        onSuccessCallback = onSuccess;
        onErrorCallback = onError;
        return {
            mutationPost: {
                mutate: mockMutateAtivar,
                isLoading: false
            }
        };
    })
    renderComponent(propsMockCheckFalse);

    const btnConfirmar = screen.getByTestId('botao-confirmar-congelamento');
    fireEvent.click(btnConfirmar);

    expect(mockMutateAtivar).toHaveBeenCalledWith({ uuid: '1234' });
    expect(mockMutateDesativar).not.toHaveBeenCalled();
    
    onSuccessCallback()

    expect(propsMockCheckFalse.onSubmitParadaSaldo).toHaveBeenCalled();
    expect(propsMockCheckFalse.onClose).toHaveBeenCalled();

    // expect(onSuccessCallback).toHaveBeenCalled();
    // expect(onErrorCallback)

  });

  it('deve chamar `mutate` de ativar quando `check=false` e confirmar, onError', () => {
    postAtivarAtualizacaoSaldoPAA.mockRejectedValueOnce({});

    useAtivarSaldoPAA.mockImplementation((onSuccess, onError) => {
        onSuccessCallback = onSuccess;
        onErrorCallback = onError;
        return {
            mutationPost: {
                mutate: mockMutateAtivar,
                isLoading: false
            }
        };
    })
    renderComponent(propsMockCheckFalse);

    const btnConfirmar = screen.getByTestId('botao-confirmar-congelamento');
    fireEvent.click(btnConfirmar);

    expect(mockMutateAtivar).toHaveBeenCalledWith({ uuid: '1234' });
    expect(mockMutateDesativar).not.toHaveBeenCalled();
    
    onErrorCallback()

    expect(propsMockCheckFalse.onSubmitParadaSaldo).not.toHaveBeenCalled();
    expect(propsMockCheckFalse.onClose).toHaveBeenCalled();

  });

  it('deve chamar `onClose` ao clicar em cancelar', () => {
    renderComponent(propsMockCheckTrue);

    const btnCancelar = screen.getByTestId('botao-cancelar-confirmar-congelamento');
    fireEvent.click(btnCancelar);

    expect(propsMockCheckTrue.onClose).toHaveBeenCalled();
  });

  it('desabilita botões quando `isPending=true`', () => {
    useAtivarSaldoPAA.mockReturnValue({
      mutationPost: {
        mutate: mockMutateAtivar,
        isPending: true
      }
    });
    useDesativarSaldoPAA.mockReturnValue({
      mutationPost: {
        mutate: mockMutateDesativar,
        isPending: false
      }
    });

    renderComponent(propsMockCheckTrue);

    expect(screen.getByTestId('botao-confirmar-congelamento')).toBeDisabled();
    expect(screen.getByTestId('botao-cancelar-confirmar-congelamento')).toBeDisabled();
  });

});
