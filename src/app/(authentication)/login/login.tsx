"use client";

import {
  Alert,
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useState } from "react";
import Link from "next/link";
import InputGroupText from "react-bootstrap/InputGroupText";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { ArrowRightIcon, AtSign, CircleAlert, LockKeyhole } from "lucide-react";

export default function Login({ callbackUrl }: { callbackUrl: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (formData: FormData) => {
    setSubmitting(true);

    try {
      const res = await signIn("credentials", {
        username: formData.get("username"),
        password: formData.get("password"),
        redirect: false,
        callbackUrl,
      });

      if (!res) {
        setError("Login failed");
        return;
      }

      const { ok, url, error: err } = res;

      if (!ok) {
        if (err) {
          setError(err);
          return;
        }

        setError("Login failed");
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
  const [errorMessage, formAction, isPending] = useActionState(undefined);
  return (
    // <>
    //   <Alert
    //     variant="danger"
    //     show={error !== ""}
    //     onClose={() => setError("")}
    //     dismissible
    //   >
    //     {error}
    //   </Alert>
    //   <Form action={login}>
    //     <InputGroup className="mb-3">
    //       <InputGroupText>
    //         {/* <FontAwesomeIcon fixedWidth /> */}
    //       </InputGroupText>
    //       <FormControl
    //         name="username"
    //         required
    //         disabled={submitting}
    //         aria-label="Username"
    //         defaultValue="Username"
    //       />
    //     </InputGroup>

    //     <InputGroup className="mb-3">
    //       <InputGroupText>
    //         {/* <FontAwesomeIcon fixedWidth /> */}
    //       </InputGroupText>
    //       <FormControl
    //         type="password"
    //         name="password"
    //         required
    //         disabled={submitting}
    //         // placeholder={password}
    //         aria-label="Password"
    //         defaultValue="Password"
    //       />
    //     </InputGroup>

    //     <Row className="align-items-center">
    //       <Col xs={6}>
    //         <Button
    //           className="px-4"
    //           variant="primary"
    //           type="submit"
    //           disabled={submitting}
    //         >
    //           login
    //         </Button>
    //       </Col>
    //       <Col xs={6} className="text-end">
    //         <Link className="px-0" href="#">
    //           forget password
    //         </Link>
    //       </Col>
    //     </Row>
    //   </Form>
    // </>
    <form action={login}>
      <div className="flex-1 rounded-lg  px-6 pb-4 pt-8 ">
        {/* <h1 className={`${lusitana.className} mb-3 text-2xl`}> */}
        <h1 className="mb-3 text-2xl">hhh.</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="phone"
            >
              Утасны дугаар
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border   py-[9px] pl-10 text-sm outline-2  "
                id="phone"
                type="phone"
                name="phone"
                placeholder="Enter your phone number."
                required
                disabled={submitting}
              />
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2   " />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium  "
              htmlFor="password"
            >
              Нууц үг
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border   py-[9px] pl-10 text-sm outline-2 "
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                disabled={submitting}
              />
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button
            type="submit"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            disabled={submitting}
          >
            Нэвтрэх
          </Button>
        </div>
        <div className="mt-4">
          <Link href="#">Forget password</Link>
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* {errorMessage && (
            <>
              <CircleAlert className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )} */}
        </div>
      </div>
    </form>
  );
}
