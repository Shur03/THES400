import SideNav from "@/components/shared/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-52 bg-gray-800">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto bg-white">{children}</div>
    </div>
  );
}
