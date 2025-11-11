import { useNavigate } from 'react-router-dom';
import { toastCustom } from '../../../../../Globais/ToastCustom';
import './styles.css';

export const RelSecaoComponentes = ({
    secaoKey, 
    config,
    paaVigente,
}) => {
    const navigate = useNavigate();
    const paaUuid = paaVigente?.uuid;

    const handleEditarClick = () => {
        if (!paaUuid) {
            toastCustom.ToastCustomError("Erro!", "PAA vigente não encontrado.");
            return;
        }

        navigate('/relatorios-componentes/atividades-previstas', {
            state: { paaUuid },
        });
    };

    return (
        <>
        <div className="subitem">
            <div className="subitem-header">
                <div className="subitem-titulo">Atividades previstas</div>
                <button className="btn-editar" type="button" onClick={handleEditarClick}>
                    Editar
                </button>
            </div>
        </div>
        </>
    );
};
