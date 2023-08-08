import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom";
import { today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const query = useQuery()
  const route = useRouteMatch()

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date)

  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(()=>{
    function getDate(){
      const queryDate = query.get("date")
      if(queryDate){
        setCurrentDate(queryDate)
      }else{
        setCurrentDate(today())
      }
    }
    getDate()
  }, [query, route])

  if(reservations.length !== 0){
    return (
      <main>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Reservations for date: {currentDate}</h4>
        </div>
        <ErrorAlert error={reservationsError} />
        {JSON.stringify(reservations)}
      </main>
    );
  }else{
    return (
      <main>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">No Reservations for date: {currentDate}</h4>
        </div>
      </main>
    );
  }

}

export default Dashboard;
