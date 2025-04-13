import { Facebook, Github } from "lucide-react";

export default function Footer() {
  return (
    <div className="sm:flex sm:items-center sm:justify-between mt-5 border-t-2 border-gray-600">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 m-5">
        © 2025{" "}
        <a href="https://flowbite.com/" className="hover:underline">
          Shur Yeruult
        </a>
        . All Rights Reserved.
      </span>
      <div className="flex mt-4 sm:justify-center sm:mt-0">
        <a
          href="https://www.facebook.com/people/Shur-Yeruult/pfbid0WRQ9mEkDxga9bwXpCq8aH4j7sbP6orEv3CVX1ngtV1ik69BtJS2ST1WYJvXH7LgBl/"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <Facebook />
          <span className="sr-only">Facebook </span>
        </a>

        <a
          href="https://github.com/Shur03/THES400"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
        >
          <Github />
          <span className="sr-only">GitHub account</span>
        </a>
      </div>
    </div>
  );
}
