import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Input, Layout, Modal, Form, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './management.css';
import {Attraction} from '../../models/attractionEntity'
import {attractions} from './mockDataAttractions';

const { Header, Content } = Layout;


export default function Management() {
    const [data, setData] = useState<Attraction[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingItem, setEditingItem] = useState<Attraction | null>(null);

    const fetchData = useCallback(() => {
        setData(attractions);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (isModalOpen && editingItem) {
            form.setFieldsValue(editingItem);
        }
    }, [isModalOpen, editingItem, form]);

    const handleDelete = (id: number) => {
        message.success(`Deleted attraction with ID ${id}`);
        fetchData();
    };

    const handleEdit = (item: Attraction) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        form.resetFields();
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        form.validateFields().then(_ => {
            if (editingItem) {
                message.success('Updated attraction');
            } else {
                message.success('Added new attraction');
            }
            setIsModalOpen(false);
            fetchData();
        });
    };

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: ColumnsType<Attraction> = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Description Text', dataIndex: 'descriptionText' },
        { title: 'Description Audio', dataIndex: 'descriptionAudio' },
        { title: 'Location', dataIndex: 'location' },
        { title: 'Offers', dataIndex: 'offers' },
        { title: 'Latitude', dataIndex: 'latitude' },
        { title: 'Longitude', dataIndex: 'longitude' },
        { title: 'Price', dataIndex: 'price' },
        { title: 'Old Price', dataIndex: 'oldPrice' },
        {
            title: 'Actions',
            render: (_, record) => (
                <span>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                </span>
            ),
        },
    ];

    return (
        <div className="managementPage">
            <Layout className="managementLayout">
                <Header className="managementHeader">Admin Dashboard</Header>
                <Content className="managementContent">
                    <div className="managementControls">
                        <Input.Search
                            placeholder="Search by name"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="managementSearch"
                        />
                        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>Add</Button>
                    </div>
                    <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 5 }} />
                    <Modal
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        onOk={handleSave}
                        title={editingItem ? 'Edit' : 'Add'}
                        okText={editingItem ? 'Update' : 'Create'}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="descriptionText" label="Description Text" rules={[{ required: true }]}>
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item name="descriptionAudio" label="Description Audio" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="offers" label="Offers" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="latitude" label="Latitude" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="longitude" label="Longitude" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="oldPrice" label="Old Price" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </Content>
            </Layout>
        </div>
    );
}
