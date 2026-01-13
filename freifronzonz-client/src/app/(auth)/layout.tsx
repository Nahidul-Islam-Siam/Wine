"use client";

import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen overflow-hidden bg-[#F7F7F7]">
      <div className="h-[100vh] overflow-y-auto">{children}</div>
    </div>
  );
};

export default layout;
