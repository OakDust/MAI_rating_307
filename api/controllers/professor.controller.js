const Professor = require('../models/professor')


exports.showProfessors = async (req, res) => {
    const professors = await Professor.findAll()

    res.status(200).json(professors)
}