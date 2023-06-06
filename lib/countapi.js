const BASE_API_PATH = process.env.BASE_API_PATH || 'https://api.countapi.xyz'
const validPattern = /^[A-Za-z0-9_\-.]{3,64}$/
const validRegex = new RegExp(validPattern)

const validatePath = function (namespace, key) {
  if (typeof key === 'undefined') {
    if (typeof namespace === 'undefined') {
      return Promise.reject(new Error('Missing key'))
    }
    key = namespace
    namespace = undefined
  }

  function validName(name) {
    return validRegex.test(name) || name === ':HOST:' || name === ':PATHNAME:'
  }

  return new Promise(function (resolve, reject) {
    if (!validName(key)) {
      reject(new Error(`Key must match ${validPattern}. Got '${namespace}'`))
      return
    }
    if (
      !validName(namespace) &&
      typeof namespace !== 'undefined' &&
      namespace !== null
    ) {
      reject(
        new Error(
          `Namespace must match ${validPattern} or be empty. Got '${namespace}'`
        )
      )
      return
    }

    let path = ''
    if (typeof namespace !== 'undefined') path += namespace + '/'
    path += key

    resolve({ path })
  })
}

const validateTuple = function (namespace, key, value) {
  if (typeof value === 'undefined') {
    if (typeof key === 'undefined') {
      return Promise.reject(new Error('Missing key or value'))
    }
    value = key
    key = undefined
  }
  if (typeof value !== 'number') {
    return Promise.reject(new Error('Value is NaN'))
  }

  return validatePath(namespace, key).then(function (result) {
    return Object.assign({}, { value }, result)
  })
}

function finalize(res) {
  const validResponses = [200, 400, 403, 404]
  if (validResponses.includes(res.status)) {
    return res.json().then(function (json) {
      if (res.status === 400) return Promise.reject(new Error(json.error))
      return Object.assign(
        {},
        {
          status: res.status,
          path: res.headers.get('X-Path')
        },
        json
      )
    })
  }
  return Promise.reject(new Error('Response from server: ' + res.status))
}

function queryParams(params) {
  return Object.keys(params || {})
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}

module.exports.get = function (namespace, key) {
  return validatePath(namespace, key).then(function (result) {
    return fetch(`${BASE_API_PATH}/get/${result.path}`).then(finalize)
  })
}

module.exports.set = function (namespace, key, value) {
  return validateTuple(namespace, key, value).then(function (result) {
    return fetch(
      `${BASE_API_PATH}/set/${result.path}?value=${result.value}`
    ).then(finalize)
  })
}

module.exports.update = function (namespace, key, amount) {
  return validateTuple(namespace, key, amount).then(function (result) {
    return fetch(
      `${BASE_API_PATH}/update/${result.path}?amount=${result.value}`
    ).then(finalize)
  })
}

module.exports.hit = function (namespace, key) {
  return validatePath(namespace, key).then(function (result) {
    return fetch(`${BASE_API_PATH}/hit/${result.path}`).then(finalize)
  })
}

module.exports.info = function (namespace, key) {
  return validatePath(namespace, key).then(function (result) {
    return fetch(`${BASE_API_PATH}/info/${result.path}`).then(finalize)
  })
}

module.exports.create = function (options) {
  const params = queryParams(options)
  return fetch(
    `${BASE_API_PATH}/create${params.length > 0 ? '?' + params : ''}`
  ).then(finalize)
}

module.exports.stats = function () {
  return fetch(`${BASE_API_PATH}/stats`).then(finalize)
}

module.exports.visits = function (page) {
  return this.hit(':HOST:', page || ':PATHNAME:')
}

module.exports.event = function (name) {
  return this.hit(':HOST:', name)
}
