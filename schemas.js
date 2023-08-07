const Joi = require('joi');

module.exports.RecipeBoxSchema = Joi.object({
    recipe: Joi.object({
        name: Joi.string().required(),
        summary: Joi.string().required(),
        // images: Joi.string().required(),
        cooktime: Joi.number().required().min(0),
        ingredients: Joi.string().required(),
        directions: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required(),
    }).required()
});