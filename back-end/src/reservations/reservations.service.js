const knex = require("../db/connection")

function list() {
	return knex("reservations")
		.select("*")
		.whereIn("status", ["seated", "booked"])
		.orderBy("reservation_date", "asc")
		.orderBy("reservation_time", "asc");
}

function listByDate(reservation_date) {
	return knex("reservations")
		.select("*")
		.where({ reservation_date })
		.whereIn("status", ["seated", "booked"])
		.orderBy("reservation_time", "asc");
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

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
}

module.exports = {
    list,
    create,
    read,
    update,
    updateStatus,
    search,
    listByDate
}