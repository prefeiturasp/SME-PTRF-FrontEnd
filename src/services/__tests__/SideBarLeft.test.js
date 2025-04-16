import { SidebarLeftService } from '../SideBarLeft.service';

describe('SidebarLeftService', () => {
  let getElementByIdSpy;

  afterEach(() => {
    if (getElementByIdSpy) {
      getElementByIdSpy.mockRestore();
    }
  });

  describe('setItemActive', () => {
    it('Deve encontrar o elemento pelo ID e chamar seu método click()', () => {
      const testId = 'menu-item-1';
      const mockElement = {
        click: jest.fn()
      };

      // Spy on document.getElementById e retorna o elememtp mock quando chamado pelo testId
      getElementByIdSpy = jest.spyOn(document, 'getElementById')
                             .mockImplementation((id) => {
                               if (id === testId) {
                                 return mockElement;
                               }
                               return null; // retorno padrão para outros IDs
                             });

      SidebarLeftService.setItemActive(testId);

      expect(getElementByIdSpy).toHaveBeenCalledWith(testId);
      expect(mockElement.click).toHaveBeenCalledTimes(1);
    });

    it('Deve lançar erro se o elemento não for encontrado', () => {
      // Arrange
      const nonExistentId = 'non-existent-item';

      // Spy on document.getElementById and make it return null for the specific ID
      getElementByIdSpy = jest.spyOn(document, 'getElementById')
                             .mockImplementation((id) => {
                               if (id === nonExistentId) {
                                 return null;
                               }
                               // Allow other potential calls (though unlikely in this test)
                               return { click: jest.fn() };
                             });

      expect(() => {
        SidebarLeftService.setItemActive(nonExistentId);
      }).toThrow(TypeError);

      expect(getElementByIdSpy).toHaveBeenCalledWith(nonExistentId);
    });

  });
});
