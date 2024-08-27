import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/fileUpload";
import { LogInIcon, ArrowRight } from "lucide-react";

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import Link from "next/link";

export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;

  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-r from-teal-200 to-lime-200">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center">
          <h1 className="mr-3 text-5xl font-semibold">
            Get Help With Your VA Claim Decision Letter
          </h1>
        </div>

        <div className="flex mt-2">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <div className="mt-2 ml-2"><UserButton /></div>
              </>
            )}
          </div>
        <p className="max-w-xl mt-1 text-lg text-slate-500">
          Upload your decision letter to get help understanding the results and to know what you need to do next.
        </p>
        <div className="w-full mt-4">
          {isAuth ? (
            <FileUpload />
          ) : (
            <Link href="/sign-in">
              <Button>
                Login to get Started <LogInIcon className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
