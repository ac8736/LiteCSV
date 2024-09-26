import { useToast } from "@chakra-ui/react";

// Define the options for the toasts
type ToastOptions = {
  title: string;
  description?: string;
  status?: "success" | "error" | "warning" | "info";
  duration?: number;
  isClosable?: boolean;
  position?: "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

/**
 * Pop up custom toasts using Chakra UI's useToast hook
 *
 * @returns An object with a function to show custom toasts
 */
export const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({
    title,
    description,
    status = "info",
    duration = 3000,
    isClosable = true,
    position = "top",
  }: ToastOptions) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position,
    });
  };

  return { showToast };
};
