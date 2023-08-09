import React, { useState } from "react";
import axios from "axios"
import { useHistory } from 'react-router-dom';
import Form from "./Form";
import ErrorAlert from "../layout/ErrorAlert";

function CreateReservation(){
    const history = useHistory()
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    }
    const [formData, setFormData] = useState(initialFormData)
    const [error, setError] = useState(null)
    const [isTuesday, setIsTuesday] = useState(false)
    const [isPastDate, setIsPastDate] = useState(false)
    const [before1030, setBefore1030] = useState(false)
    const [after930, setAfter930] = useState(false)
    
    function isDateTuesday(date){
        const selectedDate = new Date(`${date}T00:00:00`)
        const dayOfWeek = selectedDate.getUTCDay()

        return dayOfWeek === 2
    }

    function isDateInPast(date){
        const selectedDate = new Date(`${date}T00:00:00`)
        const currentDate = new Date()

        selectedDate.setHours(0, 0, 0, 0)
        currentDate.setHours(0, 0, 0, 0)
        return selectedDate < currentDate
    }

    function isBefore10(time){
        const selectedTime = new Date(`1970-01-01T${time}`)
        const earliestTime = new Date(`1970-01-01T10:30:00`)
        return selectedTime < earliestTime
    }

    function isAfter9(time){
        const selectedTime = new Date(`1970-01-01T${time}`)
        const latestTime = new Date(`1970-01-01T21:30:00`)
        return selectedTime > latestTime
    }

    function handleCancel(){
     history.goBack()
    }

    function handleChange(event){
        let newFormData = {...formData}
        newFormData[event.target.name] = event.target.value
        setFormData(newFormData)

        if(event.target.name === "reservation_date"){
            setIsTuesday(isDateTuesday(event.target.value))
            if(isDateInPast(event.target.value)){
                setIsPastDate(true)
            }else{
                setIsPastDate(false)
            }
        }else if(event.target.name === "reservation_time"){
            if(isBefore10(event.target.value)){
                setBefore1030(true)
            }else{
                setBefore1030(false)
            }
        }
    }

    async function handleSubmit(event){
        event.preventDefault()
        const abortController = new AbortController()
        const formDataCorrectTypes = {
            ...formData,
            people: Number(formData.people)
        }

        if(formData.reservation_time){
            if(isAfter9(formData.reservation_time)){
                setAfter930(true)
                return
            }
        }
        
        try {
            await axios.post("http://localhost:5001/reservations", {data: formDataCorrectTypes})
            history.push(`/dashboard?date=${formData.reservation_date}`)
            
        } catch (error) {
            if(error.name !== "AbortError"){
                setError(error)
            }
        }
        return () => abortController.abort();
    }

    return (
        <>
            <h1>Create a Reservation</h1>
            <ErrorAlert error={error} />
            <Form handleSubmit={handleSubmit} handleChange={handleChange} handleCancel={handleCancel} formData={formData} after930={after930} isTuesday={isTuesday} isPastDate={isPastDate} before1030={before1030} />
        </>
    )
}

export default CreateReservation