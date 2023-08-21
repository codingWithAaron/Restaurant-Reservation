const knex = require("../db/connection")

function list(date){
    return knex("reservations")
    .select("*")
    .where({reservation_date : date})
    .whereIn("status", ["seated", "booked"])
}

function create(reservation){
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0])

}

function read(reservation_id){
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .then((createdRecords) => createdRecords[0])
}

function update(updatedReservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0])
}

function updateStatus(updatedReservation){
    return knex("reservations")
		.select("*")
		.where({ reservation_id: updatedReservation.reservation_id })
		.update({ status: updatedReservation.status }, "*")
		.then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
    list,
    create,
    read,
    update,
    updateStatus
}