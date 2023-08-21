import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function EachTable({ table }) {
  const history = useHistory();
  const [error, setError] = useState(null);

  async function handleFinish(event) {
    event.preventDefault();
    const abortController = new AbortController();

    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await axios.put(
          `http://localhost:5001/reservations/${table.reservation_id}/status`,
          {data: { status: "finished" } }
        );
        await axios.delete(
          `http://localhost:5001/tables/${table.table_id}/seat`
        );
        history.push("/");
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
        }
      }
      return () => abortController.abort();
    }
  }

  if (!table) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <ErrorAlert error={error} />
        <div className="border border-dark p-3 mb-2">
          <p>Table: {table.table_name}</p>
          <p data-table-id-status={table.table_id}>
            {" "}
            Status: {table.reservation_id === null ? "Free" : "Occupied"}
          </p>
          {table.reservation_id !== null ? (
            <button
              data-table-id-finish={table.table_id}
              onClick={handleFinish}
            >
              Finish
            </button>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

export default EachTable;
