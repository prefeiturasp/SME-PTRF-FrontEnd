import { useLocation } from 'react-router-dom';
import { PaginasContainer } from '../../../../../../../paginas/PaginasContainer';
import BreadcrumbComponent from '../../../../../../Globais/Breadcrumb';
import './styles.css';

export const AtividadesPrevistasRelatorio = () => {
    const { state } = useLocation();
    const paaUuid = state?.paaUuid;

    const breadcrumbItems = [
        { label: 'Plano Anual de Atividades', url: '/paa' },
        { label: 'Relatórios', url: '/elaborar-novo-paa' },
        { label: 'Atividades previstas', active: true },
    ];

    return (
        <PaginasContainer>
            <div className="atividades-previstas-container">
                <BreadcrumbComponent items={breadcrumbItems} />
                <h1 className="titulo-itens-painel mt-5">Atividades previstas</h1>
                <div className="page-content-inner">
                    <div className="atividades-previstas-card">
                        <p className="atividades-previstas-description">
                            {paaUuid
                                ? 'Em breve você poderá editar as atividades previstas deste PAA.'
                                : 'Selecione um PAA válido para visualizar as atividades previstas.'}
                        </p>
                    </div>
                </div>
            </div>
        </PaginasContainer>
    );
};
