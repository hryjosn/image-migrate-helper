export default {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'DreamDigger API Document',
    description: 'the description'
  },
  tags: [{
    name: 'Users',
    description: 'API for users to get the service'
  }],
  consumes: [
    'application/json'
  ],
  produces: [
    'application/json'
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    }
  },
  paths: {
    '/modifiedUserData': {
      post: {
        tags: [
          'Users'
        ],
        security: [{
          bearerAuth: []
        }],
        summary: 'modified user data',
        requestBody: {
          description: 'User basic data',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/modifiedUserData'
              }
            }
          }
        },
        produces: [
          'application/json'
        ],
        responses: {
          201: {
            description: 'OK'
          },
          401: {
            description: 'Token validation error'
          }
        }
      }
    },
    '/signUp': {
      post: {
        tags: [
          'Users'
        ],
        summary: 'create a new User',
        requestBody: {
          description: 'User basic data',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/UserSignUp'
              }
            }
          }
        },
        produces: [
          'application/json'
        ],
        responses: {
          201: {
            description: 'Successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/definitions/UserSignUpResponse'
                }
              }
            }

          },
          400: {
            description: 'Failed. Bad post data'
          }
        }
      }
    },
    '/login': {
      post: {
        tags: [
          'Users'
        ],
        summary: "to make sure User's identity",
        requestBody: {
          description: "User's email and password",
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/UserLogin'
              }
            }
          }
        },
        produces: [
          'application/json'
        ],
        responses: {
          201: {
            description: 'Successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/definitions/UserLoginResponse'
                }
              }
            }

          },
          400: {
            description: 'Failed. Bad post data'
          }
        }
      }
    },
    '/proposal/getProposalByToken': {
      get: {
        tags: [
          'Proposal'
        ],
        security: [{
          bearerAuth: []
        }],
        summary: 'get proposal by token',
        produces: [
          'application/json'
        ],
        responses: {
          201: {
            description: 'Successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/definitions/getProposalByToken'
                }
              }
            }
          },
          400: {
            description: 'Not find proposal'
          },
          401: {
            description: 'Not find token'
          }
        }
      }
    },
    '/proposal/createProposal': {
      post: {
        tags: [
          'Proposal'
        ],
        summary: 'For the users who want to create proposals',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          description: 'User Object',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/UserCreateProposal'
              }
            }
          }
        },
        produces: [
          'application/json'
        ],
        responses: {
          201: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/definitions/UserCreateProposalResponse'
                }
              }
            }
          },
          400: {
            description: 'Failed. Bad post data'
          }
        }
      }
    },
    '/proposal/getProposalByProposalId': {
      post: {
        tags: [
          'Proposal'
        ],
        summary: 'Used in user personal page, get all data of specific proposal',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          description: 'User Input Object',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/GetProposalByProposalId'
              }
            }
          }
        },
        produces: [
          'application/json'
        ],
        responses: {
          201: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/definitions/GetProposalByProposalIdResponse'
                }
              }
            }
          },
          400: {
            description: 'Failed. Bad post data'
          }
        }
      }
    },
    '/recommend/recommendProposals': {
      get: {
        tags: [
          'Recommend'
        ],
        summary: 'to recommend proposals to users',
        produces: [
          'application/json'
        ],
        responses: {
          201: {
            description: 'Successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/definitions/RecommendProposal'
                }
              }
            }

          },
          400: {
            description: 'Failed. Bad post data',
            schema: {
              $ref: '#/definitions/RecommendProposal'
            }
          }
        }
      }
    }
  },
  definitions: {
    UserSignUp: {
      type: 'object',
      required: ['legalName', 'email', 'password', 'identity'],
      properties: {
        legalName: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        password: {
          type: 'string'
        },
        identity: {
          type: 'string'
        },
        phoneNumber: {
          type: 'string'
        },
        avatar: {
          type: 'string'
        }
      }
    },
    UserLogin: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string'
        },
        password: {
          type: 'string'
        }
      }
    },
    modifiedUserData: {
      type: 'object',
      required: ['legalName', 'identity', 'email', 'phoneNumber', 'avatar'],
      properties: {
        legalName: {
          type: 'string'
        },
        identity: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        phoneNumber: {
          type: 'string'
        },
        avatar: {
          type: 'string'
        }
      }
    },
    getProposalByToken: {
      type: 'object',
      required: ['proposal_type', 'category', 'start_time', 'end_time', 'target_amount', 'plan_name', 'plan_summary', 'cover_photo', 'plan_introduction', 'web_link', 'video_link'],
      properties: {
        proposal_type: {
          type: 'string'
        },
        category: {
          type: 'string'
        },
        start_time: {
          type: 'string'
        },
        end_time: {
          type: 'string'
        },
        target_amount: {
          type: 'string'
        },
        plan_name: {
          type: 'string'
        },
        plan_summary: {
          type: 'string'
        },
        cover_photo: {
          type: 'string'
        },
        plan_introduction: {
          type: 'string'
        },
        web_link: {
          type: 'string'
        },
        video_link: {
          type: 'string'
        }
      }
    },
    UserCreateProposal: {
      type: 'object',
      required: ['proposal_type', 'category', 'start_time', 'end_time', 'target_amount', 'plan_name', 'plan_summary', 'cover_photo', 'plan_introduction', 'web_link', 'video_link'],
      properties: {
        proposal_type: {
          type: 'string'
        },
        category: {
          type: 'string'
        },
        start_time: {
          type: 'string'
        },
        end_time: {
          type: 'string'
        },
        target_amount: {
          type: 'string'
        },
        plan_name: {
          type: 'string'
        },
        plan_summary: {
          type: 'string'
        },
        cover_photo: {
          type: 'string'
        },
        plan_introduction: {
          type: 'string'
        },
        web_link: {
          type: 'string'
        },
        video_link: {
          type: 'string'
        }
      }
    },
    UserSignUpResponse: {
      type: 'object',
      properties: {
        msg: {
          type: 'string'
        },
        token: {
          type: 'string'
        }
      }
    },
    UserLoginResponse: {
      type: 'object',
      properties: {
        msg: {
          type: 'string'
        },
        token: {
          type: 'string'
        }
      }
    },
    UserCreateProposalResponse: {
      type: 'object',
      properties: {
        msg: {
          type: 'string'
        }
      }
    },
    RecommendProposal: {
      type: 'object',
      properties: {
        msg: {
          type: 'string'
        },
        data: {
          type: 'object',
          properties: {
            proposal_type: {
              type: 'string'
            },
            category: {
              type: 'string'
            },
            start_time: {
              type: 'string'
            },
            end_time: {
              type: 'string'
            },
            target_amount: {
              type: 'string'
            },
            plan_name: {
              type: 'string'
            },
            plan_summary: {
              type: 'string'
            },
            cover_photo: {
              type: 'string'
            },
            plan_introduction: {
              type: 'string'
            },
            web_link: {
              type: 'string'
            },
            video_link: {
              type: 'string'
            }
          }
        }
      }
    },
    GetProposalByProposalId: {
      type: 'object',
      required: ['proposal_id'],
      properties: {
        proposal_id: {
          type: 'number'
        }
      }
    },
    GetProposalByProposalIdResponse: {
      type: 'object',
      properties: {
        proposal_id: {
          type: 'string'
        },
        proposal_type: {
          type: 'string'
        },
        category: {
          type: 'string'
        },
        plan_name: {
          type: 'string'
        },
        start_time: {
          type: 'string'
        },
        end_time: {
          type: 'string'
        },
        target_amount: {
          type: 'string'
        },
        plan_summary: {
          type: 'string'
        },
        cover_photo: {
          type: 'string'
        },
        plan_introduction: {
          type: 'string'
        },
        web_link: {
          type: 'string'
        },
        video_link: {
          type: 'string'
        }
      }
    }
  }
}
