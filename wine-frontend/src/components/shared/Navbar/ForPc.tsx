"use client";
import logo from "@/assets/logo/logo.png";
import MyButton from "@/components/ui/MyButton/MyButton";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import NavMenu from "./NavMenu";


const ForPc = () => {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto hidden lg:flex py-3 items-center justify-between ">
        <Link href={"/"}>
          <div className="flex items-center gap-2 h-full -ml-4 w-48">
            <Image
              src={logo}
              alt="Dentistul.ro"
              width={400}
              height={400}
              className="rounded object-contain"
            />
          </div>
        </Link>
        <div className="flex  items-center gap-5 text-base text-[#808080]">
          <NavMenu/>
        </div>

        <div className="space-x-5 space-y-5">
          <MyButton title="Do you have clinic?" className="rounded-lg" />
          <Link href={"/login"}>
            <Button
              icon={<FaUserCircle />}
              className="bg-transparent text-white"
            >
              Signin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForPc;