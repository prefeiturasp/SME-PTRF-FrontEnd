import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { visoesService } from '../../services/visoes.service';
import { getAlertaVigente } from '../../services/AlertasPaginas.service';
import { alertaPaginaStorageService } from '../../services/storages/AlertaPagina.storage.service';
import { useRecursoSelecionadoContext } from '../../context/RecursoSelecionado';
import { ModalAlertaPagina } from '../../componentes/Globais/Modal/ModalAlertaPagina';

const ROTAS_SEM_ALERTA = ['/login', '/login-suporte', '/seleciona-recurso'];

export const deveConsultarAlerta = ({ logado, visao, recursoUuid, unidadeUuid, mostrarOverlay, pathname }) =>
    Boolean(
        logado &&
            visao === 'UE' &&
            recursoUuid &&
            unidadeUuid &&
            !mostrarOverlay &&
            !ROTAS_SEM_ALERTA.includes(pathname),
    );

const lerDadosUsuario = () => ({
    visao: visoesService.getItemUsuarioLogado('visao_selecionada.nome'),
    unidadeUuid: visoesService.getItemUsuarioLogado('unidade_selecionada.uuid'),
    login: visoesService.getItemUsuarioLogado('usuario_logado.login'),
});

export const useAlertaPagina = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { recursoSelecionado, mostrarOverlaySelecionarRecursos } = useRecursoSelecionadoContext();
    const ultimaConsulta = useRef(null);

    useEffect(() => {
        const logado = authService.isLoggedIn();
        const { visao, unidadeUuid, login } = logado ? lerDadosUsuario() : {};
        const recursoUuid = recursoSelecionado?.uuid;

        const deveConsultar = deveConsultarAlerta({
            logado,
            visao,
            recursoUuid,
            unidadeUuid,
            mostrarOverlay: mostrarOverlaySelecionarRecursos,
            pathname,
        });
        const chaveConsulta = `${login}:${unidadeUuid}:${recursoUuid}`;

        if (!deveConsultar || ultimaConsulta.current === chaveConsulta) return;
        ultimaConsulta.current = chaveConsulta;

        const consultarAlerta = async () => {
            try {
                const { alerta } = await getAlertaVigente(recursoUuid, unidadeUuid);
                if (!alerta || alertaPaginaStorageService.alertaJaVisto(login, alerta.chave)) return;

                ModalAlertaPagina({
                    dispatch,
                    textoHtml: alerta.texto,
                    dataQa: 'modal-alerta-pagina',
                    onFechar: () => alertaPaginaStorageService.marcarAlertaComoVisto(login, alerta.chave),
                });
            } catch (error) {
                console.error('Erro ao consultar alerta da página: ', error);
            }
        };

        consultarAlerta();
    }, [recursoSelecionado?.uuid, mostrarOverlaySelecionarRecursos, pathname, dispatch]);
};
