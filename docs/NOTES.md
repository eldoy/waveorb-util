What we wanna do:

Collect all kinds of functions into 1 structure. It is in addition to haka.

Some functions are isomorphic, some are pure backend, some are pure frontend.

The goal is to reach 'stable'.

Currently we have these functions:

- **load** - Loads HTTP over ajax and inserts it into the DOM
- **sleep** - wait
- **clearErrors** - Clears errors from form elements
- **showErrors** - Show errors from API
- **goBack** - _deprecated for 'back'_ Go back to previous page
- **navCount** - _deprecated for 'track'_ Store navigation
- **isImage** - true or false to if a string is an image name
- **closeWindow** - Listens for escape key and goes back (remove)
- **tr** - Truncate string. Rename to truncate
- **toggleVisibility** - _deprecated_ Toggle element visibility. Rewrite into 'toggle'
- **setActiveLink** - add a class name to the currently active link
- **handleLogout** - handle logout. Remove? Or rewrite?
- **handleToggleMenu** - toggle menu. Rewrite to more general toggle?
- **handleCloseMenus** - close open menus on click outside. Rewrite to general blurClose?

Add functions from other apps, gather them all into one coherent, stable, general purpose library.

Anything that is app specific but usable in multiple apps goes in Waveorb Code and is installable by copy, not include.
