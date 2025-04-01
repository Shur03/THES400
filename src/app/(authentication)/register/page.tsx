import { Card, CardBody, Col, Row } from "react-bootstrap";
import Register from "@/app/(authentication)/register/register";

export default async function Page() {
  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card className="mb-4 rounded-0">
          <CardBody className="p-4">
            <h1>Бүртгүүлэх</h1>
            <p className="text-black-50 dark:text-gray-500">
              Шинээр бүртгэл үүсгэх
            </p>
            <Register />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
