import { toast } from 'react-toastify';
import { useState } from 'react';

function CustomToast(message, type)  {
    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      }
     
    // var options = customOption ? customOption : toastOptions;
  if(type=="success"){
    toast.success(message, toastOptions)
  }
  if(type=="error"){
    toast.error(message, toastOptions);
  }
  if(type=="info"){
    toast.info(message, toastOptions)
  }
  
};

export default CustomToast;
