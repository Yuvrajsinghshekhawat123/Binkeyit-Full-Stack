 import { useState } from "react";

export function AddFieldButton({ fields, setFields }) {
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newField, setNewField] = useState({ key: "", value: "" }); // only one

  function handleFieldChange(type, val) {
    setNewField((prev) => ({ ...prev, [type]: val }));
  }

  function addField() {
    if (newField.key || newField.value) {
      setFields([...fields, newField]); // add to main fields array
      setNewField({ key: "", value: "" }); // reset input
    }
  }

  return (
    <>
      {showAddFieldModal && (
        <div className="flex flex-col gap-4 border p-4">
          {/* Single input pair */}
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              placeholder="Field name"
              className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:ring-2 focus:border-blue-600 placeholder:text-sm md:placeholder:text-lg"
              value={newField.key}
              onChange={(e) => handleFieldChange("key", e.target.value)}
            />
            <input
              type="text"
              placeholder="Field value"
              className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:ring-2 focus:border-blue-600 placeholder:text-sm md:placeholder:text-lg"
              value={newField.value}
              onChange={(e) => handleFieldChange("value", e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={addField}
            >
              Add Field
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => setShowAddFieldModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowAddFieldModal(true)}
        className="bg-blue-500 text-white px-4 py-2 my-2 rounded cursor-pointer w-full"
      >
        Add Field
      </button>


      
    </>
  );
}
