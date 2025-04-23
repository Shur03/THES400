"use client";

import Login from "@/app/(authentication)/login/login";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import TreatmentList from "@/components/page/Treatment/TreatmentList";
import AddButton from "@/components/shared/buttons/addButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody } from "react-bootstrap";

interface UpcomingTreatment {
  id: string;
  treatment_name: string;
  freq_date: string;
  stock_type: string;
}

export default function Page() {
  const router = useRouter();
  const pageName = "Вакцинжуулалтын бүртгэл";
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Түр хүлээнэ үү...</span>
        </div>
        <p className="mt-2">Түр хүлээнэ үү</p>
      </div>
    );
  }
  if (!session) {
    return (
      <div>
        <Login />
      </div>
    );
  }
  return (
    <Card>
      <Header pageName={pageName} username={session.user?.name || "Guest"} />
      {/* <div className="col-sm-6 col-lg-4 w-2/5 bg-blue-200 text-gray-900 rounded-lg p-3 rounded-3 mt-5 ">
        <h5 className="text-primary mb-3 text-sm">Ойролцоох вакцинжуулалт</h5>

        {loadingUpcoming ? (
          <div className="text-center py-3">
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Ачааллаж байна...</span>
            </div>
          </div>
        ) : upcomingTreatments.length > 0 ? (
          <ListGroup variant="flush">
            {upcomingTreatments.map((treatment) => (
              <ListGroup.Item
                key={treatment.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{treatment.treatment_name}</strong>
                  <div className="text-muted small">
                    <Clock size={14} className="me-1" />
                    {new Date(treatment.freq_date).toLocaleDateString()}
                  </div>
                </div>
                <Badge bg="info">{treatment.stock_type}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-center py-3 text-muted text-sm text-gray-700">
            Ойролцоох вакцинжуулалт олдсонгүй
          </div>
        )}
      </div> */}
      <CardBody>
        <AddButton path="treatment" />
        <TreatmentList />
      </CardBody>
      <Footer />
    </Card>
  );
}
