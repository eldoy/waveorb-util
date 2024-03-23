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

var truncate = function (str, l = 20) {
  if (str.length < l) return str
  return str.slice(0, l) + '...'
}

var setActiveLink = function (options = {}) {
  document.querySelectorAll(options.selector || 'a').forEach(function (el) {
    if (el.pathname == location.pathname) {
      el.classList.add(options.active || 'active')
    }
  })
}

var logout = function (options = {}, fn) {
  var name = options.cookie || 'session'
  if (cookie(name)) cookie(name, null)
  if (fn) fn()
}

var toggleMenu = function (el) {
  q(el || '#main-menu', (m) => m.classList.toggle('open'))
}

var closeMenus = function (event) {
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

var track = function () {
  var t = store('track') || []
  var path = location.pathname + location.search
  if (t[t.length - 1] != path) {
    t.push(path)
    t = t.slice(-100)
  }
  return store('track', t)
}

var back = function () {
  var t = store('track') || []
  var path = t[t.length - 2]
  if (path) {
    return (location = path)
  }
  history.go(-1)
}

var last = function () {
  var t = store('track') || []
  return t[t.length - 2] || ''
}

var handleToggleHelp = function (toggler) {
  var h = toggler.nextElementSibling
  h.style.display = h.style.display == 'none' ? 'block' : 'none'
}

var isVisible = function (el, container) {
  let { top, height, bottom } = el.getBoundingClientRect()
  let containerRect = container.getBoundingClientRect()

  return top <= containerRect.top
    ? containerRect.top - top <= height
    : bottom - containerRect.bottom <= height
}

var longtime = function (d) {
  return time(d, { lang: 'no', dateStyle: 'full', timeStyle: 'long' })
}

var mediumtime = function (d) {
  return time(d, { lang: 'no', dateStyle: 'short', timeStyle: 'medium' })
}

var smoothScroll = function (target, offset = 0) {
  if (typeof target == 'string') {
    target = q(target)
  }
  var top =
    Math.round(
      target.getBoundingClientRect().top + document.documentElement.scrollTop
    ) - offset
  window.scrollTo({
    top,
    left: 0,
    behavior: 'smooth'
  })
}

var scrollToError = function (form = '') {
  if (typeof form == 'string') {
    form = q(form)
  }
  if (!form) return
  var em = q('em:not(:empty)', form)
  if (!em) return
  smoothScroll(em.parentNode, 20)
}

var scrollModal = function (top = 0) {
  return q('.modal-content').scroll({ top })
}

var download = function (url) {
  var a = document.createElement('a')
  a.setAttribute('target', '_blank')
  a.setAttribute('href', url)
  a.style.display = 'none'
  document.body.append(a)
  a.click()

  setTimeout(function () {
    a.remove()
  }, 100)
}

var dropdownOpen = function (a) {
  a.classList.toggle('toggle-open')
  q('#main-menu', (el) => el.classList.toggle('toggle-open'))
}

var dropdownBlur = function (opt = {}) {
  if (!opt.toggler) opt.toggler = 'toggle-open'
  if (!opt.ref) opt.ref = 'data-toggle'

  document.addEventListener('click', function (e) {
    e.stopPropagation()
    var el = e.target,
      toggle

    while (el) {
      if (el.classList.contains(opt.toggler)) return
      var ref = el.getAttribute(opt.ref)
      if (ref) {
        toggle = q(ref)
        break
      }
      el = el.parentElement
    }
    qa(`.${opt.toggler}`, (item) => {
      if (item != toggle) {
        item.classList.remove(opt.toggler)
      }
    })
  })
}

var copy = function (input) {
  if (typeof input == 'string') {
    input = document.querySelector(input)
  }
  input.select()
  input.setSelectionRange(0, 99999)

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(input.value)
  } else if (typeof document.execCommand == 'function') {
    document.execCommand('copy')
  }
}

var popupCopy = function (el) {
  var source = el.getAttribute('data-source')
  clearTimeout(window.__timeout[source])
  copy(`#${source}`)
  el.classList.remove('popup')
  el.classList.add('popup')
  if (!window.__timeout) {
    window.__timeout = {}
  }
  window.__timeout[source] = setTimeout(function () {
    el.classList.remove('popup')
  }, 3000)
}

module.exports = {
  load,
  sleep,
  goBack,
  navCount,
  isImage,
  closeWindow,
  truncate,
  setActiveLink,
  logout,
  toggleMenu,
  closeMenus,
  track,
  back,
  last,
  handleToggleHelp,
  isVisible,
  longtime,
  mediumtime,
  smoothScroll,
  scrollToError,
  scrollModal,
  download,
  dropdownOpen,
  dropdownBlur,
  copy,
  popupCopy
}
