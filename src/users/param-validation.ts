import Joi from 'joi'

export default {
  modifiedUserData: Joi.object({
    body: Joi.object().keys({
      legalName: Joi.string().required().max(30),
      phoneNumber: Joi.string().required().max(20),
      introduction: Joi.string().max(100).allow('')
    }),
    files: Joi.object().keys({
      avatar: Joi.array()
    })
  }).unknown(true),
  modifiedIdentity: {
    body: Joi.object().keys({
      userName: Joi.string().regex(/^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/).required().max(30)
    })
  },
  upgradeUser: {
    body: Joi.object().keys({
      legalName: Joi.string().required().min(1).max(10),
      email: Joi.string().email().trim().required().max(30),
      introduction: Joi.string().max(200).allow('')
    })
  },
  login: {
    body: Joi.object().keys({
      // email: Joi.string().email().trim().required().max(60),
      userName: Joi.string().regex(/^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/).required().min(5).max(30),
      password: Joi.string().regex(/[a-zA-Z0-9]{8,30}$/).required()
    })
  }
}
