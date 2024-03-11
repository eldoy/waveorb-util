var load = async function (path, into) {
  var res = await fetch(path)
  res = await res.text()
  if (into) {
    var el = html(into, res)
    qa('script', el, function (script) {
      if (!script.loaded) {
        script.loaded = true
        eval(script.textContent)
      }
    })
  }
  return res
}

var sleep = function (s = 0.5) {
  return new Promise((r) => setTimeout(r, s * 1000))
}

var clearErrors = function (field) {
  var el = q(`.${field.name}-errors`, field.parentNode)
  if (!el) return
  el.style.opacity = 0
  setTimeout(function () {
    text(el, '')
    el.style.opacity = 1
  }, 210)
}

var showErrors = function (result, options = {}) {
  if (!result.error) return
  options = Object.assign({ class: 'error' }, options)
  qa('form em', function (el) {
    text(el, '')
  })
  flash(result.error.message, options)
  for (var key in result) {
    if (key !== 'error') {
      for (var field in result[key]) {
        text(`.${field}-errors`, result[key][field][0])
      }
    }
  }
  return true
}

var goBack = function () {
  history.go(-(store('root') || 1))
}

var navCount = function (add) {
  if (!add) {
    store('root', null)
    store('last', null)
    return
  }
  var path = location.pathname
  var last = store('last')
  if (!last || last != path) {
    store('root', (store('root') || 0) + 1)
  }
  store('last', path)
}

var isImage = function (name) {
  return /\.(gif|jpe?g|tiff|png|bmp|svg)$/i.test(name)
}

var closeWindow = function (e) {
  if (e.code == 'Escape') {
    goBack()
  }
}

var tr = function (str = '', size = 32) {
  return str.length > size ? str.substring(0, size).trim() + ' ...' : str
}

var toggleVisibility = function (options = {}, fn) {
  var pub = options.pub || 'public'
  var priv = options.priv || 'private'
  var selector = '.' + pub + ',.' + priv
  var session = cookie(options.cookie || 'session')
  var toggle =
    fn ||
    function (el) {
      var isPublic = el.classList.contains(pub)
      var isPrivate = el.classList.contains(priv)
      if ((session && isPublic) || (!session && isPrivate)) {
        el.style.display = 'none'
      }
    }
  document.querySelectorAll(selector).forEach(toggle)
}

var setActiveLink = function (options = {}) {
  document.querySelectorAll(options.selector || 'a').forEach(function (el) {
    if (el.pathname == location.pathname) {
      el.classList.add(options.active || 'active')
    }
  })
}

var handleLogout = function (options = {}, fn) {
  var name = options.cookie || 'session'
  if (cookie(name)) cookie(name, null)
  if (fn) fn()
}

var handleToggleMenu = function () {
  q('#main-menu', (el) => el.classList.toggle('open'))
}

var handleCloseMenus = function (event) {
  event.stopPropagation()
  var el = event.target,
    toggle
  while (el) {
    if (el.classList.contains('open')) return
    var menu = el.getAttribute('data-toggle')
    if (menu) {
      toggle = q(menu)
      break
    }
    el = el.parentElement
  }
  qa('.open', (item) => {
    if (item != toggle) {
      item.classList.remove('open')
    }
  })
}

var handleClearErrors = function (field) {
  var el = q(`.${field.name}-errors`, field.form)
  if (!el) return
  el.style.opacity = 0
  setTimeout(function () {
    text(el, '')
    el.style.opacity = 1
  }, 210)
}

var handleFormOptions = function (form, opt = {}) {
  if (typeof opt.scroll == 'undefined') {
    opt.scroll = form.getAttribute('data-scroll') == 'true' ? true : false
  }
  return opt
}

var handlePayload = function (query, values) {
  var payload = {}
  if (Object.keys(query).length) {
    payload.query = query
  }
  if (Object.keys(values).length) {
    payload.values = values
  }
  return payload
}

