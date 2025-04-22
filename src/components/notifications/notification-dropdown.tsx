"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import Link from "next/link";

interface Stock {
  id: number;
  name: string;
  type: string;
}

interface VaccineNotification {
  id: number;
  treatment_name: string;
  freq_date: string;
  stock: Stock;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<VaccineNotification[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Dropdown>
      <Dropdown.Toggle as="div" id="notification-dropdown">
        <button
          className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          title="Мэдэгдэл"
        >
          <Bell className="text-gray-800" size={20} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
              {notifications.length}
            </span>
          )}
        </button>
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-80">
        <div className="p-3 border-b">
          <h6 className="m-0">Маргааш хийгдэх вакцинууд</h6>
        </div>
        <div style={{ maxHeight: "320px", overflowY: "auto" }}>
          {loading ? (
            <div className="p-3 text-center">Ачааллаж байна...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <Dropdown.Item key={notification.id} className="border-bottom">
                <div>
                  <p className="mb-1 font-weight-bold">
                    {notification.treatment_name}
                  </p>
                  <p className="mb-1 small text-muted">
                    Мал: {notification.stock.name} ({notification.stock.type})
                  </p>
                  <p className="mb-0 small text-muted">
                    Огноо:{" "}
                    {new Date(notification.freq_date).toLocaleDateString()}
                  </p>
                </div>
              </Dropdown.Item>
            ))
          ) : (
            <div className="p-3 text-center text-muted">
              Маргааш хийгдэх вакцин байхгүй байна
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-top">
            <Link href="/medical-records" className="d-block">
              <button className="btn btn-outline-secondary btn-sm w-100">
                Бүх вакцинуудыг харах
              </button>
            </Link>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
