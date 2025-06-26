import { useToaster } from "@gravity-ui/uikit";
import { exit } from "process";
export const useInfoMsg = () => {
  const { add } = useToaster()
  const showToast= (message: string, type: "success" | "danger" | "info" | "warning"|"") => {

    if(message == "" || type == "")  
      {
        add({
          name: 'toast',
          title:  "Error",
          content: "Doesn't Exist any message",
          autoHiding:5000,
          theme: "danger",
        })
      }else{
        add({
          name: 'toast',
          title: type==="danger" ? "Error" : type,
          content: message,
          autoHiding:5000,
          theme: type,
        })
      }
    }


  return showToast;
};