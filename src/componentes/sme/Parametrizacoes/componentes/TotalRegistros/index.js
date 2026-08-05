export const TotalRegistros = ({ titulo, total_registros }) => {
  return (
    <p className="mb-2">
      Exibindo <span className="total">{total_registros}</span> {titulo.toLowerCase()}
    </p>
  )
};