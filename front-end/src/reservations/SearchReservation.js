import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
import EachReservation from "./EachReservation";

function SearchReservation() {
  const initialFormData = {
    mobile_number: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [reservation, setReservation] = useState([]);
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null);

  function handleChange(event) {
    let newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    setFormData(newFormData);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const response = await axios.get(`http://localhost:5001/reservations?mobile_number=${formData.mobile_number}`, abortController.signal);
      const {data} = response.data
      setReservation(data)
      setLoaded(!loaded)
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    return () => abortController.abort();
  }

  return (
    <>
      <h1>Search for a reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile_number">Mobile Number:</label>
        <input
          className="ml-2"
          id="mobile_number"
          name="mobile_number"
          type="text"
          placeholder="Enter a customer's phone number"
          required
          value={formData.mobile_number}
          onChange={handleChange}
        />
        <button className="ml-2" type="submit">
          Search
        </button>
      </form>
      <h2>Reservations</h2>
      {reservation.length && loaded ? reservation.map((r)=> <EachReservation reservation={r} key={r.reservation_id} /> ) : ""}
      {loaded && !reservation.length ? <p>No reservations found</p> : null}
    </>
  );
}

export default SearchReservation;
