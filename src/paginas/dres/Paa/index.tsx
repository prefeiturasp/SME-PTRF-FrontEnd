import { PaginasContainer } from '../../PaginasContainer';
import { Paa } from '../../../componentes/dres/Paa';

export const PaaPage = () => {
    return (
        <PaginasContainer>
            <h1 className='titulo-itens-painel mt-5'>Plano Anual de Atividades</h1>
            <div className='page-content-inner'>
                <Paa />
            </div>
        </PaginasContainer>
    );
};
