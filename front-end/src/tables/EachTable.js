import React from "react";

function EachTable({ table }){
    if(!table){
        return <p>Loading...</p>
    }else{
        return (
            <>
                <div className="border border-dark p-3 mb-2">
                    <p>{table.table_name}</p>
                </div>
            </>
        )
    }
}

export default EachTable