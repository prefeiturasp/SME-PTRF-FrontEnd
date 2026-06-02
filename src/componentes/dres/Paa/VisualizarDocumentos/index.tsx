import { useParams } from 'react-router-dom';
import Loading from '../../../../utils/Loading';
import Img404 from '../../../../assets/img/img-404.svg';
import { MsgImgCentralizada } from '../../../Globais/Mensagens/MsgImgCentralizada';
import { useGetVisualizarDocumentosPaa } from '../../../../hooks/dres/Paa/useGetVisualizarDocumentosPaa';
import { useRecursoSelecionadoContext } from '../../../../context/RecursoSelecionado';
import { RecursoSelecionadoContextLocal } from '../../../../interface/Globais/recursoSelecionado';
import { PaaCardBarraTitulo } from './components/PaaCardBarraTitulo/PaaCardBarraTitulo';
import { PaaCard } from './components/PaaCard/PaaCard';
import type {
    IVigentePaa,
    IVisualizarDocumentosPaaResponse,
} from '../../../../interface/dre/Paa/paa.interface';
import { HeaderDocumentos } from './components/HeaderDocumentos';
import './scss/VisualizarDocumentos.scss';

export const VisualizarDocumentos = (): JSX.Element => {
    const { uuid_paa: uuidPaa } = useParams<{ uuid_paa: string }>();
    const context = useRecursoSelecionadoContext() as unknown as RecursoSelecionadoContextLocal;
    const { recursoSelecionado } = context;
    const uuidRecurso = recursoSelecionado?.uuid;

    const { data, isLoading: carregando } = useGetVisualizarDocumentosPaa(uuidPaa, uuidRecurso) as {
        data?: IVisualizarDocumentosPaaResponse;
        isLoading: boolean;
        error?: unknown;
    };

    const vigente: IVigentePaa | undefined = data?.vigente;
    const { unidade, referencia, esta_em_retificacao } = vigente || {};

    if (carregando) {
        return <Loading corGrafico='black' corFonte='dark' marginTop='0' marginBottom='0' />;
    }

    if (vigente) {
        return (
            <div className='visualizar-documentos'>
                <HeaderDocumentos
                    unidadeTipo={unidade?.tipo}
                    unidadeNome={unidade?.nome}
                    codigoEol={unidade?.codigo_eol}
                    referencia={referencia}
                    estaEmRetificacao={esta_em_retificacao}
                />
                <div className='mt-4'>
                    <PaaCardBarraTitulo titulo={`PAA ${referencia}`} />

                    <PaaCard dados={vigente} />
                </div>
            </div>
        );
    }

    const texto = 'Nenhum resultado encontrado.';

    return <MsgImgCentralizada texto={texto} img={Img404} />;
};
