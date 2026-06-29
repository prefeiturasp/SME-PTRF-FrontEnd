import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

let capturedProps = null;

jest.mock('../../../../../Globais/ModalBootstrap', () => ({
  ModalBootstrap: (props) => {
    capturedProps = props;
    return (
      <div data-testid="modal-bootstrap">
        <span data-testid="titulo">{props.titulo}</span>
        <span data-testid="body-text">{props.bodyText}</span>
        <button data-testid="btn-cancelar" onClick={props.primeiroBotaoOnclick}>
          {props.primeiroBotaoTexto}
        </button>
        <button data-testid="btn-excluir" onClick={props.segundoBotaoOnclick}>
          {props.segundoBotaoTexto}
        </button>
      </div>
    );
  },
}));

/* eslint-disable-next-line import/first */
import { ConfirmaDeleteProcesso } from '../ConfirmaDeleteProcessoDialog';

describe('ConfirmaDeleteProcesso Testes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedProps = null;
  });

  test('1. Renderiza sem erros', () => {
    const { container } = render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={jest.fn()}
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
      />
    );

    expect(container).toBeDefined();
    expect(screen.getByTestId('modal-bootstrap')).toBeInTheDocument();
  });

  test('2. Repassa prop show para o ModalBootstrap', () => {
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={jest.fn()}
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
      />
    );

    expect(capturedProps.show).toBe(true);
  });

  test('3. Repassa show=false para o ModalBootstrap', () => {
    render(
      <ConfirmaDeleteProcesso
        show={false}
        handleClose={jest.fn()}
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
      />
    );

    expect(capturedProps.show).toBe(false);
  });

  test('4. Repassa handleClose como onHide', () => {
    const handleClose = jest.fn();
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={handleClose}
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
      />
    );

    expect(capturedProps.onHide).toBe(handleClose);
  });

  test('5. Define o título fixo correto', () => {
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={jest.fn()}
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
      />
    );

    expect(capturedProps.titulo).toBe('Excluir o número do processo SEI');
    expect(screen.getByTestId('titulo')).toHaveTextContent('Excluir o número do processo SEI');
  });

  test('6. Define o bodyText fixo com HTML correto', () => {
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={jest.fn()}
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
      />
    );

    expect(capturedProps.bodyText).toBe(
      '<p>Tem certeza que deseja excluir esse número de processo?</p>'
    );
  });

  test('7. Repassa onConfirmDelete como segundoBotaoOnclick', () => {
    const onConfirmDelete = jest.fn();
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={jest.fn()}
        onConfirmDelete={onConfirmDelete}
        onCancelDelete={jest.fn()}
      />
    );

    expect(capturedProps.segundoBotaoOnclick).toBe(onConfirmDelete);
  });

  test('8. Repassa onCancelDelete como primeiroBotaoOnclick', () => {
    const onCancelDelete = jest.fn();
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={jest.fn()}
        onConfirmDelete={jest.fn()}
        onCancelDelete={onCancelDelete}
      />
    );

    expect(capturedProps.primeiroBotaoOnclick).toBe(onCancelDelete);
  });

  test('9. Define textos e cores fixas dos botões', () => {
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={jest.fn()}
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
      />
    );

    expect(capturedProps.segundoBotaoTexto).toBe('Excluir');
    expect(capturedProps.segundoBotaoCss).toBe('danger');
    expect(capturedProps.primeiroBotaoTexto).toBe('Cancelar');
    expect(capturedProps.primeiroBotaoCss).toBe('outline-success');
  });

  test('10. Clicar no botão Excluir (simulado) chama onConfirmDelete', () => {
    const onConfirmDelete = jest.fn();
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={jest.fn()}
        onConfirmDelete={onConfirmDelete}
        onCancelDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('btn-excluir'));
    expect(onConfirmDelete).toHaveBeenCalledTimes(1);
  });

  test('11. Clicar no botão Cancelar (simulado) chama onCancelDelete', () => {
    const onCancelDelete = jest.fn();
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={jest.fn()}
        onConfirmDelete={jest.fn()}
        onCancelDelete={onCancelDelete}
      />
    );

    fireEvent.click(screen.getByTestId('btn-cancelar'));
    expect(onCancelDelete).toHaveBeenCalledTimes(1);
  });

  test('12. Não chama handleClose automaticamente ao montar', () => {
    const handleClose = jest.fn();
    render(
      <ConfirmaDeleteProcesso
        show={true}
        handleClose={handleClose}
        onConfirmDelete={jest.fn()}
        onCancelDelete={jest.fn()}
      />
    );

    expect(handleClose).not.toHaveBeenCalled();
  });
});
