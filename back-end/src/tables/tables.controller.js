const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function validateTableisOccupied(req, res, next){
    const { table_id } = req.body.data
    const data = await service.read(table_id)

    if(data.reservation_id === null){
        next()
    }else{
        return next({status: 400, message: "Table is occupied."})
    }
}

function validateHasData(req, res, next){
    const data = req.body.data
    if(data){
        next()
    }else{
        return next({status: 400, message: "Must contain data in the body."})
    }
}

async function list(req, res, _next){
    const data = await service.list()
    res.json({data})
}

async function update(req, res, _next){
 const reservationSeat = {
    ...req.body.data
 }
 console.log("This is the reservation seat ############", reservationSeat)
 const data = await service.update(reservationSeat)
 res.json({data})
}

async function create(req, res, _next){
    const data = await service.create(req.body.data)
    res.status(201).json({data})
}


module.exports = {
    list: [asyncErrorBoundary(list)],
    update: [
        validateHasData,
        asyncErrorBoundary(validateTableisOccupied),
        asyncErrorBoundary(update)
    ],
    create: [asyncErrorBoundary(create)],
}