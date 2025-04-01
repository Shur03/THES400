import { Col, Row } from "react-bootstrap";
import { SearchParams } from "@/types/next";
import Login from "@/app/(authentication)/login/login";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { callbackUrl } = searchParams;

  const getCallbackUrl = () => {
    if (!callbackUrl) {
      return "/"; // Default redirect to home page
    }

    return callbackUrl.toString();
  };

  // const session = await auth();
  // if(session) redirect('/');
  return (
    <Row className="justify-content-center align-items-center px-3">
      <Col lg={8}>
        <Row>
          <Col md={7} className="bg-white dark:bg-dark border p-5">
            <div>
              <Login callbackUrl={getCallbackUrl()} />
              {/* <Login/> */}
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
