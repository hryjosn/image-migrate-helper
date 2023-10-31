import { Upload } from '@aws-sdk/lib-storage'
import { S3, GetObjectCommand } from '@aws-sdk/client-s3'


import { v4 as uuidv4 } from 'uuid'

export const uploadFiles = async (
  file:any
):Promise<string> => {
  const s3Client = new S3({ region: process.env.CLOUDWATCH_REGION })

  const name = uuidv4()
  await new Upload({
    client: s3Client,

    params: {
      Body: file,
      Key: name,
      Bucket: process.env.AWS_S3_BUCKET as string
    }
  })
    .done()
  return name
}

export const getImageUrl = async (id:string) => {
  const s3Client = new S3({ region: process.env.CLOUDWATCH_REGION })

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: id
  })

  try {
    const response = await s3Client.send(command)
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const result = await response.Body?.transformToByteArray()
    return result
  } catch (err) {
    console.error(err)
  }
}
export const parseImageUrl = (id:string) => `${process.env.HOST_URL}/image/${id}`
