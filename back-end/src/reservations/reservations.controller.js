const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const date = JSON.stringify(req.query.date)
  const data = await service.list(date)
  res.json({data});
}

async function create(req, res, next){
 const data = await service.create(req.body.data)
 res.status(201).json({data})
}

module.exports = {
  list,
  create: asyncErrorBoundary(create)
};
