export interface JwtPayload {
  nameid: string
  unique_name: string
  email: string
  role: string
  nbf: number
  exp: number
  iat: number
  iss: string
  aud: string
}