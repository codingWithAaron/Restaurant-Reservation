import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation(){
    const history = useHistory()
    const [error, setError] = useState(null)
    const [tables, setTables] = useState([])

    useEffect(()=>{
        async function getTables(){
          const response = await fetch("http://localhost:5001/tables")
          const data = await response.json()
          setTables(data.data)
        }
        getTables()
    },[])

    function handleCancel(){
        history.goBack()
    }

    async function handleSubmit(event){
        event.preventDefault()
        const abortController = new AbortController()
        
        try {
            await axios.put("http://localhost:5001/tables/:table_id/seat/", )
            history.push("/dashboard")
            
        } catch (error) {
            if(error.name !== "AbortError"){
                setError(error)
            }
        }
        return () => abortController.abort();
    }

    if(tables){
        return (
            <>
                <div>
                    <div>
                        <h1> Seat reservation number </h1>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="table_id">
                                Table:
                                <select id="table_id" name="table_id">
                                    {tables.map((table) => <option key={table.table_id}>{table.table_name} - Capacity: {table.capacity}</option>)}
                                </select>
                            </label>
                            <button className="ml-2" type="submit">Submit</button>
                            <button className="ml-2" onClick={handleCancel}>Cancel</button>
                        </form>
                    </div>
                </div>
                <ErrorAlert error={error} />
            </>
        )
    }else{
        return <p>Loading...</p>
    }
}

export default SeatReservation