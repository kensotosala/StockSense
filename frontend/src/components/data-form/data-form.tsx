import "./data-form.css";

interface DataFormProps {
  handleToggleDialog: () => void;
}

const DataForm = ({ handleToggleDialog }: DataFormProps) => {
  return (
    <div className="form-container">
      <h2>Hello World</h2>
      <button onClick={handleToggleDialog}>Cerrar</button>
    </div>
  );
};

export default DataForm;
