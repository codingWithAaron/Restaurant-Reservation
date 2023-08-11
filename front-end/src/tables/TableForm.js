import React from "react";

function TableForm({handleCancel, handleSubmit, handleChange, formData}){
    return (
        <>
            <div>
                <div className="border border-dark m-4 p-4">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="table_name">Table Name:</label>
                        <input name="table_name" id="table_name" type="text" required value={formData.table_name} onChange={handleChange}></input>

                        <label htmlFor="capacity">Capactiy:</label>
                        <input name="capacity" id="capacity" type="number" required min={1} value={formData.capacity} onChange={handleChange}></input>

                        <button className="ml-2" type="submit">Submit</button>
                        <button className="ml-2" onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default TableForm