import React, { useEffect, useRef, useState } from "react";
import { DatePicker, Button, Input, Table, Space, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import "./style/style.css";
import AddNewPersonContent from "./components/AddNewPersonContent";
import { create } from "zustand";
import Chart from "./components/Chart";
import { Routes, Route, Link } from "react-router-dom";
export interface IState {
  people: {
    id: number;
    name: string;
    email: string;
    gender: string;
    address: {
      street: string;
      city: string;
    };
    phone: string;
  }[];
}

export interface INewPerson {
  newPersonData: {
    id: number;
    name: string;
    email: string;
    gender: string;
    street: string;
    city: string;
    phone: string;
  };
}

interface IStore {
  people: IState["people"];
  newPersonData: INewPerson["newPersonData"];
  addPeople: (persons: IState["people"]) => void;
  updateNewPerson: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  resetNewPerson: () => void;
}

export const useStore = create<IStore>((set) => ({
  people: [],
  newPersonData: {
    id: 0,
    name: "",
    email: "",
    gender: "",
    street: "",
    city: "",
    phone: "",
  },
  updateNewPerson: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    set((state) => ({
      newPersonData: {
        ...state.newPersonData,
        [e.target.name]: e.target.value,
      },
    })),
  resetNewPerson: () =>
    set(() => ({
      newPersonData: {
        id: 0,
        name: "",
        email: "",
        gender: "",
        street: "",
        city: "",
        phone: "",
      },
    })),
  addPeople: (persons: IState["people"]) => set(() => ({ people: persons })),
}));

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { addPeople, people, newPersonData, resetNewPerson } = useStore();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    const newPerson = [
      ...people,
      {
        id: Math.max(...people.map((x) => x.id)) + 1,
        name: newPersonData.name,
        email: newPersonData.email,
        gender: newPersonData.gender,
        address: {
          street: newPersonData.street,
          city: newPersonData.city,
        },
        phone: newPersonData.phone,
      },
    ];
    addPeople(newPerson);
    resetNewPerson();
    axios
      .post("http://192.168.1.5:5000/persons", { persons: [newPerson] })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getData = async () => {
    try {
      const response = await axios.get("http://192.168.1.5:5000/persons");
      addPeople(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = (id: number) => {
    const updatedData = people.filter((person) => person.id !== id);
    addPeople(updatedData);
  };

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
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: { street: string; city: string }) => `${address.city}, ${address.street}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Routes>
        <Route
          path="/"
          index
          element={
            <>
              <div className="table_container">
                <div className="add_person_container">
                  <button className="my_btn" onClick={showModal}>
                    Add New Person
                  </button>
                  <Link to={"/chart"} style={{ marginLeft: "1rem" }} className="my_btn">
                    Show me chart
                  </Link>
                  <Modal title="Add New Person" okText="Add New Person" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <AddNewPersonContent />
                  </Modal>
                </div>

                <Table dataSource={people} columns={columns} />
              </div>
            </>
          }
        />
        <Route path="/chart" element={<Chart />} />
      </Routes>
    </>
  );
};

export default App;
