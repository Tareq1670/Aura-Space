import type { Metadata } from "next";
import ProfilePage from "@/Components/Dashboard/Profile";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your host account profile and business information on AuraSpace.",
};


const HostPage = () => {
    return <ProfilePage />;
};

export default HostPage;
