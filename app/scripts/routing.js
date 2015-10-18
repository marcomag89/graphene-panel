/**
 * Created by Marco on 15/10/15.
 */
console.log('allo router!!');

var routing = [
  {path:'/', activity:'act-home',  title:'Home',  icon:'home',  menu:'/'},
  {
    path:'/users/:mode/:par',
    activity:'act-users',
    title:'Users',
    icon:'account-box',
    menu:'/users/list/sort:3,asc;search:bla+bla+bla'
  },

  {path:'*', activity:'act-not-found',   title:'404 Not found',    icon:'account-box'                      }


  /*
  {path:'/modules',   activity:'act-modules', title:'Modules',  icon:'home', menu:true},
  {path:'/',          activity:'act-home',    title:'Home',     icon:'home', menu:true},
  {path:'/',          activity:'act-home',    title:'Home',      icon:'home', menu:true},
  /*
  {activity:'modules',    name:'Modules',   path:'/modules',  icon:'home'        },
  {activity:'users',      name:'Users',     href:'/users',    icon:'account-box' },
  {activity:'contact',    name:'Groups',    href:'/contact',  icon:'group-work'  },*/

];