var handleQueryParams = function (form) {
  var query = form.getAttribute('data-query') || ''
  if (query.startsWith('window.')) {
    var name = query.split('.')[1]
    query = window[name]
  } else {
    var names = query.split(' ').map((x) => x.trim())
    query = {}
    for (var name of names) {
      var [a, n] = name.split(':')
      if (a) {
        query[a] = window.params(n ? parseInt(n) : a)
      }
    }
  }
  return query
}

var handleRedirect = function (form, opt = {}) {
  var message = form.getAttribute('data-message')
  var redirect = form.getAttribute('data-redirect') || 'back'
  if (redirect == 'none') {
    if (message) {
      flash(message, opt)
    }
  } else {
    if (!/https?:/.test(redirect)) {
      cookie('flash', message)
    }
    if (redirect == 'back') {
      window.back()
    } else if (redirect == 'reload') {
      window.location = window.location.href
    } else {
      window.location = redirect
    }
  }
}

var handleSubmit = async function (btn, opt = {}) {
  btn.disabled = true
  var form = btn.form
  opt = window.handleFormOptions(form, opt)
  var action = form.getAttribute('action')
  var query = window.handleQueryParams(form)
  var values = serialize(form)
  var payload = window.handlePayload(query, values)
  var result = await api(action, payload)
  btn.disabled = false
  if (handleShowErrors(form, result, opt)) {
    if (typeof opt.onerror == 'function') {
      await opt.onerror(result)
    }
  } else {
    if (typeof opt.onsave == 'function') {
      await opt.onsave(result)
    } else {
      window.handleRedirect(form)
    }
  }
}

var handleShowErrors = function (form, result, opt = {}) {
  if (!result.error) return
  qa('em', form, function (el) {
    text(el, '')
  })
  flash(result.error.message, opt)
  for (var key in result) {
    if (key != 'error') {
      for (var field in result[key]) {
        var em = q(`.${field}-errors`, form)
        var val = result[key][field][0]
        if (em && val) {
          text(em, val)
        }
      }
    }
  }
  return true
}

var handleUpload = async function (input) {
  var action = input.getAttribute('data-action')
  var size = input.getAttribute('data-size')
  var name = input.getAttribute('data-name')
  var options = {
    files: input.files,
    progress: function (event) {
      window.handleUploadProgress(input, event)
    }
  }
  var result = await api(action, {}, options)
  if (!window.handleShowErrors(input.form, result)) {
    var file = result[0]
    q(`.${name}-file`).value = file.url
    html(`.${name}-image`, window.renderUploadImage(file, { size }))
  }
}

var handleUploadProgress = function (input, event) {
  var name = input.getAttribute('data-name')
  if (!name) return
  var { loaded, total, percent } = event
  loaded = `${(loaded / 1024).toFixed(2)} kB`
  total = `${(total / 1024).toFixed(2)} kB`
  var progress = q(`.${name}-progress`, input.form)
  if (progress) {
    text(progress, `${loaded}/${total}, ${percent}%`)
  }
}

var handleUploadReset = function (el) {
  el.value = ''
  var name = el.getAttribute('data-name')
  if (name) {
    var em = q(`.${name}-errors`, el.form)
    if (em) {
      text(em, '')
    }
    var progress = q(`.${name}-progress`, el.form)
    if (progress) {
      text(progress, '')
    }
  }
}

var renderUploadImage = function (file, opt = {}) {
  var { size = 100 } = opt
  return /* HTML */ `<img
    src="${file.url}"
    style="height:${size}px"
    height="${size}"
    alt="${file.name || ''}"
  />`
}

module.exports = {
  load,
  sleep,
  clearErrors,
  showErrors,
  goBack,
  navCount,
  isImage,
  closeWindow,
  tr,
  toggleVisibility,
  setActiveLink,
  handleLogout,
  handleToggleMenu,
  handleCloseMenus,
  handleClearErrors,
  handleFormOptions,
  handleQueryParams,
  handleRedirect,
  handlePayload,
  handleSubmit,
  handleShowErrors,
  handleUpload,
  handleUploadProgress,
  handleUploadReset,
  renderUploadImage
}
