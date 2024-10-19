import { createContext } from "react";
import { Control, FieldErrors } from "react-hook-form";

export interface FormContextType {
    control: Control<unknown>;
    handleSubmit:unknown;
    amount: number;
    setValue: unknown;
    errors:FieldErrors;
  }

export  const FormContext = createContext<FormContextType | undefined>(undefined);