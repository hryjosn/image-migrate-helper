import { ReportPost } from '../../entities/ReportPost'
import { INewReport } from './type'

export default class ReportModel {
  async addOne (params: INewReport) {
    const { user, post, reportType, content } = params
    const newReport = new ReportPost()
    newReport.user = user
    newReport.post = post
    newReport.report_type = reportType
    newReport.content = content
    return newReport.save()
  }

  async findReportedPostId (userId:string) {
    return ReportPost.createQueryBuilder('reportPost')
      .leftJoin('reportPost.user', 'user')
      .leftJoin('reportPost.post', 'post')
      .where('user.id =  :userId', { userId })
      .select(['reportPost.id', 'post.id'])
      .getMany()
  }
}
