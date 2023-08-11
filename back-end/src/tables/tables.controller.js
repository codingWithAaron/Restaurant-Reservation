const service = require("./tables.service")

async function list(req, res, _next){
    const data = await service.list()
    res.json({data})
}

module.exports = {
    list
}