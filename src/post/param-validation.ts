import Joi from 'joi'

export default {
  createPost: Joi.object({
    body: Joi.object().keys({
      content: Joi.string().required().max(500).allow('')
    }).unknown(true),
    files: Joi.object().keys({
      picture: Joi.array().required()
    })
  }).unknown(true),
  updatePost: Joi.object({
    body: Joi.object().keys({
      content: Joi.string().required().max(500).allow('')
    }),
    files: Joi.object().keys({

      picture: Joi.array().required()
    })
  }).unknown(true),

  reportPost: {
    body: Joi.object().keys({
      reportType: Joi.string().required().min(1).max(50),
      content: Joi.when('reportType', { is: Joi.string().valid('Something else'), then: Joi.string().required().min(5).max(500), otherwise: Joi.string().required().allow('') })
    })
  },

  newComment: {
    body: Joi.object().keys({
      comment: Joi.string().required().min(1).max(500)
    })
  },
  pagination: {
    body: Joi.object().keys({
      page: Joi.number().max(30),
      count: Joi.number().max(30)
    })
  }
}
