import api from '../api';
import { downloadDocumentoFinalPaa, getDownloadAtaPaa } from '../Paa.service.js';
import { TOKEN_ALIAS } from '../auth.service.js';

jest.mock('../api', () => ({
    get: jest.fn(),
}));

const mockToken = 'fake-token';

describe('Testes para funções de análise', () => {
    beforeEach(() => {
        localStorage.setItem(TOKEN_ALIAS, mockToken);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('downloadDocumentoFinalPaa deve baixar o arquivo corretamente', async () => {
        const mockBlob = new Blob(['content'], { type: 'application/pdf' });
        api.get.mockResolvedValue({ data: mockBlob });
        window.URL.createObjectURL = jest.fn(() => 'blob:doc-final-url');
        window.URL.revokeObjectURL = jest.fn();
        const mockLink = { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
        jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});

        const paaUuid = 'paa-uuid';
        await downloadDocumentoFinalPaa(paaUuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/paa/${paaUuid}/documento-final/`,
            expect.objectContaining({ responseType: 'blob', timeout: 30000 }),
        );
        expect(mockLink.setAttribute).toHaveBeenCalledWith(
            'download',
            `plano_anual_${paaUuid}.pdf`,
        );
        expect(mockLink.click).toHaveBeenCalled();
        expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:doc-final-url');

        jest.restoreAllMocks();
    });

    it('getDownloadAtaPaa deve baixar a ata corretamente', async () => {
        const mockBlob = new Blob(['content'], { type: 'application/pdf' });
        api.get.mockResolvedValue({ data: mockBlob });
        window.URL.createObjectURL = jest.fn(() => 'blob:ata-url');
        window.URL.revokeObjectURL = jest.fn();
        const mockLink = { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
        jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});

        await getDownloadAtaPaa('ata-uuid');

        expect(api.get).toHaveBeenCalledWith(
            `/api/atas-paa/download-arquivo-ata-paa/?ata-paa-uuid=ata-uuid`,
            expect.objectContaining({ responseType: 'blob', timeout: 30000 }),
        );
        expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'Ata_Apresentacao_PAA.pdf');
        expect(mockLink.click).toHaveBeenCalled();

        jest.restoreAllMocks();
    });

    it('getDownloadAtaPaa deve retornar erro quando a API falha', async () => {
        const mockError = { response: { status: 500 } };
        api.get.mockRejectedValue(mockError);

        const result = await getDownloadAtaPaa('ata-uuid');

        expect(result).toEqual(mockError.response);
    });
});
