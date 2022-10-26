const { insertDomain, getAllDomain } = require("./domain.counter")

const domrouter = require("express").Router()


domrouter.get("/domain", getAllDomain)


module.exports= domrouter;