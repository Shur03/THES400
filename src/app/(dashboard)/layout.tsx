"use client";
import SideNav from "@/components/shared/dashboard/sidenav";
import { signIn, useSession } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";

// Ensure NextTopLoader is configured properly
<NextTopLoader color="blue-700" height={3} showSpinner={false} />;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  // if (!session) {
  //   return (
  //     <div>
  //       <button className="bg-blue-400 text-gray-900" onClick={() => signIn()}>
  //         Нэвтрэх
  //       </button>
  //     </div>
  //   );
  // }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-52 bg-gray-800">
        <SideNav />
      </div>

      {/* <Header username={session.user?.name } /> */}
      <NextTopLoader />
      <div className="grow p-6 md:overflow-y-auto bg-white">{children}</div>
    </div>
  );
}
