import { useNavigate } from 'react-router-dom';

export const ListaBemProduzido = (props) => {
  const navigate = useNavigate();
  return (
    <div className="d-flex  justify-content-end pb-4 mt-2">
      <button
        className="btn btn-success float-right"
        onClick={() => navigate("/cadastro-bem-produzido")}
      >
        Adicionar bem produzido
      </button>
    </div>
  );
};
