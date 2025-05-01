import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Input, Layout, Modal, Form, message, notification } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './management.css';
import { Attraction } from '../../models/attractionEntity';
import {getAllAttractions, createAttraction, updateAttraction} from "../../api/attractionApi";

const { Header, Content } = Layout;

export default function Management() {
    const [data, setData] = useState<Attraction[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingItem, setEditingItem] = useState<Attraction | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const allAttractions: Attraction[] = await getAllAttractions();
            setData(allAttractions);
        } catch (err) {
            notification.error({
                message: "Failed to load filter data",
                description: String(err),
            });
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = (id: number) => {
        message.success(`Deleted attraction with ID ${id}`);
        fetchData();
    };

    const handleEdit = (item: Attraction) => {
        setEditingItem(item);
        setIsModalOpen(true);
        setTimeout(() => {
            form.setFieldsValue({
                name: item.name,
                descriptionText: item.descriptionText,
                descriptionAudio: item.descriptionAudio,
                location: item.location,
                offers: item.offers,
                category: item.category,
                latitude: item.latitude,
                longitude: item.longitude,
                price: item.price,
                oldPrice: item.oldPrice
            });
        }, 0);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
        setTimeout(() => {
            form.resetFields();
        }, 0);
    };

    const handleSave = () => {
        form.validateFields().then(async (values) => {
            try {
                if (editingItem) {
                    const payload = { ...values, id: editingItem.id };
                    await updateAttraction(payload);
                    notification.success({ message: 'Attraction updated successfully!' });
                } else {
                    await createAttraction(values);
                    notification.success({ message: 'Attraction added successfully!' });
                }
                setIsModalOpen(false);
                fetchData();
            } catch (error) {
                notification.error({
                    message: 'Error saving/updating attraction',
                    description: String(error),
                });
            }
        }).catch(info => {
            //console.log('Validate Failed:', info);
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
        { title: 'Category', dataIndex: 'category' },
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
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={(values) => console.log({ values })}
                            onFinishFailed={({ errorFields }) => console.log({ errorFields })}
                        >
                            <Form.Item name="name" label="Name" rules={[{ required: true }]} children={<Input />} />
                            <Form.Item name="descriptionText" label="Description Text" rules={[{ required: true }]} children={<Input.TextArea />} />
                            <Form.Item name="descriptionAudio" label="Description Audio" rules={[{ required: true }]} children={<Input />} />
                            <Form.Item name="location" label="Location" rules={[{ required: true }]} children={<Input />} />
                            <Form.Item name="offers" label="Offers" rules={[{ required: true }]} children={<Input />} />
                            <Form.Item name="category" label="Category" rules={[{ required: true }]} children={<Input />} />
                            <Form.Item name="latitude" label="Latitude" rules={[{ required: true }]} children={<Input type="number" />} />
                            <Form.Item name="longitude" label="Longitude" rules={[{ required: true }]} children={<Input type="number" />} />
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[
                                    { required: true, message: 'Price is required' },
                                    {
                                        validator: (_, value) =>
                                            value > 0
                                                ? Promise.resolve()
                                                : Promise.reject(new Error('Price must be a positive number')),
                                    },
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="oldPrice" label="Old Price" rules={[{ required: true }]} children={<Input type="number" />} />
                        </Form>
                    </Modal>
                </Content>
            </Layout>
        </div>
    );
}
