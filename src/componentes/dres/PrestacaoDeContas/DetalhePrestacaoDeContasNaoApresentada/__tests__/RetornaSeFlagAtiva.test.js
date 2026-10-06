import { RetornaSeFlagAtiva } from '../RetornaSeFlagAtiva';
import { visoesService } from '../../../../../services/visoes.service';

jest.mock('../../../../../services/visoes.service', () => ({
    visoesService: {
        featureFlagAtiva: jest.fn(),
    },
}));

describe('RetornaSeFlagAtiva', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('chama visoesService.featureFlagAtiva com a flag correta e retorna true quando ativa', () => {
        visoesService.featureFlagAtiva.mockReturnValue(true);

        const resultado = RetornaSeFlagAtiva();

        expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('pc-reprovada-nao-apresentacao');
        expect(resultado).toBe(true);
    });

    it('retorna false quando a flag está desativada', () => {
        visoesService.featureFlagAtiva.mockReturnValue(false);

        const resultado = RetornaSeFlagAtiva();

        expect(resultado).toBe(false);
    });
});
