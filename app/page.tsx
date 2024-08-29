import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Header from "@/components/HeaderNav";
import Footer from "@/components/FooterNav";
import FileUpload from "@/components/fileUpload";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import Image from "next/image";

// Define the types for chat and auth
interface Chat {
  id: number; // or string, based on your actual database schema
  userId: string;
  pdfName: string;
  pdfUrl: string;
  createdAt: Date;
  fileKey: string;
}

export default async function Lander() {
  // Get userId from auth
  const { userId } = await auth();
  const isAuth: boolean = !!userId;

  // Fetch the first chat for the authenticated user
  let firstChat: { id: string } | null = null;
  if (isAuth && userId) {
    const chatData = await db.select().from(chats).where(eq(chats.userId, userId));
    if (chatData && chatData.length > 0) {
      firstChat = { id: chatData[0].id.toString() }; // Convert id to string
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Component */}
      <Header isAuth={isAuth} firstChat={firstChat} />

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white via-sky-500 to-sky-500">
        <div className="flex flex-col items-center text-center px-6 md:px-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Get the Support You Need for Your VA Claim
          </h1>
          <p className="max-w-2xl mt-6 text-lg md:text-2xl text-white">
            Upload your VA decision letter and let VACAx guide you through understanding the results and your next steps.
          </p>
          <div className="w-full mt-8">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button 
                className="text-white rounded-lg px-8 py-3 shadow-lg"
                variant="default"
                >
                  Login to Get Started <LogInIcon className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* For Veterans Section */}
      <section id="for-veterans" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Support for Veterans
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            At VACAx, we understand the challenges veterans face when dealing with VA claims. 
            Our platform simplifies the process, offering step-by-step guidance and support to help you navigate your claims with confidence.
          </p>
          
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Guidance on VA Claims</h3>
              <p className="text-gray-600">
                Get detailed instructions on how to submit and track your VA claims, ensuring you&apros;re on the right path.
              </p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Personalized Support</h3>
              <p className="text-gray-600">
                Receive personalized assistance tailored to your unique situation, making the process smoother and more efficient.
              </p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Resource Library</h3>
              <p className="text-gray-600">
                Access a library of resources specifically curated to help veterans understand their rights and benefits.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <Link href="/sign-up">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-8 py-3 shadow-lg">
                Get Started For Free <LogInIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section id="for-vsos" className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Support for VSO&apos;s
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            VACAx provides Veterans Service Organizations with the tools and resources they need to assist veterans in navigating their VA claims. Our platform is designed to enhance your ability to serve veterans effectively and efficiently.
          </p>
          
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Comprehensive Training</h3>
              <p className="text-gray-600">
                Access training materials that help your team stay up-to-date on the latest VA policies and procedures.
              </p>
            </div>
            <div className="bg-gray-100 shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Advanced Tools</h3>
              <p className="text-gray-600">
                Utilize advanced tools to streamline the claims process and ensure that no detail is overlooked.
              </p>
            </div>
            <div className="bg-gray-100 shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Collaboration Features</h3>
              <p className="text-gray-600">
                Work seamlessly with other VSO&apos;s and veterans through our collaborative features, making it easier to provide comprehensive support.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <Link href="/get-started">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-8 py-3 shadow-lg">
                Get Started For Free <LogInIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section id="about" className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center">
          
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/vaca-logo.png"  // Adjust the path if needed
              alt="VACAx Logo"
              width={100}  // Adjust size as needed
              height={100}
              className="mx-auto"
            />
          </div>

          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            About VACAx
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            VACAx is a non-profit organization founded by two Service-Disabled Veterans who have both experienced the VA claims process firsthand. With one founder having worked with or for the VA for years, both as a Veterans Service Representative in processing and as a Veteran Service Officer. We understand the challenges veterans face when filing claims and the complexities involved in the process.
          </p>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Our mission is simple: to keep this platform free for veterans forever and to help both veterans and the VA. By helping veterans file better claims faster, we aim to reduce the backlog caused by improperly filled-out forms, making the process smoother for everyone.
          </p>
          
          {/* Call to Action */}
          <div className="mt-12">
          <a href="mailto:info@vacax.org?subject=I want to get involved with VACAx&body=Please let us know how you would like to contribute!" target="_blank" rel="noopener noreferrer">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-8 py-3 shadow-lg">
              Get Involved
            </Button>
          </a>
          </div>
        </div>
      </section>


      {/* Footer Component */}
      <Footer />
    </div>
  );
}
