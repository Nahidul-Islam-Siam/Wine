"use client"

import type React from "react"
import { Modal, Row, Col, Table,  Divider } from "antd"
import type { ColumnsType } from "antd/es/table"
import avatar from "@/assets/avatar/avatar2.png"
import Image from "next/image"
//
// ---------- INTERFACES ----------
//

export interface User {
  name: string
  email: string
  phone?: string
  gender?: string
  preference?: string
  address?: string
  goal?: string
}

export interface Order {
  key: string
  date: string
  subscription: string
  totalCredit: number
  completeClass: number
  remainingCredit: number
}

export interface UserDetailsModalProps {
  visible: boolean
  onCancel: () => void
  user: User | null
}

//
// ---------- COMPONENT ----------
//

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ visible, onCancel, user }) => {
  if (!user) return null

  //
  // Dummy Orders
  //
  const orders: Order[] = [
    {
      key: "1",
      date: "12/12/2025",
      subscription: user.name.includes("Wilson") ? "Signature Experiences" : "Signature Experiences",
      totalCredit: 4,
      completeClass: 3,
      remainingCredit: 1,
    },
    {
      key: "2",
      date: "12/12/2025",
      subscription: "Signature Experiences",
      totalCredit: 4,
      completeClass: 3,
      remainingCredit: 1,
    },
    {
      key: "3",
      date: "12/12/2025",
      subscription: "Hot Yoga",
      totalCredit: 1,
      completeClass: 1,
      remainingCredit: 0,
    },
  ]

  //
  //
  const columns: ColumnsType<Order> = [
    {
      title: "Order date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Subscription",
      dataIndex: "subscription",
      key: "subscription",
    },
    {
      title: "Total Credit",
      dataIndex: "totalCredit",
      key: "totalCredit",
    },
    {
      title: "Complete Class/Session",
      dataIndex: "completeClass",
      key: "completeClass",
    },
    {
      title: "Remaining Credit",
      dataIndex: "remainingCredit",
      key: "remainingCredit",
    },
  ]

  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onCancel}
      width={900}
footer={null}
      styles={{
        header: {
          textAlign: "center",
          paddingBottom: "16px",
          backgroundColor: "white",
        },
        body: {
          padding: "24px",
        },
      }}
    >
      <Row gutter={24} style={{ marginBottom: "32px" }}>
        <Col span={24}>
          <Row gutter={24}>
            <Col span={8}>
             <Image src={avatar} alt="Avatar" width={400} height={400}/>
            </Col>
            <Col span={16}>
              <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem" }}>{user.name}</h2>
              <p style={{ margin: "0 0 16px 0", color: "#666" }}>Customer ID: ID (e.g., CUST-1029)</p>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <InfoField label="Email" value={user.email} />
                </Col>
                <Col span={12}>
                  <InfoField label="Phone Number" value={user.phone ?? "+8801712345678"} />
                </Col>
                <Col span={12}>
                  <InfoField label="Gender" value={user.gender ?? "Female"} />
                </Col>
                <Col span={12}>
                  <InfoField label="Preference to experience" value={user.preference ?? "Indoor"} />
                </Col>
                <Col span={12}>
                  <InfoField label="Address" value={user.address ?? "B286-co, Ak-de-de Skyris, Dhaka, Boulders"} />
                </Col>
                <Col span={12}>
                  <InfoField label="Goal" value={user.goal ?? "Strengthen my body and calm my mind"} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <Divider />

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "16px",color:"#A7997D" }}>Order Summary</h3>
        <Table columns={columns} dataSource={orders} pagination={false} size="small" rowHoverable={true} />
      </div>
    </Modal>
  )
}

//
// Reusable Field Component
//
const InfoField = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => (
  <div>
    <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#999" }}>{label}</p>
    <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 500 }}>{value}</p>
  </div>
)

export default UserDetailsModal
