import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useField } from "formik";

interface InputFieldProps{
    name: string;
    placeholder: string;
    label: string;
    type: string;
    textarea?: boolean;
}

const InputField = ({textarea, ...props}:InputFieldProps) => {
    const[field, {error}]= useField(props)
    
  return (
    <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
       {textarea ? (
        <Textarea {...field} id={field.name}/>
       ):( <Input 
        // field.values, field.onChange
        {...field}
        id={field.name}
        {...props}
        />)}
       
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default InputField