import React from 'react'
import {Modal, Input, Form} from "antd";

interface UserFormProps {
    visible: boolean;
    onCancel: ()=> void;
    onOk: ()=> void;
    form: any;
    title: string;
    okText: string;
}

const UserForm:React.FC<UserFormProps> = ({
    visible,
    onCancel,
    onOk,
    form,
    title,
    okText,
}) => {
  return (
    <Modal title={title} okText={okText} open={visible} onCancel={onCancel} onOk={onOk}>
        <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: "Please enter the age" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter the address" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter the email" }]}
        >
          <Input type="email" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserForm