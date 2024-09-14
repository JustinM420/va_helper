// page.tsx

import React from "react";
import ProfilePage from "@/components/ProfilePage";  // Import your ProfilePage component

const Profile = () => {
  return (
    <div className="h-full">
      <ProfilePage />  {/* Rendering the ProfilePage component */}
    </div>
  );
};

export default Profile;
