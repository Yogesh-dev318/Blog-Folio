import { SignupInput } from "@yogesh20012004/medium-common"
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import  axios  from "axios"
import { BACKEND_URL } from "../config"
export const Auth = ({ type }: { type: "Signup" | "Signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setpostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    })
    async function sendRequest(){
        try{
            const response=await axios.post(`${BACKEND_URL}/api/v1/user/${type==="Signup"? "signup":"signin"}`,postInputs)
            const jwt=response.data
            localStorage.setItem("token",jwt)
            navigate("/blogs")
        }
        catch(e){
            alert(e)
            console.log(e)
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col ">
            <div className="flex justify-center">
                <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        Create an account
                    </div>
                    <div className="text-slate-400">
                        {type==="Signup" ? "Don't have an account?" :  "Already have an account?"}
                        <Link to={type==="Signup" ? "/Signin":"/Signup"} className="text-slate-400 underline">
                             {type==="Signup" ? "Signin" : "Signup"}
                        </Link>
                    </div>
                </div>
                <div className="pt-8">
                    {type==="Signup"? <Labelledinput label="Name" placeholders="Enter Your Name" onChange={(e) => {
                        setpostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} />: null}
                    
                    <Labelledinput label="Username" placeholders="Enter Your Username" onChange={(e) => {
                        setpostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }} />
                    <Labelledinput label="Password" placeholders="Enter Your Password" pass={"password"} onChange={(e) => {
                        setpostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button onClick={sendRequest} type="button" className=" w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-8">{type==="Signup"? "Signup" :"Signin"}</button>
                </div>
                </div>
            </div>
        </div>
    )
}
interface labelinputtypes {
    label: string,
    placeholders: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    pass?: string
}
function Labelledinput({ label, placeholders, onChange, pass }: labelinputtypes) {
    return (
        <div>
            <label className="block mb-2 text-sm font-bold text-gray-900 text-black pt-2">{label}</label>
            <input 
                type={pass} 
                onChange={onChange} 
                id="first_name" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder={placeholders} 
                required 
            />
        </div>
    )
}
