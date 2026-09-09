import { useRef } from "react";
import "./customInputFile.css";

const CustomInputFile = () => {
  const [fileName, setFileName] = useState("No file chosen");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hadleButtonClick = () 

  return (
    <>
      <label htmlFor="inventory-data">Inventory Data Days</label>
      <input type="file" id="inventory-data" hidden />
      <button type="button" id="inventory-data-btn">
        Choose A File
      </button>
      <span id="inventory-data-info">{fileName}</span>
    </>
  );
};

export default CustomInputFile;
