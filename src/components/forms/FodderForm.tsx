"use client";

// import { useActionState, useActionStatus } from "react-dom";
import {
  Alert,
  Button,
  Col,
  Form as BSForm,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import React, { useActionState, useEffect } from "react";
import classNames from "classnames";
import Image from "next/image";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";

import { FodderStock } from "@/models/Fodder";
import { FodderType } from "@/models/enum";
import create from "@/app/(dashboard)/fodder/create/action";

type Props = {
  types: FodderType[];
  fodder?: FodderStock;
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
  const { fodder, types } = props;

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

  return (
    <BSForm
      noValidate
      key={state.formKey}
      action={formAction}
      className="mb-3 text-gray-800"
    >
      <Alert
        variant={state.success ? "success" : "danger"}
        show={state.errors === undefined && state.message !== ""}
      >
        {state.message}
      </Alert>

      {fodder && (
        <div
          className="position-relative mx-5"
          style={{
            width: "150px",
            height: "150px",
          }}
        ></div>
      )}

      <FormGroup className="mb-3">
        <FormLabel>Нэр</FormLabel>
        <FormControl
          type="text"
          name="name"
          defaultValue={fodder?.name}
          isInvalid={!!state.errors?.name}
          required
        />
        {/* <FormError messages={state.errors?.name} /> */}
      </FormGroup>

      <FormGroup className="mb-3">
        <h1>sk </h1>
        <FormLabel>Төрөл</FormLabel>
        <div className={classNames({ "is-invalid": !!state.errors?.types })}>
          <Row></Row>
        </div>
        {/* <FormError messages={state.errors?.types} /> */}
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
