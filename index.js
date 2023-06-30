const load = async function (path, into) {
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

const sleep = function (time, s = 0.5) {
  return new Promise((r) => setTimeout(r, s * 1000))
}

const clearErrors = function (field) {
  var el = q(`.${field.name}-errors`, field.parentNode)
  if (!el) return
  el.style.opacity = 0
  setTimeout(function () {
    text(el, '')
    el.style.opacity = 1
  }, 210)
}

const showErrors = function (result, options = {}) {
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

const goBack = function () {
  history.go(-(store('root') || 1))
}

const navCount = function (add) {
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

const isImage = function (name) {
  return /\.(gif|jpe?g|tiff|png|bmp|svg)$/i.test(name)
}

const closeWindow = function (e) {
  if (e.code == 'Escape') {
    goBack()
  }
}

const truncate = function (str = '', size = 32) {
  return str.length > size ? str.substring(0, size).trim() + ' ...' : str
}

const toggleVisibility = function (options = {}, fn) {
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

const setActiveLink = function (options = {}) {
  document.querySelectorAll(options.selector || 'a').forEach(function (el) {
    if (el.pathname == location.pathname) {
      el.classList.add(options.active || 'active')
    }
  })
}

const handleLogout = function (options = {}, fn) {
  var name = options.cookie || 'session'
  if (cookie(name)) cookie(name, null)
  if (fn) fn()
}

const handleToggleMenu = function () {
  q('#main-menu', (el) => el.classList.toggle('open'))
}

const handleCloseMenus = function (event) {
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

module.exports = {
  load,
  sleep,
  clearErrors,
  showErrors,
  goBack,
  navCount,
  isImage,
  closeWindow,
  truncate,
  toggleVisibility,
  setActiveLink,
  handleLogout,
  handleToggleMenu,
  handleCloseMenus
}
