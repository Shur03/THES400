"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { useRouter } from "next/navigation";
import StockType from "@/models/StockType";
import StockTypeMap from "@/models/StockTypeMap";

interface Stock {
  stock_type: string;
  id: number;
  type: string;
}

interface VaccineNotification {
  id: number;
  treatment_name: string;
  freq_date: string;
  stock: Stock;
}

const STOCK_TYPES = Object.entries(StockType).map(([id, name]) => ({
  id: parseInt(id),
  name,
}));

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<VaccineNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const response = await fetch("/api/notifications");

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from closing
    // Add any item click logic here
  };

  return (
    <Dropdown
      onToggle={(isOpen) => setIsOpen(isOpen)}
      autoClose="outside" // This prevents closing when clicking inside
    >
      <Dropdown.Toggle as="div" id="notification-dropdown">
        <button
          className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Мэдэгдэл"
        >
          <Bell
            className={`text-gray-700 transition-transform ${
              isOpen ? "animate-bell" : ""
            }`}
            size={20}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="w-80 p-0 shadow-xl border border-gray-200 rounded-lg overflow-hidden bg-white"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking menu
      >
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-600" size={18} />
              <h6 className="m-0 font-semibold text-gray-800">
                Маргааш хийгдэх вакцинууд
              </h6>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {notifications.length} шинэ
            </span>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-6 flex flex-col items-center justify-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-sm">Мэдэгдлийг ачааллаж байна...</span>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <Dropdown.Item
                key={notification.id}
                as="div" // Use as="div" to have more control over click behavior
                className="px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={handleItemClick}
              >
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle className="text-yellow-500" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 font-medium text-gray-900">
                      {notification.treatment_name}
                    </p>
                    <p className="mb-1 text-xs text-gray-600">
                      <span className="font-medium">Мал:</span>{" "}
                      {notification.stock?.stock_type && (
                        <span className="text-gray-700">
                          {StockTypeMap[notification.stock.stock_type] ??
                            notification.stock.stock_type}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} className="text-gray-400" />
                      <span>
                        {new Date(notification.freq_date).toLocaleDateString(
                          "mn-MN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </Dropdown.Item>
            ))
          ) : (
            <div className="p-6 flex flex-col items-center justify-center gap-3 text-gray-400">
              <CheckCircle className="text-green-300" size={28} />
              <span className="text-sm text-center">
                Маргааш хийгдэх вакцин байхгүй байна
              </span>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 bg-gray-50 border-t">
            <button
              className="w-full py-2 px-4 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/treatment");
              }}
            >
              Бүх вакцинуудыг харах
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
