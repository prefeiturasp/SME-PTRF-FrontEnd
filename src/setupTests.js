// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// const originalError = console.error;
// const originalWarn = console.warn;

// beforeAll(() => {
//     const originalError = console.error;
//     const originalWarn = console.warn;

//     console.error = (...args) => {
//         if (typeof args[0] === 'string' && (args[0].includes('Warning:') || args[0].includes('DeprecationWarning:'))) {
//             return;
//         }
//         originalError(...args);
//     };

//     console.warn = (...args) => {
//         if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
//             return;
//         }
//         originalWarn(...args);
//     };
// });

// afterAll(()=>{
//     console.error = originalError
//     console.warn = originalWarn
// })