import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { useHistory } from "react-router-dom";

const CustomersTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [cdata, setData] = useState([]);
  const token = localStorage.getItem("token");
  // const [customers, setCustomers] = useState([]);

  // const history = useHistory();
  useEffect(() => {
    fetch("http://localhost:8000/api/customers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error));  
  }, []);


  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

 
  const newData1="";
  const newData ="";

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
         newData = [...cdata, values];
        setData(newData);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const showEditModal = (record) => {

    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    editForm.validateFields().then((values) => {
      const newData = cdata.map((item) => {
        if (item.key === values.key) {
          return { ...item, ...values };
        }
        return item;
      });
     

      
      fetch(`http://localhost:8000/api/customers/${values.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log('Data updated successfully!');
          window.location.reload();
        })
        .catch((error) => {
          console.error('There was a problem updating the data:', error);
        });
  
      editForm.resetFields();
      setIsEditModalVisible(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleEditCancel = () => {
    editForm.resetFields();
    setIsEditModalVisible(false);
  };

  const handleDelete = (record) => {
    const newData = cdata.filter((item) => item.key !== record.key);
    setData(newData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        {/* <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Customer
        </Button> */}
      </div>
      <Table columns={columns} dataSource={cdata} />
      {/* <Modal
        title="Add Customer"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="add_customer"
          onFinish={handleOk}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input customer name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input customer email!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal> */}
      <Modal
        title="Edit Customer"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Form
          form={editForm}
          name="edit_customer"
          onFinish={handleEditOk}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Number"
            name="contact"
           
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            
          >
            <Input />
          </Form.Item>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default CustomersTable;
