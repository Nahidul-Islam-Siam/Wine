import OrderHistorySection from '@/components/profile/OrderHistorySection';
import ProfileSection  from '@/components/profile/ProfileSection';
import ChangePasswordSection from '@/components/profile/ChangePasswordSection';
export default function CustomerProfilePage() {
  return (
    <div className="max-w-7xl space-y-8 py-10 px-4 bg-white mx-auto">
      <ProfileSection />
      <OrderHistorySection />
      <ChangePasswordSection />
    </div>
  );
}