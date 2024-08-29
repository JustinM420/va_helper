import HomeSidebar from "@/components/HomeSidebar";
import HomeNavbar from "@/components/HomeNavBar";

const HomeLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10">
        <HomeNavbar />
      </header>

      {/* Content Area */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-gray-900">
          <HomeSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
