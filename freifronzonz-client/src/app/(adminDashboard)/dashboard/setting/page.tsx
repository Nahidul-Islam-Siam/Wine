
import AddSocialMediaLink from "@/components/Dashboard/Setting/AddSocialMediaLink";
import ChangePassword from "@/components/Dashboard/Setting/ChangePasswordForm";
import UserProfile from "@/components/Dashboard/Setting/UserProfile";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FD]  p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-[#482817] md:text-3xl text-2xl font-extrabold font-abhaya">
          {" "}
          Profile Setting
        </h1>
        <UserProfile />
        <AddSocialMediaLink/>

        <ChangePassword />
      </div>
    </div>
  );
}
