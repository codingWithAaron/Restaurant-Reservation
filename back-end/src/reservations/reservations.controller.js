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

function validateDateIsNotTuesday(req, res, next){
  const date = req.body.data.reservation_date
  const selectedDate = new Date(`${date}T00:00:00`)
  const dayOfWeek = selectedDate.getUTCDay()

  if(dayOfWeek === 2){
    return next({ status: 400, message: "The restuarant is closed. Please choose another day."})
  }else{
    next()
  }
}

function validateDateIsNotPast(req, res, next){
  const date = req.body.data.reservation_date
  const selectedDate = new Date(`${date}T00:00:00`)
  const currentDate = new Date()

  selectedDate.setHours(0, 0, 0, 0)
  currentDate.setHours(0, 0, 0, 0)

  if(selectedDate < currentDate){
    return next({ status: 400, message: "The date is in the past. Please choose today's date or one in the future."})
  }else{
    next()
  }
}

function validateTime(req, res, next){
  const time = req.body.data.reservation_time
  const selectedTime = new Date(`1970-01-01T${time}`)
  const earliestTime = new Date(`1970-01-01T10:30:00`)
  const latestTime = new Date(`1970-01-01T21:30:00`)

  if(selectedTime < earliestTime || selectedTime > latestTime){
    return next({status: 400, message: "Please choose a time within business hours."})
  }else{
    next()
  }
}

async function reservationExists(req, res, next){
  const reservation = await service.read(req.params.reservation_id)
  if(reservation){
    res.locals.reservation = reservation
    return next()
  }else{
    next({status: 404, message: `Reservation ${req.params.reservation_id} does not exist.`})
  }
}

function validateNotFinished(req, res, next) {
	const { status } = res.locals.reservation;

	if (status !== "booked" && status !== "seated") {
		return next({
			status: 400,
			message: "A finished reservation cannot be updated",
		});
	}
	next();
}

const StatusValues = ["booked", "seated", "finished", "cancelled"];

function validateValidStatus(req, res, next) {
	const { status } = req.body.data;

	if (!StatusValues.includes(status)) {
		return next({ status: 400, message: "unknown status" });
	}
	next();
}

function validateBookedStatus(req, res, next) {
	const { status } = req.body.data;

	if (status === "seated" || status === "finished") {
		return next({
			status: 400,
			message: `cannot make reservations for ${status} status`,
		});
	}
	next();
}

async function list(req, res, next) {
  const date = req.query.date
  const mobile_number = req.query.mobile_number
  
  if (date) {
		const data = await service.listByDate(date);
		res.json({ data });
	} else if (mobile_number) {
		const data = await service.search(mobile_number);
		res.json({ data });
	} else {
		const data = await service.list();
		res.json({ data });
	}
}

async function create(req, res, next){
 const data = await service.create(req.body.data)
 res.status(201).json({data})
}

async function read(req, res, _next){
  res.json({data: res.locals.reservation})
}

async function update(req, res, next){
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id
  }

  const data = await service.update(updatedReservation)
  res.json({data})
}

async function updateStatus(req, res, next){
  const status = req.body.data.status
  const { reservation_id } = res.locals.reservation

  const updatedReservation = {
    reservation_id: reservation_id,
    status: status
  }

  const data = await service.updateStatus(updatedReservation)
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    validateHasData,
    validatePeople,
    validateReservationDate,
    validateReservationTime,
    validatePhoneNumber,
    validateLastName,
    validateFirstName,
    validateDateIsNotTuesday,
    validateDateIsNotPast,
    validateTime,
    validateBookedStatus,
    asyncErrorBoundary(create)
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    validateHasData,
    validatePeople,
    validateReservationDate,
    validateReservationTime,
    validatePhoneNumber,
    validateLastName,
    validateFirstName,
    validateDateIsNotTuesday,
    validateDateIsNotPast,
    validateTime,
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validateValidStatus,
    validateNotFinished,
    asyncErrorBoundary(updateStatus)
  ]
};
