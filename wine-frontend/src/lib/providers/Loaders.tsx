"use client"
import React from "react"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

export default function Loaders() {
  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: 40, color: "#A7997D" }}
      spin
    />
  )

  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <Spin indicator={antIcon} />
    </div>
  )
}
