"use client";

import Swal from "sweetalert2";

const DeleteConfirmation = async (onConfirm) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    await onConfirm();
    await Swal.fire("Deleted!", "Your product has been deleted.", "success");
  }
};

export default DeleteConfirmation;