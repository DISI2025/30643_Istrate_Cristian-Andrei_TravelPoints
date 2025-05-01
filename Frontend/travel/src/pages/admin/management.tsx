import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Input, Layout, Modal, Form, notification } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./management.css";
import { Attraction } from "../../models/attractionEntity";
import {
  getAllAttractions,
  createAttraction,
  updateAttraction,
  deleteAttraction,
} from "../../api/attractionApi";

const { Header, Content } = Layout;

export default function Management() {
  const [data, setData] = useState<Attraction[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState<Attraction | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const allAttractions: Attraction[] = await getAllAttractions();
      setData(allAttractions);
    } catch (err) {
      notification.error({
        message: "Failed to load data",
        description: String(err),
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = (id: number, name: string) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete "${name}"?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteAttraction(id);
          notification.success({
            message: "Attraction deleted",
            description: `Successfully deleted attraction "${name}".`,
          });
          fetchData();
        } catch (err) {
          notification.error({
            message: "Failed to delete attraction",
            description: String(err),
          });
        }
      },
    });
  };

  const handleEdit = (item: Attraction) => {
    setEditingItem(item);
    setIsModalOpen(true);
    setTimeout(() => {
      form.setFieldsValue(item);
    }, 0);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
    setTimeout(() => {
      form.resetFields();
    }, 0);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      values.oldPrice = -1;
      if (editingItem) {
        await updateAttraction({
          ...values,
          id: editingItem.id,
          oldPrice: editingItem.oldPrice,
        });
        notification.success({ message: "Attraction updated successfully!" });
      } else {
        await createAttraction(values);
        notification.success({ message: "Attraction added successfully!" });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      // Validation failed
      console.warn("Validation Failed:", error);
      notification.warning({
        message: "Validation Error",
        description: "Please fill in all required fields correctly.",
      });
    }
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Attraction> = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Description Text", dataIndex: "descriptionText" },
    { title: "Description Audio", dataIndex: "descriptionAudio" },
    { title: "Location", dataIndex: "location" },
    { title: "Offers", dataIndex: "offers" },
    { title: "Category", dataIndex: "category" },
    { title: "Latitude", dataIndex: "latitude" },
    { title: "Longitude", dataIndex: "longitude" },
    { title: "Price", dataIndex: "price" },
    { title: "Old Price", dataIndex: "oldPrice" },
    {
      title: "Actions",
      render: (_, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id, record.name)}
          />
        </span>
      ),
    },
  ];

  return (
    <div className="managementPage">
      <Layout className="managementLayout">
        <Content className="managementContent">
          <div className="managementControls">
            <Input.Search
              placeholder="Search by name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="managementSearch"
            />
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              Add
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
          <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleSave}
            title={editingItem ? "Edit" : "Add"}
            okText={editingItem ? "Update" : "Create"}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="descriptionText"
                label="Description Text"
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="descriptionAudio"
                label="Description Audio"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="offers"
                label="Offers"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="latitude"
                label="Latitude"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="longitude"
                label="Longitude"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[
                  { required: true, message: "Price is required" },
                  {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Price must be a positive number")
                          ),
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </div>
  );
}
