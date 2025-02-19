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
import { useUserContext } from "../../hooks/UserProvider";
import transactionConstants from "../../constants/home";

/*
  Declaring the `AddTrans` functional component:
  - Accepts `edit` prop of type `updateType` to determine whether the user is editing an existing transaction.
  - Initializes state variables:
    - `expenseData`: Stores expense details.
    - `incomeData`: Stores income details.
    - `categoryData`: Holds new category input.
    - `categories`: Stores available categories fetched from the backend.
    - `selectedcategory`: Tracks the selected category for expenses.
    - `populateIncome`: Stores income data when editing an existing record.
  - Uses `useUserContext` to manage a counter for re-rendering after updates.
  - Retrieves authentication token from cookies and configures request headers.
*/
const AddTrans: React.FC<{ edit: updateType }> = ({ edit }) => {
  const [expenseData, setExpenseData] = useState<expenseDataType | null>(null);
  const [incomeData, setIncomeData] = useState<incomeDataType | null>(null);
  const [categoryData, setCategoryData] = useState("");
  const [categories, setCategories] = useState<categoryDataType[]>([]);
  const [selectedcategory, setSelectedCategory] = useState("");
  const [populateIncome, setPopulateIncome] = useState<incomeDataType | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  
  const token = Cookies.get("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  /*
  useEffect Hook:
  - Fetches categories from the backend when the component mounts.
  - Calls `checkUpdate()` to determine if the component is in edit mode:
    - If `edit.id` is not -1, fetches existing income or expense data based on `edit.type`.
    - Populates the form fields with existing data for editing.
  - Ensures the effect runs whenever the `edit` prop changes.
*/

  /*
  Function: `getCategories`
  - Makes an API request to fetch categories.
  - Updates the `categories` state with the response data.
  - Displays an alert in case of an error fetching the data.
*/
  useEffect(() => {
   

    const getCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/categories",
          config
        );
        setCategories(response.data);
      } catch (error) {
        alert("Error fetching categories data");
      }
    };

  

    /*
  Function: `checkUpdate`
  - Determines if an existing income or expense entry is being edited.
  - If `edit.id` is valid, fetches the corresponding data from the backend.
  - Updates the respective state (`populateIncome` or `expenseData`) with the fetched details.
*/

    const checkUpdate = async () => {
      if (edit.id != -1) {
        if (edit.type == "income") {
          const response = await axios.get(
            `http://localhost:4000/incomes/${edit.id}`,
            config
          );
          setPopulateIncome(response.data);
          setIncomeData({
            amount: response.data.amount,
            description: response.data.description,
            id: response.data.id,
            userId: response.data.userId,
          });
        } else if (edit.type == "expense") {
          const response = await axios.get(
            `http://localhost:4000/expenses/${edit.id}`,
            config
          );
          setExpenseData({
            amount: response.data.amount,
            description: response.data.description,
            id: response.data.id,
            category: response.data.category,
          });
        }
      }
    };
    getCategories();
    checkUpdate();
  }, [edit]);

  useEffect(() => {
    if (showToast) {
      toast.success("Successfully Added");
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  /*
  Function: `addCategory`
  - Prevents default form submission behavior.
  - Sends a request to add a new category to the backend.
  - Displays success notification if the request is successful.
  - Displays an error notification if the request fails.
*/

  const addCategory = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const data = {
        name: categoryData,
      };
      const response = await axios.post(
        "http://localhost:4000/categories",
        data,
        config
      );
      if (response.status == 200) {
        toast.success("New Category Added !", {
          position: "top-right",
          autoClose: 2000,
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

  const handleChangeExpense = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const name = event.target.name;
      const value = event.target.value;
      setExpenseData(
        (values) => ({ ...values, [name]: value } as expenseDataType)
      );
    } catch (error) {
      alert(error);
    }
  };

  const handleSelectExpense = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setExpenseData(
      (values) => ({ ...values, [name]: value } as expenseDataType)
    );
  };

  const handleChangeIncome = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const name = event.target.name;
      const value = event.target.value;
      setIncomeData(
        (values) => ({ ...values, [name]: value } as incomeDataType)
      );
    } catch (error) {
      alert(error);
    }
  };

  /*
  Function: `handleAddIncome`
  - Prevents default form submission behavior.
  - If a new income entry is being added (`edit.id == -1`):
    - Sends a POST request to create a new income entry.
    - Displays a success notification upon successful creation.
  - If an existing income entry is being edited:
    - Sends a PATCH request to update the existing entry.
    - Displays a success notification upon successful update.
  - Resets the `incomeData` state to clear the form after submission.
  - Catches and handles errors by displaying an error notification.
*/


  const handleAddIncome = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (edit.id == -1) {
        const response = await axios.post(
          "http://localhost:4000/incomes",
          incomeData,
          config
        );
        if (response.status == 201) {
          toast.success("New Income Added successfully!", {
            position: "top-center",
          });
        }
        edit.id = -1;
        edit.type = "";
      } else {
        const data = {
          amount: incomeData?.amount,
          description: incomeData?.description,
        };
        const response = await axios.patch(
          `http://localhost:4000/incomes/${edit.id}`,
          data,
          config
        );
        if (response.status == 201) {
          toast.success("Income Updated successfully!", {
            position: "top-center",
          });
        }
      }

      setIncomeData({ id: "", userId: "", amount: "", description: "" });
    } catch (error) {
      toast.error(
        "Something went wrong. Please check your internet connection and try again!",
        {
          position: "top-center",
        }
      );
    }
  };

  /*
  Function: `handleAddExpense`
  - Prevents default form submission behavior.
  - If an existing expense entry is being edited (`edit.id != -1`):
    - Sends a PATCH request to update the entry.
    - Displays a success notification upon successful update.
  - If a new expense is being added:
    - Sends a POST request to create a new expense entry.
    - Displays a success notification upon successful creation.
  - Resets the `expenseData` state to clear the form after submission.
  - Catches and handles errors by displaying an error notification.
*/
  const handleAddExpense = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (edit.id != -1) {
        const data = {
          amount: expenseData?.amount,
          category: expenseData?.category,
          description: expenseData?.description,
        };
        const response = await axios.patch(
          `http://localhost:4000/expenses/${edit.id}`,
          data,
          config
        );
        if (response.status == 200) {
          toast.success("Expense updated successfully!", {
            position: "top-center",
          });
       
        }
        edit.id = -1;
        edit.type = "";
      } else {
        const response = await axios.post(
          "http://localhost:4000/expenses",
          expenseData,
          config
        );
        if (response.status == 200) {
          
         toast.success("New expense added successfully!", {
            position: "top-center",
            autoClose: 3000,
          });
          
          
        }
      }
      setExpenseData({ id: "", amount: "", category: "", description: "" });
    } catch (error) {
      toast.error(
        "Something went wrong. Please check your internet connection and try again!",
        {
          position: "top-center",
        }
      );
    }
  };

  return (
    <>
      <div className="w-1/3">
        <div>
          <form onSubmit={handleAddIncome}>
            <div className="h-2/5 bg-blue-100 shadow-lg rounded-3xl p-5 mb-5 ">
              <h1 className="text-2xl font-bold">{transactionConstants.income}</h1>
              <div className="mt-2 flex-col">
                <div>
                  <h2 className="mb-2">{transactionConstants.incomeamount}</h2>
                  <input
                    name="amount"
                    value={incomeData?.amount}
                    onChange={handleChangeIncome}
                    className="mb-2 border-gray-200 rounded-2xl w-full p-2 bg-white"
                  />
                </div>
                <div>
                  <h2 className="mb-2">{transactionConstants.incomedescription}</h2>
                  <input
                    name="description"
                    value={incomeData?.description}
                    onChange={handleChangeIncome}
                    className="mb-2 border-gray-200 rounded-2xl w-full p-2 bg-white"
                  />
                </div>
              </div>
              <div className="mt-5">
                <button className="w-full p-3 bg-blue-950 rounded-2xl text-white">
                  {transactionConstants.incomebutton}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div>
          <form onSubmit={handleAddExpense}>
            <div className="h-2/5 bg-blue-100 shadow-lg rounded-3xl p-5">
              <h1 className="text-2xl font-bold">{transactionConstants.expense}</h1>
              <div className="mt-2 flex-col">
                <div>
                  <h2 className="mb-2">{transactionConstants.expenseamount}</h2>
                  <input
                    name="amount"
                    value={expenseData?.amount}
                    onChange={handleChangeExpense}
                    className="mb-2 border-gray-200 rounded-2xl w-full p-2 bg-white"
                  />
                </div>
                <div className="mb-1 mt-3 border border-gray-400 p-3 rounded-xl ">
                  <select
                    className="focus:border-none"
                    value={expenseData?.category}
                    name="category"
                    onChange={handleSelectExpense}
                  >
                    <option>{transactionConstants.expensecategory}</option>
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
                  <h2 className="mb-2">{transactionConstants.expensedescription}</h2>
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
                  {transactionConstants.expensebutton}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTrans;
