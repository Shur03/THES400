"use client";

import FodderChart from "@/components/charts/FodderChart";
import FodderList from "@/components/lists/FodderList";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";

export default function Index() {
  const router = useRouter();
  /* <FodderChart/>  */
  return (
    <Card>
      <Card.Header>Fodder List</Card.Header>
      <div className="col-sm-6 col-lg-4 bg-blue-300 text-gray-900 d">
        <Card>
          <CardBody className="pb-0 d-flex justify-content-between align-items-start">
            <div className="h-1/2 rounded-lg">
              <FodderChart />
            </div>
            <Dropdown align="end">
              <DropdownToggle
                as="button"
                bsPrefix="btn"
                className="btn-link rounded-0 text-white shadow-none p-0"
                id="dropdown-chart2"
              >
                {/* <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} /> */}
              </DropdownToggle>

              <DropdownMenu>
                <DropdownItem href="#/action-1">Дэлгэрэнгүй</DropdownItem>
                <DropdownItem href="#/action-2">Засах</DropdownItem>
                <DropdownItem href="#/action-3">Устгах</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardBody>
          <div className="mt-3 mx-3" style={{ height: "70px" }}>
            {/* <FodderChart /> */}
          </div>
        </Card>
      </div>
      <CardBody>
        <div className="mb-3 text-end pt-5">
          <Button
            variant="success"
            className="text-white bg-green-400 rounded-lg p-2 "
            onClick={() => router.push("/fodder/create")}
          >
            + Бүртгэл нэмэх
          </Button>
        </div>

        <FodderList />
      </CardBody>
    </Card>
  );
}
