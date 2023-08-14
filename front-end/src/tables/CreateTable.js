import React, { useState } from "react";
import TableForm from "./TableForm";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios"

function CreateTable(){
    const history = useHistory()
    const initialFormData = {
        table_name: "",
        capacity: ""
    }
    const [formData, setFormData] = useState(initialFormData)
    const [error, setError] = useState(null)

    function handleCancel(){
        history.goBack()
    }

    function handleChange(event){
        let newFormData = {...formData}
        newFormData[event.target.name] = event.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(event){
        event.preventDefault()
        const abortController = new AbortController()
        const formDataCorrectTypes = {
            ...formData,
            capacity: Number(formData.capacity)
        }
        
        try {
            await axios.post("http://localhost:5001/tables", {data: formDataCorrectTypes})
            history.push("/dashboard")
            
        } catch (error) {
            if(error.name !== "AbortError"){
                setError(error)
            }
        }
        return () => abortController.abort();
    }

    return (
        <>
            <h1>Create a Table</h1>
            <ErrorAlert error={error}/>
            <TableForm handleCancel={handleCancel} handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} />
        </>
    )
}

export default CreateTable