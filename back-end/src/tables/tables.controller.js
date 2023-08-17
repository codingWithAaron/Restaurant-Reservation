const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("../reservations/reservations.service");

function validateHasData(req, res, next) {
  const data = req.body.data;
  if (data) {
    next();
  } else {
    return next({ status: 400, message: "Must contain data in the body." });
  }
}

async function validateTableExists(req, res, next) {
  const table = await service.read(req.params.table_id);

  if (table) {
    res.locals.table = table;
    return next();
  } else {
    next({
      status: 404,
      message: `Table ${req.params.table_id} does not exist.`,
    });
  }
}

async function validateTableIsNotOccupied(req, res, next) {
  const data = await service.read(req.params.table_id);
  if (data.reservation_id === null) {
    return next({
      status: 400,
      message: `Table with id ${req.params.table_id} is not occupied.`,
    });
  } else {
    next();
  }
}

function validateHasReservationId(req, res, next) {
  const { data } = req.body;

  if (data.reservation_id) {
    next();
  } else {
    return next({ status: 400, message: "Body must have a reservation_id." });
  }
}

async function validateReservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist.`,
    });
  }
}

function validateTableCanFitPeople(req, res, next) {
  const tableCapacity = res.locals.table.capacity;
  const numberOfPeople = res.locals.reservation.people;

  if (tableCapacity < numberOfPeople) {
    return next({
      status: 400,
      message: `The tables capacity is ${tableCapacity} people. Please choose a different table.`,
    });
  } else {
    next();
  }
}

function validateTableIsOccupied(req, res, next) {
  const table = res.locals.table;

  if (table.reservation_id) {
    return next({
      status: 400,
      message: "The table is occupied. Please choose a different one.",
    });
  } else {
    next();
  }
}

function validateCapacityIsNumber(req, res, next) {
  const capacity = req.body.data.capacity;

  if (!Number.isInteger(capacity)) {
    return next({
      status: 400,
      message: "Table capacity needs to be a number.",
    });
  } else if (capacity < 1) {
    return next({
      status: 400,
      message: "Table capacity needs to be at least 1.",
    });
  } else {
    next();
  }
}

function validateTableName(req, res, next){
    const name = req.body.data.table_name

    if(!name){
        return next({status:400, message:"Must contain a table_name."})
    }else if(name.length < 2){
        return next({status: 400, message:"table_name must be at least 2 characters."})
    }else{
        next()
    }
}

async function list(req, res, _next) {
  const data = await service.list();
  res.json({ data });
}

async function update(req, res, _next) {
  const updatedTable = {
    ...res.locals.table,
    table_id: res.locals.table.table_id,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const updatedReservation = {
    ...res.locals.reservation,
    reservation_id: res.locals.reservation.reservation_id,
    status: "seated",
  };

  await reservationsService.update(updatedReservation);

  const data = await service.update(updatedTable);
  res.json({ data });
}

async function create(req, res, _next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function destroy(req, res, _next) {
  const table = await service.read(req.params.table_id);
  const updatedTable = {
    ...table,
    reservation_id: null,
  };

  const data = await service.update(updatedTable);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  update: [
    validateHasData,
    validateHasReservationId,
    asyncErrorBoundary(validateTableExists),
    asyncErrorBoundary(validateReservationExists),
    validateTableCanFitPeople,
    validateTableIsOccupied,
    asyncErrorBoundary(update),
  ],
  create: [
    validateHasData,
    validateCapacityIsNumber,
    validateTableName,
    asyncErrorBoundary(create),
  ],
  delete: [
    asyncErrorBoundary(validateTableExists),
    asyncErrorBoundary(validateTableIsNotOccupied),
    asyncErrorBoundary(destroy),
  ],
};
