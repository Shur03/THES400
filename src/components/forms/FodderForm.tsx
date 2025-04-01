"use client";

// import { useActionState, useActionStatus } from "react-dom";
import {
  Alert,
  Button,
  Form as BSForm,
  FormControl,
  FormGroup,
  FormLabel,
  Form,
} from "react-bootstrap";
import React, { useActionState, useEffect, useState } from "react";

// import { FodderStock } from "@/models/Fodder";
import { FodderType } from "@/models/enum";
import create from "@/app/(dashboard)/fodder/create/action";

type Props = {
  fodder?: {
    types: FodderType;
  };
};
const SubmitButton = () => {
  const { pending } = useActionState();

  return (
    <Button
      disabled={pending}
      className="me-3 bg-green-300 text-white p-2 rounded-lg"
      type="submit"
      variant="success"
    >
      {/* {pending ? dict.action.submitting : dict.action.submit} */}
      Хадгалах
    </Button>
  );
};

export default function FodderForm(props: Props) {
  const { fodder } = props;

  const [state, formAction] = useActionState(create, {
    success: false,
    scrollTop: false,
    message: "",
    formKey: 0,
  });

  useEffect(() => {
    if (state.scrollTop) {
      window.scrollTo(0, 0);
    }
  }, [state]);
  const [selectedType, setSelectedType] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value);
  };
  return (
    <BSForm
      noValidate
      key={state.formKey}
      action={formAction}
      className="mb-3 mx-5 text-gray-800"
    >
      <Alert
        variant={state.success ? "success" : "danger"}
        show={state.errors === undefined && state.message !== ""}
      >
        {state.message}
      </Alert>
      <FormGroup>
        <FormLabel>Төрөл сонгох:</FormLabel>
        <div>
          {fodder?.types.map((type, index) => (
            <Form.Check
              key={index}
              type="radio"
              label={type}
              name="type"
              value={type.toLowerCase().replace(/\s+/g, "")}
              checked={selectedType === type.toLowerCase().replace(/\s+/g, "")}
              onChange={handleChange}
            />
          ))}
        </div>
      </FormGroup>
      <FormGroup className="mb-3">
        <FormLabel>Тоо ширхэг</FormLabel>
        <FormControl
          className="w-auto"
          type="number"
          name="counts"
          required
          defaultValue={fodder?.counts}
          isInvalid={!!state.errors?.counts}
        />
        {/* <FormError messages={state.errors?.counts} /> */}
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>Жин</FormLabel>
        <FormControl
          className="w-auto"
          type="number"
          name="weight"
          required
          defaultValue={fodder?.weight}
          isInvalid={!!state.errors?.weight}
        />
        {/* <FormError messages={state.errors?.weight} /> */}
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>Үнэ</FormLabel>
        <FormControl
          className="w-auto"
          type="number"
          name="price"
          required
          defaultValue={fodder?.price}
          isInvalid={!!state.errors?.price}
        />
        {/* <FormError messages={state.errors?.price} /> */}
      </FormGroup>

      <SubmitButton />
      <Button type="reset" className="bg-blue-300 text-white p-2 rounded-lg">
        Буцах
      </Button>
    </BSForm>
    // <h1>create</h1>
  );
}
