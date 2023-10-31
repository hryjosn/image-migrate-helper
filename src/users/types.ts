export interface ISignUp {
  legalName: string,
  email: string,
  userName: string,
  introduction: string
}
export interface IUpdateUserData {
  legalName?: string,
  phoneNumber?: string,
  avatar: string,
  introduction?: string,
  id: string
}
