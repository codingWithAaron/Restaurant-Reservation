const knex = require("../db/connection")

function list(){
    return knex("tables")
    .select("*")
}

function update(reservationSeat){
    return knex("tables")
    .select("*")
    .where({table_id: reservationSeat.table_id})
    .update(reservationSeat, "*")
}

function create(table){
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0])
}

module.exports = {
    list,
    update,
    create
}