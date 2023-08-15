const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")


async function list(req, res, _next){
    const data = await service.list()
    res.json({data})
}

async function update(req, res, _next){
 const reservationSeat = {
    ...req.body.data
 }
 const data = await service.update(reservationSeat)
 res.json({data})
}

async function create(req, res, _next){
    const data = await service.create(req.body.data)
    res.status(201).json({data})
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    update: [asyncErrorBoundary(update)],
    create: [asyncErrorBoundary(create)],
}