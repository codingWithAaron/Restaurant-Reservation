import React, { useEffect, useState } from "react";
import Form from "./Form";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function EditReservation() {
  const history = useHistory();
  const params = useParams();
  const { reservation_id } = params;
  const initialData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
    status: "",
  };
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(initialData);
  const [isTuesday, setIsTuesday] = useState(false);
  const [isPastDate, setIsPastDate] = useState(false);
  const [before1030, setBefore1030] = useState(false);
  const [after930, setAfter930] = useState(false);
  const reservationInfo = {
    ...reservation,
    reservation_date: reservation.reservation_date.substring(0, 10),
  };

  function isDateTuesday(date) {
    const selectedDate = new Date(`${date}T00:00:00`);
    const dayOfWeek = selectedDate.getUTCDay();

    return dayOfWeek === 2;
  }

  function isDateInPast(date) {
    const selectedDate = new Date(`${date}T00:00:00`);
    const currentDate = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    return selectedDate < currentDate;
  }

  function isBefore10(time) {
    const selectedTime = new Date(`1970-01-01T${time}`);
    const earliestTime = new Date(`1970-01-01T10:30:00`);
    return selectedTime < earliestTime;
  }

  function isAfter9(time) {
    const selectedTime = new Date(`1970-01-01T${time}`);
    const latestTime = new Date(`1970-01-01T21:30:00`);
    return selectedTime > latestTime;
  }

  useEffect(() => {
    const abortController = new AbortController();
    try {
      async function getReservation() {
        const response = await axios.get(
          `${BASE_URL}/reservations/${reservation_id}`
        );
        const data = response.data;
        setReservation(data.data);
      }
      getReservation();
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    return () => abortController.abort();
  }, []);

  function handleCancel() {
    history.goBack();
  }

  function handleChange(event) {
    let newFormData = { ...reservation };
    newFormData[event.target.name] = event.target.value;
    setReservation(newFormData);

    if (event.target.name === "reservation_date") {
      setIsTuesday(isDateTuesday(event.target.value));
      if (isDateInPast(event.target.value)) {
        setIsPastDate(true);
      } else {
        setIsPastDate(false);
      }
    } else if (event.target.name === "reservation_time") {
      if (isBefore10(event.target.value)) {
        setBefore1030(true);
      } else {
        setBefore1030(false);
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const formDataCorrectTypes = {
      ...reservation,
      people: Number(reservation.people),
      reservation_date: reservation.reservation_date.substring(0, 10)
    };

    if (reservation.reservation_time) {
      if (isAfter9(reservation.reservation_time)) {
        setAfter930(true);
        return;
      }
    }

    try {
      await axios.put(
        `${BASE_URL}/reservations/${reservation_id}`,
        { data: formDataCorrectTypes },
        abortController.signal
      );
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    return () => abortController.abort();
  }

  if (reservation) {
    return (
      <>
        <h1>Edit Reservation</h1>
        <ErrorAlert error={error} />
        <Form
          reservation={reservationInfo}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleCancel={handleCancel}
          after930={after930}
          isTuesday={isTuesday}
          isPastDate={isPastDate}
          before1030={before1030}
        />
      </>
    );
  }
}

export default EditReservation;
