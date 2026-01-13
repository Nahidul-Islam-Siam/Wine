// app/(adminDashboard)/layout.tsx

"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";

// Lucide Icons
import { 
  LayoutDashboard, 
  ListOrdered, 
  Package, 
  CalendarClock, 
  Wallet, 
  Users, 
  // MessageCircle, 
  Settings, 
  LogOut,
  PlusCircle,     // for "Add Brand"
  Tag,            // for "Product Categories"
  User,
  Wine,           // for "Profile Management"
} from "lucide-react";

import { getItem, MenuItem } from "../Layout";

const navItems: MenuItem[] = [
  getItem(
    <Link href="/dashboard">Dashboards</Link>,
    "/dashboard",
    <LayoutDashboard className="text-xl" />
  ),
  getItem(
    <Link href="/dashboard/order-list">Order List</Link>,
    "/dashboard/order-list",
    <ListOrdered className="text-xl" />
  ),
  getItem(
    <Link href="/dashboard/add-brand">Add Brand</Link>,
    "/dashboard/add-brand",
    <PlusCircle className="text-xl" />
  ),
  getItem(
    <Link href="/dashboard/add-bottle">Add Bottle</Link>,
    "/dashboard/add-bottle",
    <Wine className="text-xl" />
  ),
  getItem(
    <Link href="/dashboard/product-categories">Product Categories</Link>,
    "/dashboard/product-categories",
    <Tag className="text-xl" />
  ),
  getItem(
    <Link href="/dashboard/all-product">All Product</Link>,
    "/dashboard/all-product",
    <Package className="text-xl" />
  ),
  getItem(
    <Link href="/dashboard/event">Events</Link>,
    "/dashboard/event",
    <CalendarClock className="text-xl" />
  ),
  getItem(
    <Link href="/dashboard/payment-list">Payment List</Link>,
    "/dashboard/payment-list",
    <Wallet className="text-xl" />
  ),
  getItem(
    <Link href="/dashboard/user">User</Link>,
    "/dashboard/user",
    <Users className="text-xl" />
  ),
  // getItem(
  //   <Link href="/dashboard/contact-request">Contact Request</Link>,
  //   "/dashboard/contact-request",
  //   <MessageCircle className="text-xl" />
  // ),
  getItem(
    <Link href="/dashboard/profile-management">Profile Management</Link>,
    "/dashboard/profile-management",
    <User className="text-xl" />
  ),
  getItem(
    <Link href="/dashboard/setting">Setting</Link>,
    "/dashboard/setting",
    <Settings className="text-xl" />
  ),
  getItem(
    <Link href="/auth/logout">Log out</Link>,
    "/auth/logout",
    <LogOut className="text-xl" />
  ),
];

const SuperAdminLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default SuperAdminLayout;