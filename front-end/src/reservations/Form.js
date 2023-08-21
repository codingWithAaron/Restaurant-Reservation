import React from "react";

function Form({handleSubmit, handleChange, handleCancel, reservation, isTuesday, isPastDate, before1030, after930}){
    return (
        <>
            <div className="border border-dark m-4 p-4">
                <form onSubmit={handleSubmit} >
                    <label htmlFor="first_name">First Name:</label>
                    <input id="first_name" name="first_name" type="text" required value={reservation.first_name} onChange={handleChange} />

                    <label htmlFor="last_name">Last Name:</label>
                    <input id="last_name" name="last_name" type="text" required value={reservation.last_name} onChange={handleChange} />


                    <label htmlFor="mobile_number">Mobile Number:</label>
                    <input id="mobile_number" name="mobile_number" type="text" pattern="^\d{3}-\d{3}-\d{4}$" title="Please enter a valid 10 digit phone number." placeholder="123-456-7890" required value={reservation.mobile_number} onChange={handleChange} />

                    <label htmlFor="reservation_date">Reservation Date:</label>
                    <input id="reservation_date" name="reservation_date" type="date" required value={reservation.reservation_date} onChange={handleChange} />

                    <label htmlFor="reservation_time">Reservation Time:</label>
                    <input id="reservation_time" name="reservation_time" type="time" required value={reservation.reservation_time} onChange={handleChange} />

                    <label htmlFor="people">Number of People:</label>
                    <input id="people" name="people" type="number" min={1} required value={reservation.people} onChange={handleChange} />

                    <button className="ml-2" type="submit">Submit</button>
                    <button className="ml-2" onClick={handleCancel}>Cancel</button>

                    {isTuesday && !isPastDate ? <div className="alert alert-danger"><p>The restaurant is closed on Tuesdays. Please choose another day.</p></div> : ""}
                    {isPastDate && !isTuesday ? <div className="alert alert-danger"><p>You picked a date that is in the past. Please choose a different date.</p></div> : ""}
                    {isTuesday && isPastDate ? <div className="alert alert-danger"><p>The restaurant is closed on Tuesdays. Please choose another day.</p> <p>You also picked a date that is in the past. Please choose a different date.</p></div> : ""}
                    {before1030 ? <div className="alert alert-danger"><p>Please choose a time after 10:30 AM.</p></div> : ""}
                    {after930 ? <div className="alert alert-danger"><p>Please choose a time before 9:30 PM.</p></div> : ""}
                </form>
            </div>
        </>
    )
}

export default Form