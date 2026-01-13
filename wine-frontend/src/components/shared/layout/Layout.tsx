/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import logo from "@/assets/logo/logo.png";
import { Menu, MenuProps } from "antd";
import { Layout, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import AdminHeader from "../Navbar/DashboardHeader";

const { Content, Sider } = Layout;

export type MenuItem = Required<MenuProps>["items"][number];

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

interface AdminLayoutProps {
  children: ReactNode;
  menu: MenuItem[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, menu }) => {
  const [open, setOpen] = useState<boolean>(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const pathname = usePathname();

  const [selectedKey, setSelectedKey] = useState(pathname);

  // 🔥 FIX: Sync active menu based on URL
  useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);

  const handleClick = ({ key }: any) => {
    setSelectedKey(key);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        width={220}
        className={`!bg-white !overflow-y-auto !fixed lg:!static h-full z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        theme="dark"
        collapsed={false}
      >
        <Link
          href="/"
          className="flex justify-center items-center py-3 border-b border-[#ffffff1a]"
        >
          <Image className="w-[130px]" src={logo} alt="logo" />
        </Link>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleClick}
          items={menu}
          style={{
            backgroundColor: "#ffffff",
            fontWeight: "500",
          }}
          inlineIndent={16}
          rootClassName="custom-sidebar"
        />
      </Sider>

      <Layout>
        <AdminHeader
          open={open}
          setOpen={setOpen}
          colorBgContainer={colorBgContainer}
        />

        <Content
          className="!overflow-y-auto !overflow-x-hidden bg-[#F4F7FD] p-6"
          onClick={() => setOpen(false)}
          style={{ height: "100%" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
