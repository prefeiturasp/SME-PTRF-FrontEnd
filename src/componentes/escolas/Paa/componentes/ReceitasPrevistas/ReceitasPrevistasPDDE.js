import "./style.css";
import TableReceitasPrevistasPdde from "./TableReceitasPrevistasPdde";

const ReceitasPrevistasPDDE = ({ setActiveTab, paa }) => {
  return (
    <div>
      <TableReceitasPrevistasPdde setActiveTab={setActiveTab} paa={paa}/>
    </div>
  );
};

export default ReceitasPrevistasPDDE;
