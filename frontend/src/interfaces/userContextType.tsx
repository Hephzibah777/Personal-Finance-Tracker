import userType from "./userType";
import expenseDataType from "./expenseDataType";
interface userContextType{
    user:userType|null,
   counter:boolean,
   setCounter:React.Dispatch<React.SetStateAction<boolean>>
}

export default userContextType;