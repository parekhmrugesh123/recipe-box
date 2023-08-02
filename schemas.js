const Joi = require('joi');

module.exports.RecipeBoxSchema = Joi.object({
    recipe: Joi.object({
        name: Joi.string().required(),
        summary: Joi.string().required(),
        image: Joi.string().required(),
        cooktime: Joi.number().required().min(0),
        ingredients: Joi.string().required(),
        directions: Joi.string().required(),
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required(),
    }).required()
});