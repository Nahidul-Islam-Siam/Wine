"use client";
import logo from "@/assets/logo/logo.png";
import { Drawer, Space } from "antd";
import Image from "next/image";
import { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import NavMenu from "./NavMenu";

import { Accordion, AccordionItem } from "@nextui-org/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
const ForMobile = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex justify-between items-center px-3 lg:hidden">
      <Link href={"/"} className="">
        <div className="flex items-center gap-2 h-16 w-16">
          <Image
            src={logo}
            alt="Booksy.buzz"
            width={200}
            height={200}
            className="rounded object-contain"
          />
        </div>
      </Link>
      <div>
        <button onClick={showDrawer} className="mt-3 ml-3 p-1">
          <IoMenu size={25} />
        </button>
        <Drawer
          title="Menu"
          placement="left"
          width="85%"
          open={open}
          onClose={onClose}
          closeIcon={false}
          extra={
            <Space>
              <button onClick={onClose}>
                <IoClose className="hover:text-red-500 " size={25} />
              </button>
            </Space>
          }
        >
          <div className=" h-full flex flex-col justify-between  items-start">
            <div className=" w-full">
              <div onClick={onClose}>
                <div className=" w-full text-base">
                  <NavMenu className="flex-col mb-4" />
                  <div className="ps-1 ">
                    <Accordion isCompact>
                      <AccordionItem
                        key="1"
                        aria-label="Other Service"
                        title="Other Service"
                      >
                        <div className=" ps-1">
                          <Link href={"/gutters"}>
                            <div
                              className={cn(
                                "cursor-pointer hover:text-primary hover:bg-slate-100 p-2 mb-2 rounded transition duration-200"
                              )}
                            >
                              Gutter
                            </div>
                          </Link>{" "}
                          <Link href={"/commercial"}>
                            <div
                              className={cn(
                                "cursor-pointer hover:text-primary hover:bg-slate-100 p-2 mb-2 rounded transition duration-200"
                              )}
                            >
                              Commercial
                            </div>
                          </Link>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div className="ps-1 ">
                    <Accordion isCompact>
                      <AccordionItem
                        key="1"
                        aria-label="Pricing"
                        title="Pricing"
                      >
                        <div className=" ps-1">
                          <Link href={"/pricing-cost-calculator/roofing"}>
                            <div
                              // className="cursor-pointer hover:text-primary hover:bg-slate-100 p-2 mb-2 rounded"
                              className={cn(
                                "cursor-pointer hover:text-primary hover:bg-slate-100 p-2 mb-2 rounded transition duration-200"
                              )}
                            >
                              Roof Cost Calculator
                            </div>
                          </Link>
                          <Link href={"/pricing-cost-calculator/siding"}>
                            <div
                              // className="cursor-pointer hover:text-primary hover:bg-slate-100 p-2 rounded"
                              className={cn(
                                "cursor-pointer hover:text-primary hover:bg-slate-100 p-2 mb-2 rounded transition duration-200"
                              )}
                            >
                              Siding Cost Calculator
                            </div>
                          </Link>
                          <Link href={"/pricing-cost-calculator/window"}>
                            <div
                              // className="cursor-pointer hover:text-primary hover:bg-slate-100 p-2 rounded"
                              className={cn(
                                "cursor-pointer hover:text-primary hover:bg-slate-100 p-2 mb-2 rounded transition duration-200"
                              )}
                            >
                              Window Cost Calculator
                            </div>
                          </Link>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default ForMobile;