import CustomInputFile from "../custom-input-file/customInputFile";
import "./data-form.css";

interface DataFormProps {
  handleToggleDialog: () => void;
}

const DataForm = ({ handleToggleDialog }: DataFormProps) => {
  return (
    <div className="form-container">
      <div className="wrapper-btn-close">
        <button onClick={handleToggleDialog} className="btn-close">
          X
        </button>
      </div>
      {/* Form */}
      <h2>Completa el Formulario</h2>
      <form action="" className="data-form">
        <div className="form-row">
          {/* Sales Data */}
          <div className="form-column">
            <label htmlFor="">Sales Data</label>
            <input type="file" />
          </div>

          {/* Current Inventory */}
          <div className="form-column">
            <label htmlFor="">Current Inventory</label>
            <input type="file" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            {/* Inventory History Days */}
            <CustomInputFile />

            {/* <label htmlFor="">Inventory Data Days</label>
            <input type="text" /> */}
          </div>

          {/* Coverage Days */}
          <div className="form-column">
            <label htmlFor="">Coverage Days</label>
            <input type="text" />
          </div>
        </div>

        <div className="form-row">
          {/* Buffer Days */}
          <div className="form-column">
            <label htmlFor="">Buffer Days</label>
            <input type="text" />
          </div>
          {/* Lead Time */}
          <div className="form-column">
            <label htmlFor="">Lead Time</label>
            <input type="text" />
          </div>
        </div>
        <button className="btn-get-started">Submit</button>
      </form>
    </div>
  );
};

export default DataForm;
