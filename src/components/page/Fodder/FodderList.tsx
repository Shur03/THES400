import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import THSort from "@/components/TableSort/THSort";
import { FodderStock } from "@/models/Fodder";

export default function FodderList() {
  const [fodders, setFodders] = useState<FodderStock[]>([]);

  useEffect(() => {
    // Fetch data from the correct API route
    fetch("/api/fodders") // Changed to the correct API endpoint
      .then((res) => res.json())
      .then((data) => setFodders(data))
      .catch((error) => console.error("Error fetching fodder data:", error));
  }, []);

  return (
    (fodders.length === 0 && (
      <div className="text-gray-900">Мэдээлэл байхгүй байна</div>
    )) || ( // Display a message if there is no data
      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>№</th>
            <th>Төрөл</th>
            <th>
              <THSort name="counts">Тоо</THSort>
            </th>
            <th className="text-end">
              <THSort name="weight">Жин</THSort>
            </th>
            <th className="text-end">
              <THSort name="price">Үнэ</THSort>
            </th>
            <th className="text-end">Худалдан авсан өдөр</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {fodders.map((fodder) => (
            <tr key={fodder.id}>
              <td>{fodder.id}</td>
              <td className="text-bold">{fodder.types}</td>
              <td className="text-bold">{fodder.types}</td>
              <td className="text-end">
                {/* {new Date(fodder.buyDate).toLocaleDateString()} */}
              </td>
              <td>
                <Dropdown align="end">
                  <DropdownToggle
                    as="button"
                    bsPrefix="btn"
                    className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                    id={`action-${fodder.id}`}
                  >
                    {/* <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} /> */}
                  </DropdownToggle>

                  <DropdownMenu>
                    <DropdownItem href="#/action-1">Дэлгэрэнгүй</DropdownItem>
                    <Link href={`/fodder/${fodder.id}/edit`} passHref>
                      <DropdownItem>Засах</DropdownItem>
                    </Link>
                    <DropdownItem className="text-danger" href="#/action-3">
                      Устгах
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  );
}
