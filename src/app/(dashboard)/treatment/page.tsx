"use client";

import Login from "@/app/(authentication)/login/login";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import TreatmentList from "@/components/page/Treatment/TreatmentList";
import AddButton from "@/components/shared/buttons/addButton";
import { MedicalRecord } from "@/models/MedicalRecord";
import { CalendarCheck, Clock, Syringe } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const [upcomingTreatments, setUpcomingTreatments] = useState<MedicalRecord[]>(
    []
  );
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
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
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CalendarCheck className="text-blue-500" size={20} />
            Ойролцоох вакцинжуулалт
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {upcomingTreatments.length} шинэ
          </span>
        </div>

        {loadingUpcoming ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-2"></div>
            <span className="text-sm text-gray-500">Ачааллаж байна...</span>
          </div>
        ) : upcomingTreatments.length > 0 ? (
          <div className="space-y-3">
            {upcomingTreatments.map((treatment) => (
              <div
                key={treatment.id}
                className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Syringe className="text-blue-600" size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {treatment.treatment_name}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1" size={14} />
                    <span>
                      {treatment.freq_date
                        ? new Date(treatment.freq_date).toLocaleDateString(
                            "mn-MN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Огноо байхгүй"}
                    </span>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {treatment.stock?.stock_type}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <CalendarCheck className="mb-2" size={24} />
            <p className="text-sm">Ойролцоох вакцинжуулалт олдсонгүй</p>
          </div>
        )}
      </div>
      <CardBody>
        <AddButton path="treatment" />
        <TreatmentList />
      </CardBody>
      <Footer />
    </Card>
  );
}
