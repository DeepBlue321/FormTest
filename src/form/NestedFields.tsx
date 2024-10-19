/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL]  - tato validace by měla mít debounce 500ms
 */

import React, { useContext, useEffect } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { FormContext, FormContextType } from "../context/FormContext";


interface Category {
    name: string;
    slug: string;
    url:string;
  }


const NestedFields: React.FC = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  
  const {control,amount} = useContext<FormContextType | undefined>(FormContext);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "witnesses"
  });

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
    .then(response =>response.json())
    .then((response:Category[]) => {
      setCategories(response);
    });
  }, []);

  return (
    <>
      <div>
        <label>Allocation:</label>
        <Controller
          name="allocation"
          control={control}
          render={({ field }) => (
            <input
              type="number"
              {...field}
              disabled={!amount}
              min={0}
              max={amount || 0}
            />
          )}
        />
      </div>

      <div>
        <label>Category:</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select style={{width:200}} {...field}>
              {categories.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.name}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div>
        <label>Witnesses:</label>
        {fields.map((field, index) => (
          <div key={field.id}>
            <label>Name:</label>
            <Controller
              name={`witnesses.${index}.name`}
              control={control}
              render={({ field }) => <input {...field} />}
            />
            <label>Email:</label>
            <Controller
              name={`witnesses.${index}.email`}
              control={control}
              render={({ field }) => <input {...field} />}
            />
            <button type="button" onClick={() => remove(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ name: '', email: '' })}>
          Add Witness
        </button>
      </div>
    </>
  );
};

export default NestedFields;
