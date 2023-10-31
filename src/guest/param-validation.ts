import Joi from 'joi'

export default {
  signUp: Joi.object({
    body: Joi.object().keys({
      userName: Joi.string().regex(/^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/).required().min(5).max(30),
      password: Joi.string().min(8).max(30).required(),
      phoneNumber: Joi.string().required().max(20)
    }),
    files: Joi.object().keys({
      avatar: Joi.array().required(),
      verifyPhoto: Joi.array().required()
    })
  }).unknown(true),
  praise: {
    body: Joi.object().keys({
      isLike: Joi.boolean().required()
    })
  },
  pagination: {
    body: Joi.object().keys({
      page: Joi.number().max(30),
      count: Joi.number().max(30)
    })
  },
  updateAvatar:
    Joi.object({
      files: Joi.object().keys({
        avatar: Joi.array().required()
      })
    }).unknown(true)

}
