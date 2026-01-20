import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import ModalDialog from '../Modal';
import { Modal } from '../../../../store/reducers/componentes/Globais/Modal/reducer';

const createMockStore = (initialState = {}) => {
  const reducers = combineReducers({
    Modal,
  });
  return createStore(reducers, initialState);
};

describe('ModalDialog', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it('renderiza modal quando open é true', () => {
    const store = createMockStore({
      Modal: {
        open: true,
        options: {
          children: <div>Conteúdo do modal</div>,
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <ModalDialog />
      </Provider>
    );

    expect(getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('renderiza modal com conteúdo correto', () => {
    const store = createMockStore({
      Modal: {
        open: true,
        options: {
          children: <div>Outro conteúdo</div>,
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <ModalDialog />
      </Provider>
    );

    expect(getByText('Outro conteúdo')).toBeInTheDocument();
  });
});

