const knex = require("../db/connection")

function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}

function update(reservationSeat){
    return knex("tables")
    .select("*")
    .where({table_id: reservationSeat.table_id})
    .update(reservationSeat, "*")
    .then((updatedRecords) => updatedRecords[0])
}

function create(table){
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0])
}

function read(table_id){
    return knex("tables")
    .select("*")
    .where({table_id})
    .then((createdRecords) => createdRecords[0])
}

function destroy(){

}


module.exports = {
    list,
    update,
    create,
    read,
    destroy
}