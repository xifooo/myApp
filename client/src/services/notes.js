import axios from "axios"

const baseUrl = "http://localhost:3001/api/notes"

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const create = async newObject => {
  const config = {
    headers: { "Authorization": token }
  }
  const res = await axios.post(baseUrl, newObject, config)
  return res.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { "Authorization": token }
  }
  const res = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return res.data
}

const remove = async id => {
  const config = {
    headers: { "Authorization": token }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}
export default { setToken, getAll, create, update, remove }