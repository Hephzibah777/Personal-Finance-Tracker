import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
import dataType from "../interfaces/dataTyoe";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import catperDataType from "../interfaces/catperDataType";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function Analysis() {
  const [data, setData] = useState([]);
  const [expensedata, setExpenseData] = useState([]);
  const [categorylabel, setCategoryLabel] = useState([]);
  const [categorypercentage, setCategoryPercentage] = useState([]);
  const [year, setYear] = useState("2025");
  const [totalincome, setTotalIncome]=useState(0);
  const [totalexpense, setTotalExpense]=useState(0);
  const [totalbalance, setTotalBalance]=useState(0);
  const dataPattern = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
    datasets: [
      {
        label: "Income per Month",
        data: data,
        barThickness: 50,
        backgroundColor: "rgba(13, 99, 211, 0.6)",
        borderWidth: 1,
      },
      {
        label: "Expense per Month",
        data: expensedata,
        barThickness: 50,
        backgroundColor: "rgba(218, 8, 54, 0.6)",
        borderWidth: 1,
      },
    ],
  };
  const categoryPattern = {
    labels: categorylabel,
    // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
    datasets: [
      {
        label: "Percentage",
        data: categorypercentage,
        barThickness: 150,
        categoryPercentage: 3,
        backgroundColor: [
          "rgba(7, 55, 119, 0.6)",
          "rgba(218, 8, 54, 0.6)",
          "rgba(18, 148, 6, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const token = Cookies.get("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    try {
      const fetchcategoryper = async () => {
        const response = await axios.get(
          `http://localhost:4000/categorydata`,
          config
        );
        const categoryData = response.data.map(
          (key: catperDataType) => key.percentage
        );
        const categorylabelData = response.data.map(
          (key: catperDataType) => key.category
        );
        setCategoryLabel(categorylabelData);
        setCategoryPercentage(categoryData);
      };

      const fetchdata = async()=>{
        const responseincome=await axios.get(`http://localhost:4000/totalincome`,config);
        setTotalIncome(responseincome.data[0].income);

        const responseexpense=await axios.get(`http://localhost:4000/totalexpense`,config);
        setTotalExpense(responseexpense.data[0].expense);
      }


      fetchdata();
      fetchcategoryper();
    } catch (error) {}
  }, []);

  useEffect(()=>{
    try{
      
        const calcBalance=()=>{
            const income=totalincome || 0;
            const expense=totalexpense || 0;
            const balance:number=income-expense;
            setTotalBalance(balance);
            
        }
        calcBalance();
    }
    catch(error){

    }
    
  })
  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(event.target.value);
    try {
      const response = await axios.get(
        `http://localhost:4000/month/${year}`,
        config
      );
      console.log(response.data);
      const incomeData = response.data.map((key: dataType) => key.incomes);
      const expenseData = response.data.map((key: dataType) => key.expenses);
      setExpenseData(expenseData);
      setData(incomeData);
    } catch (error) {}
  };

  return (
    <>
      <div className="p-5 w-full h-screen">
        <div className="mb-5">
          <h1 className="font-bold text-2xl mb-2">Dashboard</h1>
          <h4 className="text-gray-500">
            Keep Track, Assess, and Enhance Your Financial Performance
          </h4>
        </div>
        <div className="flex  w-full h-1/3 gap-5">
          <div className="border border-gray-400 rounded-2xl w-1/3 p-3">
            <div className="font-bold">
              <h1>My Balance</h1>
            </div>
            <div className="mt-15">
              <h3 className="text-gray-400 mb-2">Total balance</h3>
              <h1 className="text-5xl font-bold">
                {totalbalance !==null ? `Rs ${totalbalance}`:"No Data"}
              </h1>
            </div>
          </div>
          <div className="border border-gray-400 rounded-2xl w-1/3 p-3">
            <div className="flex justify-between">
              <h1 className="font-bold">My Income</h1>
              <h2>July 2025</h2>
            </div>
            <div className="mt-15">
              <h3 className="text-gray-400 mb-2">Total income</h3>
              <h1 className="text-5xl font-bold">
              {totalincome !==null ? `Rs ${totalincome}`:"No Data"}
              </h1>
              <div className="flex mt-5 ">
                <div className="border-x border-blue-400 pr-12 pl-3 ">
                  <div>
                    <h1>Salary</h1>
                    <h3>20000</h3>
                  </div>
                </div>
                <div className="border-x border-blue-400 pr-12 pl-3 ">
                  <div>
                    <h1>Salary</h1>
                    <h3>20000</h3>
                  </div>
                </div>
                <div className="border-x border-blue-400 pr-12 pl-3 ">
                  <div>
                    <h1>Salary</h1>
                    <h3>20000</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-400 rounded-2xl w-1/3 p-3">
            <div className="flex justify-between">
              <h1 className="font-bold">My Expense</h1>
              <h2>July 2025</h2>
            </div>
            <div className="mt-15">
              <h3 className="text-gray-400 mb-2">Total expense</h3>
              <h1 className="text-5xl font-bold">
              {totalexpense !==null ? `Rs ${totalexpense}`:"No Data"}
              </h1>
              <div className="flex mt-5 ">
                <div className="border-x border-blue-400 pr-12 pl-3 ">
                  <div>
                    <h1>Salary</h1>
                    <h3>20000</h3>
                  </div>
                </div>
                <div className="border-x border-blue-400 pr-12 pl-3 ">
                  <div>
                    <h1>Salary</h1>
                    <h3>20000</h3>
                  </div>
                </div>
                <div className="border-x border-blue-400 pr-12 pl-3 ">
                  <div>
                    <h1>Salary</h1>
                    <h3>20000</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full h-1/2 mt-5">
          <div className="border border-gray-400 rounded-2xl w-2/3 p-3">
            <div className="flex font-bold justify-between">
              <h1>Money Flow</h1>
              <select className="p-2" onChange={handleChange}>
                <option>Year</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
            <div className="w-full h-full ml-10 pb-10 p-5">
              <Bar
                data={dataPattern}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Incomes vs Expenses",
                    },
                    legend: {
                      display: true,
                      position: "top",
                    },
                  },
                  scales: {
                    x: {
                      display: true,
                      stacked: true,
                    },
                    y: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="border border-gray-400 rounded-2xl w-1/3 p-3">
          <h1 className="font-bold">Categorical Breakdown</h1>
          <h1 className="mt-5 text-6xl font-bold ">20%</h1>
            <div className="mt-20">
              <Bar
                data={categoryPattern}
                options={{
                  plugins: {
                    title: {
                      display: false,
                      text: "Category-Wise Data",
                    },
                    legend: {
                      display: false,
                      position: "top",
                    },
                    datalabels: {
                      anchor: "end",
                      align: "top",
                      color: "black",
                      font: {
                        weight: "bold",
                      },
                    },
                  },
                  scales: {
                    x: {
                      stacked: true,
                      position:"bottom",
                      grid:{
                        display:false
                      },
                      ticks:{
                        padding:5,
                        font:{
                            weight:"bold"
                          }
                      },
                    },
                    y: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analysis;
