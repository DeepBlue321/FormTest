import './App.css';
import MainForm from './form/MainForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { FormContext } from './context/FormContext';

const initialValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ['side', 'rear'],
  category: 'kitchen-accessories',
  witnesses: [
    {
      name: 'Marek',
      email: 'marek@email.cz',
    },
    {
      name: 'Emily',
      email: 'emily.johnson@x.dummyjson.com',
    },
  ],
};

// Definice yup schématu pro validaci
const schema = yup.object().shape({
  amount: yup.number().min(0).max(300).required("Amount is required"),
  damagedParts: yup.array().of(yup.string()).min(1, "At least one damaged part is required"),
  witnesses: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup
        .string()
        .email("Invalid email")
        .required("Email is required")
    })
  ).min(1, "At least one witness is required").max(5, "Max 5 witnesses"),
});

function App() {

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema),
      defaultValues:{...initialValues} 
  });

  const amount = watch("amount");

  return (
    <>
        <FormContext.Provider value={{errors, control, handleSubmit,amount,setValue }}>
          <MainForm />
      </FormContext.Provider>
    </>
  );
}

export default App;
