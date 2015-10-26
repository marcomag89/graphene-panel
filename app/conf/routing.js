/**
 * Created by Marco on 15/10/15.
 */

var routing = [
  {path:'/',                 activity:'act-home'},

  // [users/list]
  {path:'/:model/list',      activity:'act-list'},

  // [users/create/0, users/read/ID /users/update/ID]
  {path:'/:model/:mode/:id', activity:'act-crud'},


  /*404 error*/
  {path:'*', activity:'act-not-found',   title:'404 Not found',    icon:'account-box'                      }

];

