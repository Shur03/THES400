import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import Login from "@/app/(authentication)/login/login";

export default async function Page() {
  return (
    <Row className="justify-content-center w-1/2 items-center rounded-xl">
      <Col md={6}>
        <Card className=" rounded-0">
          <CardBody className="p-4 text-gray-900">
            <div className=" justify-center">
              <Login />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
