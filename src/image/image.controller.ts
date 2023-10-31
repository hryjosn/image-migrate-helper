import { Request, Response } from 'express'

import { getImageUrl } from '../utils/assetHelper'

interface IApi {
  (req: Request, res: Response): void;
}
export const getImage:IApi = async (req, res) => {
  try {
    const { id } = req.params

    const data = await getImageUrl(id)
    res.end(data)
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}
