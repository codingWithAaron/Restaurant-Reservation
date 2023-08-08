const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

/**
 * List handler for reservation resources
 */

function validateHasData(req, res, next){
  if(req.body.data){
    return next()
  }else{
    next({ status: 400, message: "The Body must have a data property."})
  }
}

function validatePeople(req, res, next){
  const numberOfPeople = Number(req.body.data.people)
  const peopleisNumber = req.body.data.people

  if(numberOfPeople < 1){
    return next({ status: 400, message: "people must be either 1 or more."})
  }else if (!Number.isInteger(peopleisNumber)){
    return next({ status: 400, message: "people must be a number."})
  }else{
    next()
  }
}

function validateReservationDate(req, res, next){
  const date = req.body.data.reservation_date
  const dateFormat = /\d{4}-\d{2}-\d{2}/

  if(!date){
    return next({ status: 400, message: "reservation_date must be filled in."})
  }else if(!dateFormat.test(date)){
    return next({ status: 400, message: "reservation_date must be in the format YYYY-MM-DD"})
  }else{
    next()
  }
}

function validateReservationTime(req, res, next){
  const time = req.body.data.reservation_time
  const timeFormat = /[0-9]{2}:[0-9]{2}/

  if(!time){
    return next({ status: 400, message: "reservation_time must be filled in."})
  }else if(!timeFormat.test(time)){
    return next({ status: 400, message: "reservation_time must be in the format YYYY-MM-DD"})
  }else{
    next()
  }
}

function validatePhoneNumber(req, res, next){
  const phoneNumber = req.body.data.mobile_number

  if(!phoneNumber){
    return next({ status: 400, message: "mobile_number must not be empty."})
  }else{
    next()
  }

}

function validateLastName(req, res, next){
  const lastName = req.body.data.last_name

  if(!lastName){
    return next({ status: 400, message: "last_name must not be empty."})
  }else{
    next()
  }

}

function validateFirstName(req, res, next){
  const firstName = req.body.data.first_name

  if(!firstName){
    return next({ status: 400, message: "first_name must not be empty."})
  }else{
    next()
  }

}

async function list(req, res) {
  const date = JSON.stringify(req.query.date)
  const data = await service.list(date)
  const sortedData = data.sort((elementA, elementB) => {
    const timeA = new Date(`1970-01-01T${elementA.reservation_time}`)
    const timeB = new Date(`1970-01-01T${elementB.reservation_time}`)
    return timeA - timeB
  })
  res.json({data: sortedData});
}

async function create(req, res, next){
 const data = await service.create(req.body.data)
 res.status(201).json({data})
}

module.exports = {
  list,
  create: [
    validateHasData,
    validatePeople,
    validateReservationDate,
    validateReservationTime,
    validatePhoneNumber,
    validateLastName,
    validateFirstName,
    asyncErrorBoundary(create)
  ]
};
