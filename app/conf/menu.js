/**
 * Created by Marco on 25/10/15.
 */
var menu = [
  {name:'Home',    href:'/',             matches:'/',             icon:'home'   },
  {name:'Users',   href:'/users/list',   matches:'/users/(.*)',   icon:'account-box' },
  {name:'Groups',  href:'/groups',       matches:'/groups(.*)',   icon:'group-work' },
  {name:'Modules', href:'/modules',      matches:'/modules(.*)',  icon:'account-balance-wallet' },

  //{name:'Modules', href:'/modules',      matches:'/actions(.*)',  icon:'account-balance-wallet' },
  //{name:'Modules', href:'/modules',      matches:'/actions(.*)',  icon:'account-balance-wallet' }

];
