import axios from "axios"
const baseUrl = "http://localhost:3001/api/notes"

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const req = await axios.post(baseUrl, newObject, config)
  return req.data
}

const update = async (id, newObject) => {
  const res = await axios.put(`${baseUrl}/${id}`, newObject)
  return res.data
}
export default { setToken, getAll, create, update }