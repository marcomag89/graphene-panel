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
    menu:'/users/list/0'
  },


  /*404 error*/
  {path:'*', activity:'act-not-found',   title:'404 Not found',    icon:'account-box'                      }

];
