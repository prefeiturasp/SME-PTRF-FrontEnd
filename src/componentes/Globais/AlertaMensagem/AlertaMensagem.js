import { ExclamationCircleOutlined } from "@ant-design/icons";
import './scss/AlertaMensagem.scss';

const AlertaMensagem = ({ mensagem }) => {
  if (!mensagem) return null;

  return (
    <div className="alert alert-mensagem">
      <ExclamationCircleOutlined className="alert-icon" /> {mensagem}
    </div>
  );
};

export default AlertaMensagem;
