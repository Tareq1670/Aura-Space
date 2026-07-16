import type { Metadata } from "next";
import ProfilePage from "@/Components/Dashboard/Profile";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your admin account profile and settings on AuraSpace.",
};


const AdminProfilePage = () => {
    return <ProfilePage />;
};

export default AdminProfilePage;
