import { Col, Row } from "react-bootstrap";
import Login from "@/app/(authentication)/login/login";

export default async function Page() {
  // const session = await auth();
  // if(session) redirect('/');
  return (
    <Row className="justify-content-center align-items-center px-3">
      <Col lg={8}>
        <Row>
          <Col md={7} className="bg-white dark:bg-dark border p-5">
            <div>
              <Login />
              {/* <Login/> */}
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
