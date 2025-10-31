import toast from "react-hot-toast";

export const confirmToast = (message: string, onConfirm: () => void) => {
  toast.custom((t) => (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-3 w-72 border border-gray-200" >
      <p className="text-gray-800 text-sm font-medium" > {message} </p>
      < div className="flex justify-end gap-2" >
        <button
          onClick={() => {
            toast.dismiss(t.id);
          }}
          className="px-3 py-1 text-sm font-semibold text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        < button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  ));
};
