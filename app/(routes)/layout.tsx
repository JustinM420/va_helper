import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import HomeSidebar from "@/components/HomeSidebar";
import HomeNavbar from "@/components/HomeNavBar";

// Layout component
export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get userId from auth
  const { userId } = await auth();
  const isAuth: boolean = !!userId;

  // Fetch the first chat for the authenticated user
  let firstChat: string | null = null;
  if (isAuth && userId) {
    const chatData = await db.select().from(chats).where(eq(chats.userId, userId));
    if (chatData && chatData.length > 0) {
      firstChat = chatData[0].id.toString(); // Convert id to string
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10">
        <HomeNavbar />
      </header>

      {/* Content Area */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col">
          {/* Pass firstChat as a prop */}
          <HomeSidebar firstChat={firstChat} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-3 pl-1">
          {children}
        </main>
      </div>
    </div>
  );
}
