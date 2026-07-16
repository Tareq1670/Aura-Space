import type { Metadata } from "next";
import ProfilePage from "@/Components/Dashboard/Profile";
import React from "react";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your account profile, personal information, and preferences on AuraSpace.",
};

const GuestProfilePage = () => {
    return <ProfilePage />;
};

export default GuestProfilePage;
