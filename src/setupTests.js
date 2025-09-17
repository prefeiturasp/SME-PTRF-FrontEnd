// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';


// Redefine o timeout para 60 segundos, evitar erros de timeout durante a execução de todos os testes
jest.setTimeout(60000); // 60 segundos