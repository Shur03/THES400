import FodderForm from "@/components/forms/FodderForm";
import { Card, CardBody, CardHeader } from "react-bootstrap";

export default function Page() {
  return (
    <div className="mx-5 bg-blue-300 rounded-lg">
      <Card>
        <CardHeader className="text-gray-800">
          Өвс тэжээллийн мэдээлэл нэмэх
        </CardHeader>
        <CardBody>
          <FodderForm types={[]} />
        </CardBody>
      </Card>
    </div>
  );
}
