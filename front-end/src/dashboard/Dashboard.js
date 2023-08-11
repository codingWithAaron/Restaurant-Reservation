import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom";
import { today, previous, next } from "../utils/date-time";
import EachReservation from "../reservations/EachReservation";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import EachTable from "../tables/EachTable";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const query = useQuery();
  const route = useRouteMatch();
  const history = useHistory()

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);
  const [tables, setTables] = useState([])

  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(() => {
    function getDate() {
      const queryDate = query.get("date");
      if (queryDate) {
        setCurrentDate(queryDate);
      } else {
        setCurrentDate(today());
      }
    }
    getDate();
  }, [query, route]);

  useEffect(()=>{
    async function getTables(){
      const response = await fetch("http://localhost:5001/tables")
      const data = await response.json()
      setTables(data.data)
    }
    getTables()
  },[])

  if (reservations.length !== 0 && tables) {
    return (
      <main>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Reservations for date: {currentDate}</h4>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${previous(currentDate)}`);
              setCurrentDate(previous(currentDate));
            }}
          >Previous Day</button>
          <button
            className="btn btn-primary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${today(currentDate)}`);
              setCurrentDate(today(currentDate));
            }}
          >Today</button>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${next(currentDate)}`);
              setCurrentDate(next(currentDate));
            }}
          >Next Day</button>
        </div>
        <ErrorAlert error={reservationsError} />
        <div>
          {reservations.map((reservation) => (
            <EachReservation
              reservation={reservation}
              key={reservation.reservation_id}
            />
          ))}
        </div>
        <div>
          <h1>Tables</h1>
        </div>
        <div>
          {tables.map((table) => <EachTable key={table.table_id} table={table} />)}
        </div>
      </main>
    );
  } else {
    return (
      <main>
        <h1>Dashboard</h1>
         <div className="d-md-flex mb-3">
          <h4 className="mb-0">No Reservations for date: {currentDate}</h4>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${previous(currentDate)}`);
              setCurrentDate(previous(currentDate));
            }}
          >Previous Day</button>
          <button
            className="btn btn-primary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${today(currentDate)}`);
              setCurrentDate(today(currentDate));
            }}
          >Today</button>
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={() => {
              history.push(`/dashboard?date=${next(currentDate)}`);
              setCurrentDate(next(currentDate));
            }}
          >Next Day</button>
        </div>
        <ErrorAlert error={reservationsError} />
        <div>
          <h1>Tables</h1>
        </div>
        <div>
          {tables.map((table) => <EachTable key={table.table_id} table={table} />)}
        </div>
      </main>
    );
  }
}

export default Dashboard;
