import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import expenseDataType from "../../interfaces/expenseDataType";
import categoryDataType from "../../interfaces/categoryDataType";
import Cookies from "js-cookie";
import incomeDataType from "../../interfaces/incomeDataType";
import updateType from "../../interfaces/updateType";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTrans:React.FC<{edit:updateType}>=({edit})=> {
  const [expenseData, setExpenseData] = useState<expenseDataType | null>(null);
  const [incomeData, setIncomeData] = useState<incomeDataType|null>(null);
  const [categoryData, setCategoryData] = useState("");
  const [categories, setCategories] = useState<categoryDataType[]>([]);
  const [selectedcategory, setSelectedCategory] = useState("");
  const [populateIncome, setPopulateIncome] = useState<incomeDataType|null>(null);
  const token = Cookies.get("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
  
    const getCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/categories",config);
        setCategories(response.data);
      } catch (error) {
        alert("Error fetching categories data");
      }
    };
    getCategories();

    const checkUpdate=async()=>{
        if(edit.id!=-1){
            if(edit.type=="income"){
                const response=await axios.get(`http://localhost:4000/incomes/${edit.id}`,config);
                setPopulateIncome(response.data);
                setIncomeData({amount:response.data.amount, description:response.data.description, id:response.data.id, userId:response.data.userId})
            }
            else if(edit.type=="expense"){
              const response=await axios.get(`http://localhost:4000/expenses/${edit.id}`,config);
              setExpenseData({amount:response.data.amount, description:response.data.description, id:response.data.id, category:response.data.category});
            }
        }
    }

    checkUpdate();
  }, [edit]);

  const addCategory = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const data = {
        name: categoryData,
      };
      const response = await axios.post("http://localhost:4000/categories",data, config);
      if (response.status == 200) {
        toast.success("New Category Added !", {
                                position: "top-right",
                                autoClose:2000,
                              });
      }
    } catch (error) {
      toast.error("Failed to add category.Please try again", {
                     position: "top-center",
                   });
    }
  };

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryData(event.target.value);
  };

  const handleChangeExpense = (event:React.ChangeEvent<HTMLInputElement>)=>{
    try{
        const name=event.target.name;
        const value=event.target.value;
        setExpenseData(values=>({...values, [name]:value} as expenseDataType));
    }
    catch(error){
        alert(error);
    }
  }

  const handleSelectExpense=(event:React.ChangeEvent<HTMLSelectElement>)=>{
    const name=event.target.name;
    const value=event.target.value;
    setExpenseData(values=>({...values, [name]:value} as expenseDataType));
   
  }

  const handleChangeIncome=(event:React.ChangeEvent<HTMLInputElement>)=>{
    try{
        const name=event.target.name;
        const value=event.target.value;
        setIncomeData(values=>({...values, [name]:value} as incomeDataType));
    }
    catch(error){
        alert(error);
    }
  }



  const handleAddIncome=async(event:React.FormEvent<HTMLFormElement>)=>{
    try{
        event.preventDefault();
        if(edit.id==-1){
        const response = await axios.post("http://localhost:4000/incomes",incomeData,config);
        if (response.status == 200) {
           toast.success("New Income Added successfully!", {
                          position: "top-center",
                        });
        }
        edit.id=-1;
        edit.type="";
    }
    else{
        const data={
            amount:incomeData?.amount,
            description:incomeData?.description
        }
        const response = await axios.patch(`http://localhost:4000/incomes/${edit.id}`,data,config);
        if (response.status == 200) {
          toast.success("Income Updated successfully!", {
            position: "top-center",
          });
        }
    }

        setIncomeData({id:"", userId:"", amount:"", description:""})
        
    }
    catch(error){
      toast.error("Something went wrong. Please check your internet connection and try again!", {
        position: "top-center",
      });
    }
  }

  const handleAddExpense=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    try{
      if(edit.id!=-1){
        const data={
          amount:expenseData?.amount,
          category:expenseData?.category,
          description:expenseData?.description
        }
        const response = await axios.patch(`http://localhost:4000/expenses/${edit.id}`,data,config);
        if (response.status == 200) {
          toast.success("Expense updated successfully!", {
            position: "top-center",
          });
        }
        edit.id=-1;
        edit.type="";
      }
      else{
        const response = await axios.post("http://localhost:4000/expenses",expenseData,config);
      if (response.status == 200) {
        toast.success("New expense added successfully!", {
          position: "top-center",
        });
      }
    }
      setExpenseData({id:"", amount:"", category:"", description:""});
    }
    catch(error){
      toast.error("Something went wrong. Please check your internet connection and try again!", {
        position: "top-center",
      });
    }
  }



  return (
    <>
      <div className="w-1/3">
        <div>
          <form onSubmit={handleAddIncome}>
            <div className="h-2/5 bg-blue-100 shadow-lg rounded-3xl p-5 mb-5 ">
              <h1 className="text-2xl font-bold">Add Income</h1>
              <div className="mt-2 flex-col">
                <div>
                  <h2 className="mb-2">Amount:</h2>
                  <input name="amount" value={incomeData?.amount} onChange={handleChangeIncome} className="mb-2 border-gray-200 rounded-2xl w-full p-2 bg-white" />
                </div>
                <div>
                  <h2 className="mb-2">Description:</h2>
                  <input name="description" value={incomeData?.description} onChange={handleChangeIncome} className="mb-2 border-gray-200 rounded-2xl w-full p-2 bg-white" />
                </div>
              </div>
              <div className="mt-5">
                <button className="w-full p-3 bg-blue-950 rounded-2xl text-white">
                  Add Income
                </button>
              </div>
            </div>
          </form>
        </div>

        <div>
          <form onSubmit={handleAddExpense}>
            <div className="h-2/5 bg-blue-100 shadow-lg rounded-3xl p-5">
              <h1 className="text-2xl font-bold">Add Expenses</h1>
              <div className="mt-2 flex-col">
                <div>
                  <h2 className="mb-2">Amount:</h2>
                  <input
                  name="amount"
                    value={expenseData?.amount}
                    onChange={handleChangeExpense}
                    
                    className="mb-2 border-gray-200 rounded-2xl w-full p-2 bg-white"
                  />
                </div>
                {/* <div>
           <h2 className="mb-2">Category:</h2>
           <input value={expenseData?.category} className="mb-2 border-gray-200 rounded-2xl w-full p-2 bg-white"/>
           </div> */}
                <div className="mb-1 mt-3 border border-gray-400 p-3 rounded-xl ">
                  <select className="focus:border-none" value={expenseData?.category} name="category" onChange={handleSelectExpense}>
                    <option>Select Category</option>
                    {categories.map((key) => (
                      <option key={key.name}>{key.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-5 mt-3 mb-3">
                  <input
                    className="border-gray-200 bg-white w-1/2 rounded p-1"
                   
                    value={categoryData}
                    onChange={handleChangeCategory}
                    placeholder="Add Category"
                  />
                  <button
                    className="bg-blue-950 rounded-xl p-3 text-white"
                    onClick={addCategory}
                  >
                    Add
                  </button>
                </div>
                <div>
                  <h2 className="mb-2">Description:</h2>
                  <input
                    value={expenseData?.description}
                     name="description"
                    onChange={handleChangeExpense}
                    className="mb-2 border-gray-200 rounded-2xl w-full p-2 bg-white"
                  />
                </div>
              </div>
              <div className="mt-5 ">
                <button className="w-full p-3 bg-blue-950 rounded-2xl text-white">
                  Add Expense
                </button>
              </div>
            </div>
          </form>
           <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default AddTrans;
