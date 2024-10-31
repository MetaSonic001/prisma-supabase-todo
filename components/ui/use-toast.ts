import { useToast as useToastOriginal } from "./toaster"

export const useToast = () => {
  return useToastOriginal()
}