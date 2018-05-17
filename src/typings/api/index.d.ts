declare module 'api' {
  namespace API {
    namespace Welcome {
      interface Request {
        name: string
      }
      interface Response {
        message: string
      }
    }
  }
  export default API
}
