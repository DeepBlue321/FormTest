/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */



import React, { useContext } from "react";
import {  Controller } from "react-hook-form";

import NestedFields from "./NestedFields";
import { FormContext, FormContextType } from "../context/FormContext";



const damagedPartsOptions = ['roof', 'front', 'side', 'rear'];


const MainForm: React.FC = () => {
 
  const {errors,control,handleSubmit,setValue} = useContext<FormContextType | undefined>(FormContext);
  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (  <form onSubmit={handleSubmit(onSubmit)}>
  <div>
    <label>Amount:</label>
    <Controller
      name="amount"
      control={control}
      render={({ field }) => (
        <input
          type="number"
          {...field}
          style={errors.amount ? { border: "1px solid red" } : {}}
        />
      )}
    />
    {errors.amount && <p style={{ color: "red" }}>{errors.amount.message}</p>}
  </div>

  <div>
    <label>Damaged Parts:</label>
    {damagedPartsOptions.map((part) => (
      <label key={part}>
        <Controller
          name="damagedParts"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              value={part}
              onChange={(e) => {
                const checked = e.target.checked;
                const value = field.value;
                if (checked) {
                  setValue("damagedParts", [...value, part]);
                } else {
                  setValue("damagedParts", value.filter((v: string) => v !== part));
                }
              }}
            />
          )}
        />
        {part}
      </label>
    ))}
    {errors.damagedParts && <p style={{ color: "red" }}>{errors.damagedParts.message}</p>}
  </div>

   <NestedFields />  

  <button type="submit">Submit</button>
</form>)

}

export default MainForm;
