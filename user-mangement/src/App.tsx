import "./App.css";
import { Table, Button, Modal, message, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UserForm from "./components/UserForm";

interface User {
  _id: string;
  name: string;
  age: number;
  address: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingRecord, setEditingRecord] = useState<User | null>(null);
  const [addUser, setAddUser] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        message.error("Failed to load users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users.");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onDeleteUser = useCallback(
    async (record: User) => {
      Modal.confirm({
        title: "Are you sure you want to delete this record?",
        okType: "danger",
        okText: "Yes",
        onOk: async () => {
          try {
            const response = await axios.delete(
              `http://localhost:3000/users/${record._id}`
            );
            if (response.status === 200) {
              message.success("User deleted successfully");
              fetchUsers();
            } else {
              message.error("Failed to delete user.");
            }
          } catch (error) {
            console.error("Error deleting user:", error);
            message.error("Failed to delete user.");
          }
        },
      });
    },
    [fetchUsers]
  );

  const onUpdateUser = useCallback(
    (record: User) => {
      setIsUpdating(true);
      setEditingRecord(record);
      form.setFieldsValue(record);
    },
    [form]
  );

  const handleUpdate = useCallback(async () => {
    try {
      if (editingRecord) {
        const response = await axios.put(
          `http://localhost:3000/users/${editingRecord._id}`,
          form.getFieldsValue()
        );
        if (response.status === 200) {
          message.success("User updated successfully");
          setIsUpdating(false);
          fetchUsers();
        } else {
          message.error("Failed to update user.");
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user.");
    }
  }, [editingRecord, fetchUsers, form]);

  const handleAddUser = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/users",
        form.getFieldsValue()
      );
      if (response.status === 201) {
        message.success("User added successfully");
        setAddUser(false);
        fetchUsers();
      } else {
        message.error("Failed to add user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      message.error("Failed to add user.");
    }
  }, [fetchUsers, form]);

  const onAddUser = () => {
    setAddUser(true);
    form.resetFields();
  };

  const columns = [
    {
      key: "name",
      dataIndex: "name",
      title: "Name",
    },
    {
      key: "age",
      dataIndex: "age",
      title: "Age",
    },
    {
      key: "address",
      dataIndex: "address",
      title: "Address",
    },
    {
      key: "email",
      dataIndex: "email",
      title: "Email",
    },
    {
      key: "action",
      title: "Action",
      render: (record: User) => (
        <>
          <EditOutlined
            onClick={() => onUpdateUser(record)}
            style={{ cursor: "pointer" }}
          />
          <DeleteOutlined
            onClick={() => onDeleteUser(record)}
            style={{ color: "red", marginLeft: 24, cursor: "pointer" }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="mb-6 bg-white font-bold text-[#105cd7] shadow-md flex justify-center p-4 rounded-lg">
          <h1 className="text-[24px]">User Management System</h1>
        </div>
        <Button onClick={onAddUser} type="primary" className="mb-4 flex">
          Add User
        </Button>
        <Table dataSource={users} columns={columns} rowKey="_id" />
        <UserForm
          visible={addUser}
          onCancel={() => setAddUser(false)}
          onOk={handleAddUser}
          form={form}
          title="Add new user"
          okText="Add user"
        />
        <UserForm
          visible={isUpdating}
          onCancel={() => setIsUpdating(false)}
          onOk={handleUpdate}
          form={form}
          title="Edit User Details"
          okText="Update"
        />
      </div>
    </>
  );
}

export default App;
