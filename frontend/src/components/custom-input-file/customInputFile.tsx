import { useRef, useState } from "react";
import "./customInputFile.css";

interface CustomInputFileProps {
  label_text: string;
  input_id: string;
  file_type: string;
  input_type: string;
  htmlFor: string;
  span_id: string;
  onChange: (file: File | null) => void; // To communicate with the Father component
}

const CustomInputFile = ({
  label_text,
  input_id,
  file_type,
  input_type,
  htmlFor,
  span_id,
  onChange,
}: CustomInputFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("No file selected");

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFileName(file.name);
      onChange(file); // To send the file to the Father component
    } else {
      setFileName("No file selected");
      onChange(null);
    }
  };

  return (
    <>
      <label htmlFor={htmlFor}>{label_text}</label>
      <input
        ref={inputRef}
        type={input_type}
        id={input_id}
        hidden
        accept={file_type}
        onChange={handleFileChange}
      />
      <button type="button" id="inventory-data-btn" onClick={handleButtonClick}>
        Choose A File
      </button>
      <span id={span_id} className="input-file-info">
        {fileName}
      </span>
    </>
  );
};

export default CustomInputFile;
