// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { BtnAdd } from './../BtnAdd';

// // Mock da função RetornaSeTemPermissaoEdicaoPainelParametrizacoes
// jest.mock('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
//     RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
// }));

// // Mock do FontAwesomeIcon
// const FontAwesomeIconMock = ({ icon, style }) => (
//     <span data-testid="font-awesome-icon" style={style}>
//         {icon}
//     </span>
// );

// describe('Componente BtnAdd', () => {
//     const { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } = require('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes');

//     const mockSetShowModalForm = jest.fn();
//     const mockSetStateFormModal = jest.fn();
//     const initialStateFormModal = { mockField: 'test' };

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('renderiza o botão e simula o click quando usuário tem permissão', () => {
//         RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
//             render(
//                 <BtnAdd
//                     FontAwesomeIcon={FontAwesomeIconMock}
//                     faPlus="plus-icon"
//                     setShowModalForm={mockSetShowModalForm}
//                     initialStateFormModal={initialStateFormModal}
//                     setStateFormModal={mockSetStateFormModal}
//                 />
//             );
//         const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
//         expect(button).toBeInTheDocument();
//         expect(button).toBeEnabled();

//         fireEvent.click(button);
//         expect(mockSetStateFormModal).toHaveBeenCalledWith(initialStateFormModal);
//         expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
//     });

//     it('renderiza o botão desabilitado quando usuário não tem permissão', () => {
//         RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

//         render(
//             <BtnAdd
//                 FontAwesomeIcon={FontAwesomeIconMock}
//                 faPlus="plus-icon"
//                 setShowModalForm={mockSetShowModalForm}
//                 initialStateFormModal={initialStateFormModal}
//                 setStateFormModal={mockSetStateFormModal}
//             />
//         );

//         const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
//         expect(button).toBeInTheDocument();
//         expect(button).toBeDisabled();

//         fireEvent.click(button);
//         expect(mockSetStateFormModal).not.toHaveBeenCalled();
//         expect(mockSetShowModalForm).not.toHaveBeenCalled();
//     });

// });

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BtnAdd } from '../BtnAdd';

jest.mock('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes = require('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes').RetornaSeTemPermissaoEdicaoPainelParametrizacoes;

describe('Componente BtnAdd', () => {
  it('deve renderizar o botão com o texto e ícone corretamente', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    const mockSetShowModalForm = jest.fn();
    const mockSetStateFormModal = jest.fn();

    render(
      <BtnAdd
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={mockSetShowModalForm}
        initialStateFormModal={{}}
        setStateFormModal={mockSetStateFormModal}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('faPlusMock')).toBeInTheDocument();
  });

  it('deve habilitar o botão quando houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BtnAdd
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={() => {}}
        initialStateFormModal={{}}
        setStateFormModal={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
    expect(button).not.toBeDisabled();
  });

  it('deve desabilitar o botão quando não houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <BtnAdd
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={() => {}}
        initialStateFormModal={{}}
        setStateFormModal={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
    expect(button).toBeDisabled();
  });

  it('deve chamar as funções de callback ao clicar no botão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    const mockSetShowModalForm = jest.fn();
    const mockSetStateFormModal = jest.fn();
    const mockInitialStateFormModal = { example: 'value' };

    render(
      <BtnAdd
        FontAwesomeIcon={({ icon }) => <span>{icon}</span>}
        faPlus="faPlusMock"
        setShowModalForm={mockSetShowModalForm}
        initialStateFormModal={mockInitialStateFormModal}
        setStateFormModal={mockSetStateFormModal}
      />
    );

    const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
    fireEvent.click(button);

    expect(mockSetStateFormModal).toHaveBeenCalledWith(mockInitialStateFormModal);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });
});
