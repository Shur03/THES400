"use client";

import { Alert, Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InputGroupText from "react-bootstrap/InputGroupText";
import { signIn } from "next-auth/react";
import { Phone, User } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const register = async () => {
    setSubmitting(true);

    try {
      const res = await signIn("credentials", {
        username: "Username",
        password: "Password",
        redirect: false,
        callbackUrl: "/",
      });

      if (!res) {
        setError("Register failed");
        return;
      }

      const { ok, url, error: err } = res;

      if (!ok) {
        if (err) {
          setError(err);
          return;
        }

        setError("Register failed");
        return;
      }

      if (url) {
        router.push(url);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Alert
        variant="danger"
        show={error !== ""}
        onClose={() => setError("")}
        dismissible
      >
        {error}
      </Alert>
      <Form onSubmit={register}>
        <InputGroup className="mb-3">
          <InputGroupText>
            <User />
          </InputGroupText>
          <FormControl
            name="username"
            required
            disabled={submitting}
            placeholder="Нэрээ оруулна уу"
            aria-label="Username"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <Phone />
          </InputGroupText>
          <FormControl
            type="phone"
            name="phone"
            required
            disabled={submitting}
            placeholder="Утасны дугаараа оруулна уу"
            aria-label="Phone"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faLock} fixedWidth />
          </InputGroupText>
          <FormControl
            type="password"
            name="password"
            required
            disabled={submitting}
            placeholder="Нууц үгээ оруулна уу"
            aria-label="Password"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faLock} fixedWidth />
          </InputGroupText>
          <FormControl
            type="password"
            name="password_repeat"
            required
            disabled={submitting}
            placeholder="Нууц үгээ давтан хийнэ үү"
            aria-label="Confirm password"
          />
        </InputGroup>

        <Button
          type="submit"
          className="d-block w-100"
          disabled={submitting}
          variant="success"
        >
          Хадгалах
        </Button>
      </Form>
    </>
  );
}
