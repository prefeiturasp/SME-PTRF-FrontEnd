import { TopoComBotoes as TopoBotao} from "../../../../Globais/TopoComBotoes";
import { useNavigate } from 'react-router-dom';

export const TopoComBotoes = () => {
    const navigate = useNavigate();

    const handleAdicionar = () => {
        navigate(`/cadastro-periodo-paa`);
    }

    return(
        <div className="d-flex  justify-content-end pb-4 mt-2">
            <TopoBotao label='Adicionar período de PAA' onClick={handleAdicionar}/>
        </div>
    )

}