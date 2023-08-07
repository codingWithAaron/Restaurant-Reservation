import React, { useState } from "react";
import axios from "axios"

function NewReservation(){
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    }
    const [formData, setFormData] = useState(initialFormData)

    function handleChange(event){
        let newFormData = {...formData}
        newFormData[event.target.name] = event.target.value
        setFormData(newFormData)
    }

    function handleSubmit(event){
        event.preventDefault()
        axios.post("/reservations/new", formData)
        .then((response) => {
            console.log("Response:", response.data)
        })
        .catch((error) => {
            console.log("Error:", error)
        })
        setFormData(initialFormData)
    }

    return (
        <>
            <div className="border border-dark m-4 p-4">
                <form onSubmit={handleSubmit} >
                    <label htmlFor="first_name">First Name:</label>
                    <input id="first_name" name="first_name" type="text" required value={formData.first_name} onChange={handleChange} />

                    <label htmlFor="last_name">Last Name:</label>
                    <input id="last_name" name="last_name" type="text" required value={formData.last_name} onChange={handleChange} />

                    <label htmlFor="mobile_number">Mobile Number:</label>
                    <input id="mobile_number" name="mobile_number" type="text" pattern="^\d{3}-\d{3}-\d{4}$" title="Please enter a valid 10 digit phone number." placeholder="123-456-7890" required value={formData.mobile_number} onChange={handleChange} />

                    <label htmlFor="reservation_date">Reservation Date:</label>
                    <input id="reservation_date" name="reservation_date" type="date" required value={formData.reservation_date} onChange={handleChange} />

                    <label htmlFor="reservation_time">Reservation Time:</label>
                    <input id="reservation_time" name="reservation_time" type="time" required value={formData.reservation_time} onChange={handleChange} />

                    <label htmlFor="people">Number of People:</label>
                    <input id="people" name="people" type="number" min={1} required value={formData.people} onChange={handleChange} />

                    <button type="submit">Submit</button>
                    <button>Cancel</button>
                </form>
            </div>
        </>
    )
}

export default NewReservation