import React from "react";
import ClaimsCard from "@/components/dashboard/ClaimsCard";
import RatingCard from "@/components/dashboard/RatingCard";
import FileUploadCard from "@/components/dashboard/FileUploadCard";
import PendingForms from "@/components/dashboard/PendingForms";
import RecentChats from "@/components/dashboard/RecentChats";
import Notifications from "@/components/dashboard/Notifications";

const HomePage = () => {
  const claims = [
    { id: '1', status: 'Under Review', claimNumber: '12345', date: '2024-01-01', isCompleted: false },
    { id: '2', status: 'Awaiting Documents', claimNumber: '67890', date: '2024-02-15', isCompleted: false },
    { id: '3', status: 'Approved', claimNumber: '54321', date: '2024-03-01', isCompleted: true },
    { id: '4', status: 'Denied', claimNumber: '98765', date: '2024-04-10', isCompleted: true },
  ];

  const disabilityRating = 70;
  const monthlyCompensation = 2100.00;

  const forms = [
    { id: 'form1', title: 'Form 1234', dueDate: '2024-03-01' },
    { id: 'form2', title: 'Form 5678', dueDate: '2024-03-15' },
  ];

  const chats = [
    { id: 'chat1', pdfName: 'Decision Letter', status: 'In Progress' },
    { id: 'chat2', pdfName: 'Medical Report', status: 'Completed' },
  ];

  const notifications = [
    { id: 'notif1', message: 'Your claim #12345 is under review.', link: '/claims/12345' },
    { id: 'notif2', message: 'New document request for claim #67890.', link: '/claims/67890' },
  ];

  return (
    <div className="flex flex-col h-screen p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Your Veteran&apos;s Benefits Dashboard</h1>

      {/* Top row: Notifications, RatingCard, FileUploadCard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
        <Notifications notifications={notifications} />
        <RatingCard disabilityRating={disabilityRating} monthlyCompensation={monthlyCompensation} />
        <FileUploadCard />
      </div>

      {/* Middle row: ClaimsCard with full width */}
      <div className="flex-grow mt-8">
        <ClaimsCard claims={claims} />
      </div>

      {/* Bottom row: PendingForms and RecentChats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-shrink-0 mt-8">
        <PendingForms forms={forms} />
        <RecentChats chats={chats} />
      </div>
    </div>
  );
};

export default HomePage;
