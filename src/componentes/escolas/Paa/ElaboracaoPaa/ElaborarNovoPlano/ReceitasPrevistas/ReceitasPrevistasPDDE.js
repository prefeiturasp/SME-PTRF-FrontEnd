import "./style.css";
import TableReceitasPrevistasPdde from "./TableReceitasPrevistasPdde";

const ReceitasPrevistasPDDE = ({ setActiveTab }) => {

  return (
    <div>
      <TableReceitasPrevistasPdde
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default ReceitasPrevistasPDDE;
