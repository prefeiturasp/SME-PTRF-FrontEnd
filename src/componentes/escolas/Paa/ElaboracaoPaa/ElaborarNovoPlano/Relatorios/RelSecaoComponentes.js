import { useNavigate } from 'react-router-dom';
import './styles.css';

const COMPONENTES_SECOES = [
    {
        key: 'plano-aplicacao',
        titulo: 'Plano de aplicação',
        acao: 'Visualizar',
        variante: 'secundaria',
        rota: '/relatorios-componentes/plano-aplicacao',
    },
    {
        key: 'plano-orcamentario',
        titulo: 'Plano orçamentário',
        acao: 'Visualizar',
        variante: 'secundaria',
        rota: '/relatorios-componentes/plano-orcamentario',
    },
    {
        key: 'atividades-previstas',
        titulo: 'Atividades previstas',
        acao: 'Editar',
        variante: 'secundaria',
        rota: '/relatorios-componentes/atividades-previstas',
    },
];

export const RelSecaoComponentes = () => {
    const navigate = useNavigate();

    const handleClick = (rota) => {
        if (rota) {
            navigate(rota);
        }
    };

    return (
        <div className="componentes-secao-lista">
            {COMPONENTES_SECOES.map(({ key, titulo, acao, variante, rota }, index) => (
                <div
                    className={`componentes-secao-item ${index === COMPONENTES_SECOES.length - 1 ? 'sem-borda' : ''}`}
                    key={key}
                >
                    <span className="componentes-secao-titulo">{titulo}</span>
                    <button
                        type="button"
                        onClick={() => handleClick(rota)}
                        className={`componentes-secao-botao btn ${variante === 'primaria' ? 'btn-success' : 'btn-outline-success'}`}
                    >
                        {acao}
                    </button>
                </div>
            ))}
        </div>
    );
};
