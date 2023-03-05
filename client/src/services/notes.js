import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update }