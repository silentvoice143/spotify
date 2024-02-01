import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showErrorToast = (message, options = {}) => {
  // Dismiss the currently displayed toast
  toast.dismiss();

  // Show the new toast
  toast.error(message, {
    autoClose: 5000, // Set the auto-close time in milliseconds (adjust as needed)
    ...options,
  });
};

const showSuccessToast = (message, options = {}) => {
  // Dismiss the currently displayed toast
  toast.dismiss();

  // Show the new toast
  toast.success(message, {
    autoClose: 5000, // Set the auto-close time in milliseconds (adjust as needed)
    ...options,
  });
};

export { showErrorToast, showSuccessToast };
