import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import expenseDataType from "../../interfaces/expenseDataType";
import Cookies from "js-cookie";
import updateType from "../../interfaces/updateType";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomModal from "../Modal";

interface ComponentType {
  edit: React.Dispatch<React.SetStateAction<updateType>>;
}

const ExpenseHistory: React.FC<ComponentType> = ({ edit }) => {
  const [expenseData, setExpenseData] = useState<expenseDataType[]>([]);
  const [isModalOpen, setIsModalOpen]=useState(false);
  const [deleteId, setDeleteId]=useState(-1);
  const token = Cookies.get("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/expenses",
          config
        );
        setExpenseData(response.data);
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (value: number) => {
    edit({ type: "expense", id: value });
  };

  const handleDeleteConfirm=(value:number)=>{
    setDeleteId(value);
    setIsModalOpen(true);
  }

  const handleDelete = async () => {
    try {
      setIsModalOpen(false);
      const value=deleteId;
      const response = await axios.delete(
        `http://localhost:4000/expenses/${value}`,
        config
      );
      if (response.status == 200) {
        toast.success("Deleted successfully !", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
       toast.error("Something went wrong. Please check your internet connection and try again!", {
              position: "top-center",
            });
    }
  };
  return (
    <>
      <div className="relative w-full mt-5  overflow-y-scroll overflow-x-hidden">
        <table className="border">
          <thead>
            <tr>
              <th className="p-2 pl-15 pr-15 border border-gray-400">
                Category
              </th>
              <th className="p-2 pl-15 pr-15 border border-gray-400">Amount</th>
              <th className="p-2 pl-15 pr-15 border border-gray-400">
                Description
              </th>
              <th className="p-2 pl-23 pr-23 border border-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenseData.map((key) => (
              <tr key={key.id}>
                <td className="border p-4 border-gray-400">{key.category}</td>
                <td className="border p-4 border-gray-400">{key.amount}</td>
                <td className="border p-4 border-gray-400">
                  {key.description}
                </td>
                <td className="border p-4 border-gray-400">
                  <div className="flex gap-3">
                    <button
                      className="border border-green-600 p-3 pl-7 pr-7 rounded-2xl cursor-pointer"
                      onClick={() => handleEdit(key.id as number)}
                    >
                      Edit
                    </button>
                    <button
                      className="border border-red-600 p-3 pl-7 pr-7 rounded-2xl cursor-pointer"
                      onClick={() => handleDeleteConfirm(key.id as number)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         <ToastContainer />
         <CustomModal
           open={isModalOpen}
           onClose={()=>setIsModalOpen(false)}
           onConfirm={handleDelete}
           title="Confirm Action"
           message="Are you sure you want to delete?"
           />
      </div>
    </>
  );
};

export default ExpenseHistory;
