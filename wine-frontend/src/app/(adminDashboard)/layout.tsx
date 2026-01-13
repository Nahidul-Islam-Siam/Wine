import SuperAdminLayout from "@/components/shared/layout/admin-dashboard-layout/AdminLayout";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="admin-root">
      <SuperAdminLayout>{children}</SuperAdminLayout>
    </div>
  );
};

export default layout;
