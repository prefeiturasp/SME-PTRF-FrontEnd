import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { authService } from "../../../../services/auth.service";
import { useNavigate } from 'react-router-dom';
import {visoesService} from "../../../../services/visoes.service";
import {CentralDeDownloadContext} from "../../../../context/CentralDeDownloads"
import {NotificacaoContext} from "../../../../context/Notificacoes";
import { Cabecalho } from '../index';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mantemEstadoAnaliseDre } from "../../../../services/mantemEstadoAnaliseDre.service";


jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn()
  }));

jest.mock("../../../../services/mantemEstadoAnaliseDre.service", () => ({
    mantemEstadoAnaliseDre:{
        limpaAnaliseDreUsuarioLogado: jest.fn(),
    }
}));

jest.mock("../../../../services/auth.service", () => ({
    authService:{
        logout: jest.fn(),
        isLoggedIn: jest.fn(),
    }
}));

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        getDadosDoUsuarioLogado: jest.fn(),
        alternaVisoes: jest.fn(),
        getUsuarioLogin: jest.fn(),
        converteNomeVisao: jest.fn(),
        getItemUsuarioLogado: jest.fn(),
    }
  }));


const mockCentralDeDownloadContext = {
    getQtdeNotificacoesNaoLidas: jest.fn(),
}

const mockNotificacaoContext = {
    getQtdeNotificacoesNaoLidas: jest.fn(),
    setExibeModalPerdeuAcesso: jest.fn(),
    setExibeModalTemDevolucao: jest.fn(),
    setExibeMensagemFixaTemDevolucao: jest.fn(),
    getExibeModalErroConcluirPc: jest.fn(),

}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

// beforeEach(() => {
//     useHistory.mockReturnValue({ push: mockHistoryPush });
//     useDispatch.mockReturnValue(mockDispatch);
//   });


describe('Cabeçalho', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();
        visoesService.getItemUsuarioLogado.mockReturnValue("James Bond");
        authService.isLoggedIn.mockReturnValue(true);
        visoesService.getDadosDoUsuarioLogado.mockReturnValue(mockDadosUsuarioLogado)

    })
    const renderComponent = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <CentralDeDownloadContext.Provider value={mockCentralDeDownloadContext}>
                    <NotificacaoContext.Provider value={mockNotificacaoContext}>
                        <Cabecalho />
                    </NotificacaoContext.Provider>
                </CentralDeDownloadContext.Provider>
            </QueryClientProvider>
        )

    }

    const mockDadosUsuarioLogado = {
        usuario_logado: {
            nome: "James Bond",
            uuid: "fake-uuid",
            login: "james.bond",
        },
        visao_selecionada: { nome: 'SME' },
        unidade_selecionada: { 
            uuid: 'fake-uuid',
            tipo_unidade: 'DRE',
            nome: 'Support Unit',
            notificar_devolucao_referencia: true,
            notificar_devolucao_pc_uuid: 'fake-uuid',
            notificacao_uuid: 'fake-uuid'
        },
        associacao_selecionada: {
            uuid: 'fake-uuid',
            nome: 'Support Unit',
        },
        unidades: [
            { 
                uuid: 'fake-uuid-2',
                nome: 'Unit 2',
                tipo_unidade: 'CEI', 
                notificar_devolucao_referencia: true,
                notificar_devolucao_pc_uuid: 'fake-uuid-2',
                notificacao_uuid: 'fake-uuid-2',
                associacao: {
                    uuid: 'fake-uuid-2',
                    nome: 'Support Unit 2',
                } 
        }],
    }
    const mockHistoryPush = jest.fn();

    it('Deve renderizar o Cabeçalho', async () => {
        
        renderComponent();
        const obj_unidade = '{"uuid_unidade":"fake-uuid-2","uuid_associacao":"fake-uuid-2","nome_associacao":"Support Unit 2","unidade_tipo":"CEI","unidade_nome":"Unit 2","notificar_devolucao_referencia":true,"notificar_devolucao_pc_uuid":"fake-uuid-2","notificacao_uuid":"fake-uuid-2"}'
        const select = screen.getByTestId('select-unidade');
        fireEvent.change(select, { target: { value: obj_unidade } });
        expect(visoesService.getItemUsuarioLogado).toHaveBeenCalledTimes(1);
        expect(mantemEstadoAnaliseDre.limpaAnaliseDreUsuarioLogado).toHaveBeenCalledTimes(1);

    });

    it('Deve redirecionar para central de notificações', async () => {
        useNavigate.mockReturnValue({ push: mockHistoryPush })
        renderComponent();
        const botao = screen.getByTestId('botao-central-notificacoes');
        fireEvent.click(botao);
        expect(mockHistoryPush).toHaveBeenCalledWith("/central-de-notificacoes");

    });

    it('Deve redirecionar para central de downloads', async () => {
        useNavigate.mockReturnValue({ push: mockHistoryPush })
        renderComponent();
        const botao = screen.getByTestId('botao-central-downloads');
        fireEvent.click(botao);
        expect(mockHistoryPush).toHaveBeenCalledWith("/central-de-downloads");

    });

    it('Deve clicar no botão de sair e não tem notificações não lidas', async () => {
        mockNotificacaoContext.getQtdeNotificacoesNaoLidas.mockReturnValue(0);
        renderComponent();
        const botao = screen.getByTestId('botao-sair');
        fireEvent.click(botao);
        waitFor(() => {
            expect(authService.logout).toHaveBeenCalledTimes(1);
        });
    });

    it('Deve clicar no botão de sair e tem notificações não lidas e sair', async () => {
        mockNotificacaoContext.getQtdeNotificacoesNaoLidas.mockReturnValue(1);
        renderComponent();
        const botao = screen.getByTestId('botao-sair');
        fireEvent.click(botao);
        waitFor(() => {
            expect(authService.logout).not.toHaveBeenCalled();
        });
        let dialogModal;
        waitFor(() => {
            dialogModal = screen.getByRole("dialog")
            expect(dialogModal).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Sair do sistema/i));
        });
        waitFor(() => {
            expect(authService.logout).toHaveBeenCalledTimes(1);
        });
    });

});