/**
 * Created by Marco on 15/10/15.
 */

var routing = [
  {path:'/',                 activity:'act-home'},
  {path:'/:model/list',      activity:'act-list'}, // [users/list]
  {path:'/:model/:mode/:id', activity:'act-crud'}, // [users/create/0, users/read/ID /users/update/ID]

  /*404 error*/
  {path:'*', activity:'act-not-found'}
];

