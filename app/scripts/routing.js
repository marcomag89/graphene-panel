/**
 * Created by Marco on 15/10/15.
 */

var routing = [
  {path:'/', activity:'act-home',  title:'Home',  icon:'home',  menu:'/'},

  {
    path      : '/users/:mode/:par',
    activity  : 'act-crud',
    title     : 'Users',
    icon     : 'account-box',
    menu     : '/users/list/0',
    settings : {postfix:'users', api:settings.api.services.users}
  },


  /*404 error*/
  {path:'*', activity:'act-not-found',   title:'404 Not found',    icon:'account-box'                      }

];

