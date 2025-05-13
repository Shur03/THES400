"use client";

import Login from "@/app/(authentication)/login/login";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import TreatmentList from "@/components/page/Treatment/TreatmentList";
import AddButton from "@/components/shared/buttons/addButton";
import { MedicalRecord } from "@/models/MedicalRecord";
import StockTypeMap from "@/models/StockTypeMap";
import { CalendarCheck, Clock, Syringe } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Page() {
  const [upcomingTreatment, setUpcomingTreatment] =
    useState<MedicalRecord | null>(null);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const { data: session, status } = useSession();
  const pageName = "Вакцинжуулалтын бүртгэл";

  useEffect(() => {
    const fetchUpcomingTreatment = async () => {
      try {
        setLoadingUpcoming(true);
        const response = await fetch("/api/treatments/upcoming");

        if (!response.ok) {
          throw new Error("Failed to fetch upcoming treatment");
        }

        const data = await response.json();
        setUpcomingTreatment(data);
      } catch (err) {
        console.error("Error fetching upcoming treatment:", err);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    if (session?.user?.id) {
      fetchUpcomingTreatment();
    }
  }, [session]);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const response = await fetch("/api/stock/sum");
        if (!response.ok) {
          throw new Error("Failed to fetch total count");
        }
        const data = await response.json();
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error("Error fetching total count:", err);
        setTotalCount(null);
      }
    };

    fetchTotalCount();
  }, []);

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
    <div>
      <Header pageName={pageName} username={session.user?.name || "Guest"} />
      <div className="flex flex-col lg:flex-row gap-5 mb-5">
        {/* Upcoming Treatment Section */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CalendarCheck className="text-blue-600" size={20} />
              Ойролцоох вакцинжуулалт
            </h3>
          </div>

          {loadingUpcoming ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-blue-200 border-t-blue-500 mb-3"></div>
              <span className="text-sm text-gray-400">Ачааллаж байна...</span>
            </div>
          ) : upcomingTreatment ? (
            <div className="space-y-3">
              <div className="flex items-start p-4 bg-gradient-to-r from-blue-50/50 to-white rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-200">
                <div className="bg-blue-100/80 p-2.5 rounded-lg mr-3 flex-shrink-0">
                  <Syringe className="text-blue-600" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1.5 truncate">
                    {upcomingTreatment.treatment_name ||
                      upcomingTreatment.stock?.stock_type ||
                      "Вакцинжуулалт"}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1.5" size={14} />
                    <span>
                      {upcomingTreatment.freq_date
                        ? new Date(
                            upcomingTreatment.freq_date
                          ).toLocaleDateString("mn-MN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Огноо тодорхойгүй"}
                    </span>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full ml-2 whitespace-nowrap">
                  {upcomingTreatment.stock?.stock_type &&
                    (StockTypeMap[upcomingTreatment.stock.stock_type] ??
                      upcomingTreatment.stock.stock_type)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-300">
              <CalendarCheck className="mb-3 opacity-60" size={28} />
              <p className="text-sm text-gray-400">
                Ойролцоох вакцинжуулалт олдсонгүй
              </p>
              <span>
                Нийт: {totalCount !== null ? totalCount : "Ачааллаж байна..."}
              </span>
            </div>
          )}
        </div>

        {/* Total Count Section */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md hover:border-blue-100 group">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <span className="group-hover:text-blue-600 transition-colors text-sm">
                Вакцинд хамрагдаагүй
              </span>
            </h3>
            <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
              {totalCount !== null ? totalCount - 1000 : "N/A"}
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Нийт: {totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-400 h-1.5 rounded-full"
                style={{
                  width: `${totalCount ? (1000 / totalCount) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment List */}
      <div>
        <AddButton path="treatment" />
        <TreatmentList />
      </div>
      <Footer />
    </div>
  );
}
