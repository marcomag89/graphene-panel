/**
 * Created by Marco on 15/10/15.
 */

var routing = [
  {path:'/',             activity:'act-home'},
  {path:'/:model/list',  activity:'act-list'},


  //{path:'/users/list/', activity:'act-users', title:'Users', icon:'account-box', menu: '/users/list'},

 /*
  {
    path      : '/users/:mode/:par',
    activity  : 'act-crud',
    title     : 'Users',
    icon     : 'account-box',
    menu     : '/users/list/0',
    settings : {postfix:'users'}
  },
*/
  /*404 error*/
  {path:'*', activity:'act-not-found',   title:'404 Not found',    icon:'account-box'                      }

];

