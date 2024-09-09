import React from "react";
import ClaimsCard from "@/components/dashboard/ClaimsCard";
import RatingCard from "@/components/dashboard/RatingCard";
import FileUploadCard from "@/components/dashboard/FileUploadCard"; // Import the new FileUploadCard

const HomePage = () => {
  const claims = [
    { id: '1', status: 'Under Review', claimNumber: '12345', date: '2024-01-01', isCompleted: false },
    { id: '2', status: 'Awaiting Documents', claimNumber: '67890', date: '2024-02-15', isCompleted: false },
    { id: '3', status: 'Approved', claimNumber: '54321', date: '2024-03-01', isCompleted: true },
    { id: '4', status: 'Denied', claimNumber: '98765', date: '2024-04-10', isCompleted: true },
  ];

  const disabilityRating = 70;
  const monthlyCompensation = 2100.00;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Your Veteran&apos;s Benefits Dashboard</h1>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ClaimsCard takes up 3/4 */}
        <div className="lg:col-span-3">
          <ClaimsCard claims={claims} />
        </div>
        
        {/* Right side with 1/4 span */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* RatingCard */}
          <RatingCard disabilityRating={disabilityRating} monthlyCompensation={monthlyCompensation} />
          
          {/* FileUploadCard fits below RatingCard */}
          <FileUploadCard />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
