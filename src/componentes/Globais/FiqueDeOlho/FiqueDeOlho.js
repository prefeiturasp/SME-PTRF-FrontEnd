import './scss/FiqueDeOlho.scss';

const FiqueDeOlho = ({ texto }) => {
  if (!texto) return null;

  return (
    <div className="col-12 container-texto-introdutorio mb-4">
      <div dangerouslySetInnerHTML={{ __html: texto }} />
    </div>
  );
};

export default FiqueDeOlho;
