import NavLinks from "./nav-links";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-[url(/img/bgImg.jpg)] bg-cover bg-center bg-no-repeat">
      <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 md:mt-2">
        <NavLinks />
        <div className="h-auto w-full grow rounded-md md:block"></div>

        <h1>hh</h1>
      </div>
    </div>
  );
}
