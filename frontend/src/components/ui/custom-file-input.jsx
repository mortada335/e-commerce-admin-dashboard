import { Button } from "./button";
import { Card } from "./card";
import { Trash2, Upload } from "lucide-react";

const FileInput = ({
  field,
  setFormFields,
  formFields,
  onDeleteSectionBackground,
}) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // setSelectedFile(file)

    const reader = new FileReader();

    reader.onload = () => {
      const dataURL = reader.result;

      setFormFields({
        ...formFields,
        [field.name]: file,
      });
      field.onChange(dataURL);
    };

    reader.readAsDataURL(file);
  };

  // Delete image handler.
  const handleDeleteImage = () => {
    // Check if the field has a value.
    if (field.value) {
      // Set the field value to null.
      field.onChange(null);

      // Reset the form fields state.
      setFormFields({
        ...formFields,
        [field.name]: "",
      });
    }

    // Set section background state to true.
    onDeleteSectionBackground(true);
  };

  return (
    <div className="relative">
      <label htmlFor={`custom-input-${field.name}`}>
        <Card className="flex flex-col justify-center   items-center space-y-4 h-fit cursor-pointer border-dashed border-2 py-4">
          <input
            type="file"
            id={`custom-input-${field.name}`}
            onChange={handleFileChange}
            hidden
            accept=".jpg, .jpeg, .png, .gif"
          />
          <div className="flex justify-start items-center space-x-2 text-gray-500  text-sm px-4 ">
            <Upload size={18} /> <span>Click To Select File</span>
          </div>

          {field.value && (
            <img
              src={field.value}
              alt=""
              className="w-40 h-20 object-contain rounded-sm border"
            />
          )}
        </Card>
      </label>

      {/* Delete image button. */}
      {field.value && (
        <Button
          type="button"
          variant="ghost"
          className="absolute top-1 right-1 bg-red-50 hover:bg-red-100 group"
          onClick={handleDeleteImage}
        >
          <Trash2
            size={14}
            color="red"
            className="group-hover:scale-110 transition"
          />
        </Button>
      )}
    </div>
  );
};

export default FileInput;
