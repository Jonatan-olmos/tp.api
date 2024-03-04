const path = require("path");
const db = require("../../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require("moment");
const createError = require("http-errors");
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;
const genresController = {
    list: (req, res) => {
        db.Genre.findAll()
            .then((genres) => {
                return res.status(200).json({
                    ok : true,
                    meta : {
                        status : 200,
                        total : genres.length,
                        URL: `${req.protocol}://${req.get("host")}/api/generes`,

                    }
                })
            })
    },
    'detail': (req, res) => {
        db.Genre.findByPk(req.params.id)
            .then(genre => {
                res.render('genresDetail.ejs', {genre});
            });
    }

}

module.exports = genresController;