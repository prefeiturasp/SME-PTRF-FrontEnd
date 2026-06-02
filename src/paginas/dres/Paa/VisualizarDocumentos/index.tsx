import { PaginasContainer } from '../../../PaginasContainer';
import { VisualizarDocumentos } from '../../../../componentes/dres/Paa/VisualizarDocumentos';

export const VisualizarDocumentosPage = () => {
    return (
        <PaginasContainer>
            <h1 className='titulo-itens-painel mt-5'>Visualizar documentos PAA</h1>
            <div className='page-content-inner'>
                <VisualizarDocumentos />
            </div>
        </PaginasContainer>
    );
};
