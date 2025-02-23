import userType from "./userType";
import expenseDataType from "./expenseDataType";
interface userContextType{
    user:userType|null,
   expenseCounter:number,
   updateExpense:()=>void,
  updateUser:()=>void
}

export default userContextType;