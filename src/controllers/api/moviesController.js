const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;
const modelResponseMovie = {
    attributes : {
        exclude : ['genre_id','created_at','updated_at']
    },
    include : [
        {
            association : 'genre',
            attributes : ['name','ranking']
        }
    ],
}

const moviesController = {
    list: async (req, res) => {
try {

    const movies = await db.Movie.findAll( modelResponseMovie )

        return res.status(200).json({
            ok : true,
            meta : {
                status : 200,
                total : movies.length,
                url : `${req.protocol}://${req.get('host')}/api/movies`
            },
                data : movies
        })


} catch (error) {
    return res.status(error.status || 500).json({
        ok : false,
        msg : error.message || "upss, hubo un Error. Llamá a Joni!!"
    })
}

    },
    detail:async (req, res) => {
        let error;

        if(isNaN(req.params.id)){

            error = new Error("ID inválido")

            error.status = 400;

            throw error

            }
        try {
           const movie = await db.Movie.findByPk(req.params.id, modelResponseMovie)

           if(!movie){
            error = new Error("no hay una pelicula con ese ID")
            error.status = 404;
            throw error
        }
           return res.status(200).json({
            ok : true,
            meta : {
                status : 200,
                url : `${req.protocol}://${req.get('host')}/api/movies/${movie.id}`
            },
                data : movie
        });



        } catch (error) {
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message || "upss, hubo un Error. Llamá a Joni!!"
            })
        }

    },
    newest: async (req, res) => {
       try {
       const movies = await db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5,
            ...modelResponseMovie
        })
    
        return res.status(200).json({
            ok : true,
            meta : {
                status : 200,
                total : movies.length,
                url : `${req.protocol}://${req.get('host')}/api/movies/new`
            },
                data : movies
        })

       } catch (error) {
        return res.status(error.status || 500).json({
            ok : false,
            msg : error.message || "upss, hubo un Error. Llamá a Joni!!"
        })
       }
    },
    recomended: async (req, res) => {
        
        try {
            const movies = await   db.Movie.findAll({
                include: ['genre'],
                where: {
                    rating: {[db.Sequelize.Op.gte] : 8}
                },
                order: [
                    ['rating', 'DESC']
                ],
                ...modelResponseMovie
            })
            return res.status(200).json({
                ok : true,
                meta : {
                    status : 200,
                    total : movies.length,
                    url : `${req.protocol}://${req.get('host')}/api/movies/recommended`
                },
                    data : movies
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok : false,
                msg : error.message || "upss, hubo un Error. Llamá a Joni!!"
            })
        }

    },
    //Aqui dispongo las rutas para trabajar con el CRUD

    create: function (req,res) {
        Movies
        .create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            }
        )
        .then(()=> {
            return res.redirect('/movies')})
        .catch(error => res.send(error))
    },
   
    update: function (req,res) {
        let movieId = req.params.id;
        Movies
        .update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
            })
        .then(()=> {
            return res.redirect('/movies')})
        .catch(error => res.send(error))
    },

    destroy: function (req,res) {
        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/movies')})
        .catch(error => res.send(error))
    }
}

module.exports = moviesController;