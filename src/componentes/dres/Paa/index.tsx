import { useState } from 'react';
import { TabelaPaa } from './TabelaPaa';
import { FiltrosPaa } from './FiltrosPaa';
import Loading from '../../../utils/Loading';
import Img404 from '../../../assets/img/img-404.svg';
import { MsgImgCentralizada } from '../../Globais/Mensagens/MsgImgCentralizada';
import { MsgImgLadoDireito } from '../../Globais/Mensagens/MsgImgLadoDireito';
import { Icon } from '../../Globais/UI/Icon';
import { useRecursoSelecionadoContext } from '../../../context/RecursoSelecionado';
import { RecursoSelecionadoContextLocal } from '../../../interface/Globais/recursoSelecionado';
import { useGetTabelaPaaDre } from '../../../hooks/dres/Paa/useGetTabelaPaaDre';
import { useGetPaaPorDre } from '../../../hooks/dres/Paa/useGetPaaPorDre';
import { toast } from 'react-toastify';
import type { IFiltrosPaa, IPaaItem } from '../../../interface/dre/Paa/paa.interface';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import './scss/paa.scss';

const LINHAS_POR_PAGINA = 10;

const ESTADO_FILTROS_INICIAL: IFiltrosPaa = {
    periodo: [],
    unidade: '',
    tipo_unidade: '',
    status: [],
};

export const Paa = () => {
    const [pagina, setPagina] = useState<number>(1);

    const [filtros, setFiltros] = useState<IFiltrosPaa>(ESTADO_FILTROS_INICIAL);
    const [filtrosAplicados, setFiltrosAplicados] = useState<IFiltrosPaa>(ESTADO_FILTROS_INICIAL);

    const [utilizandoFiltros, setUtilizandoFiltros] = useState<boolean>(false);
    const [tipoUnidadeManual, setTipoUnidadeManual] = useState<boolean>(false);

    const navigate = useNavigate();

    const context = useRecursoSelecionadoContext() as unknown as RecursoSelecionadoContextLocal;

    const { recursoSelecionado } = context;

    const uuidRecurso = recursoSelecionado?.uuid;

    const { data: dadosTabelaPaa } = useGetTabelaPaaDre(uuidRecurso);

    const {
        data: listaPaa,
        isLoading: carregando,
        isError,
    } = useGetPaaPorDre({
        uuidRecurso,
        filtros: filtrosAplicados,
        pagina,
    });

    if (isError) {
        toast.error('Erro ao carregar a lista de PAA. Tente novamente mais tarde.');
    }

    const aoAlterarFiltro = (nome: IFiltrosPaa | string, valor: any) => {
        setFiltros((prev) => {
            const novo: IFiltrosPaa = { ...prev, [nome as string]: valor };

            if (nome === 'unidade') {
                const unidadeObj = dadosTabelaPaa?.unidades?.find((u) => u.uuid === valor);

                novo.tipo_unidade = unidadeObj?.tipo_unidade || '';
                setTipoUnidadeManual(false);
            }

            if (nome === 'tipo_unidade') {
                setTipoUnidadeManual(true);
            }

            return novo;
        });
    };

    const aoSubmeterFiltros = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        setPagina(1);
        setUtilizandoFiltros(true);
        setFiltrosAplicados(filtros);
    };

    const limparFiltros = () => {
        setFiltros(ESTADO_FILTROS_INICIAL);
        setFiltrosAplicados(ESTADO_FILTROS_INICIAL);
        setPagina(1);
        setUtilizandoFiltros(false);
        setTipoUnidadeManual(false);
    };

    const aoMudarPagina = (event: { page?: number }) => {
        setPagina((event.page ?? 0) + 1);
    };

    const handleVisualizarPdf = (row: IPaaItem) => {
        if (!row?.tem_documentos) return;

        navigate(`/paa-dre/visualizar-documentos/${row.uuid}`);
    };

    const acaoTemplatePdf = (row: IPaaItem) => (
        <>
            <button
                className='btn btn-link'
                disabled={!row?.tem_documentos}
                onClick={() => handleVisualizarPdf(row)}
                data-tooltip-id={`btn-visualizar-${row.uuid}`}
                data-tooltip-html='Visualização'
            >
                <Icon icon='faEye' />
            </button>
            <ReactTooltip 
                id={`btn-visualizar-${row.uuid}`}     
                style={{ zIndex: 9999 }}
            />
        </>
    );

    const renderizarConteudo = () => {
        if (carregando) {
            return <Loading corGrafico='black' corFonte='dark' marginTop='0' marginBottom='0' />;
        }

        if (listaPaa?.results?.length) {
            return (
                <TabelaPaa
                    listaPaa={listaPaa}
                    linhasPorPagina={LINHAS_POR_PAGINA}
                    unidadeEscolarTemplate={(row: IPaaItem) => (
                        <strong>{row?.unidade?.unidade_educacional || '-'}</strong>
                    )}
                    acaoTemplatePdf={acaoTemplatePdf}
                    aoMudarPagina={aoMudarPagina}
                    paginaAtual={pagina}
                />
            );
        }

        const Mensagem = utilizandoFiltros ? MsgImgCentralizada : MsgImgLadoDireito;

        const texto = utilizandoFiltros ? 'Nenhum resultado encontrado.' : 'Nenhum PAA disponível.';

        return <Mensagem texto={texto} img={Img404} />;
    };

    return (
        <main className='paa-container'>
            <FiltrosPaa
                tabelaPaa={dadosTabelaPaa}
                filtros={filtros}
                aoAlterarFiltro={aoAlterarFiltro}
                aoSubmeterFiltros={aoSubmeterFiltros}
                limpaFiltros={limparFiltros}
                tipoUnidadeManual={tipoUnidadeManual}
            />

            {renderizarConteudo()}
        </main>
    );
};
