/**
 * Created by Marco on 08/10/15.
 */

var ClientController = function(){
  this.status = {loading:true};
  this._loadSettings();
};

ClientController.prototype = {
  pushClient : function(grapheneClient){
    this.clients.push(grapheneClient);
    grapheneClient._onSettingChange(this.settings);
    grapheneClient._onClientStatusChange(this.status);
  },

  fireSettingsChanged    : function(newValue){for(var cln in this.clients){this.clients[cln]._onSettingChange(newValue);     }},
  fireClientStatusChange : function(newValue){for(var cln in this.clients){this.clients[cln]._onClientStatusChange(newValue);}},

  getProfileSetting:function(relativeSettingKey){
    if(relativeSettingKey !== '')relativeSettingKey='.'+relativeSettingKey;
    var selectedProfile = this.getSetting('selectedProfile');
    if(selectedProfile !== null){
      var selectedKey='profiles.'+selectedProfile+relativeSettingKey;
      return this.getSetting(selectedKey);
    }else{
      console.warn('unable to read selected profile');
      return null;
    }
  },

  addProfile:function(name,serverUrl,apiKey,accessToken,settings){
    var found=false;
    for(var prf in this.settings.profiles){if(prf === name)found=true;}
    if(!found){
      var settings={
        server:serverUrl,
        apiKey:apiKey,
        accessToken:accessToken,
        settings:settings
      };
      this.setSetting('profiles.'+name,settings);
    }else{
      console.warn('profile: '+name+' already exists');
    }
  },

  removeProfile:function(name){
    var found=false;
    for(var prf in this.settings.profiles){if(prf === name)found=true;}
    if(found){
      delete this.settings.profiles.name;
    }
    this.setSetting('profiles',this.settings.profiles);
  },

  setCurrentProfile:function(name){
    var found=false;
    for(var prf in this.settings.profiles){
      if(prf === name)found=true;
    }
    if(found) this.setSetting('selectedProfile',name);
  },

  setSetting:function(settingKey,value){
    var settingsNodes = settingKey.split('.');
    var root = this.settings;
    var tmpSettings = root;
    for(var node in settingsNodes){
      if(node < settingsNodes.length-1){
        if(!(!!tmpSettings[settingsNodes[node]])){tmpSettings[settingsNodes[node]] = {};}
        tmpSettings = tmpSettings[settingsNodes[node]];
      }else{
        tmpSettings[settingsNodes[node]]=value;
      }
    }
    this._saveSettings(root);
  },

  getSetting:function(settingKey){
    var settingsNodes = settingKey.split('.');
    var tmpSettings=JSON.parse(JSON.stringify(this.settings));
    for(var node in settingsNodes){
      if(!!tmpSettings[settingsNodes[node]]){
        tmpSettings = tmpSettings[settingsNodes[node]];
      }else{
        return null;
      }
    }
    return tmpSettings;
  },

  _loadSettings:function(){
    var settingsString = localStorage.getItem(ClientController.settingsKey);
    if(settingsString !== null){
      this.settings= JSON.parse(settingsString);
      if(this.settings.selectedProfile !== null && !!this.settings.profiles[this.settings.selectedProfile]){
        this._checkStatus();
      }
      else{
        console.warn('profile: '+this.settings.selectedProfile+' not found');
      }
    }else{
      this._saveSettings(ClientController.settingScaffolding);
    }
  },

  _saveSettings:function(settings){
    if(!!settings.version && Number.isInteger(settings.version)) settings.version++;
    else settings.version = 1;
    localStorage.setItem(ClientController.settingsKey,JSON.stringify(settings));
    this._loadSettings();
    this.fireSettingsChanged(settings);
  },

  _scheduleCheckStatus:function(){
    if(this.chStatus !== null)clearTimeout(this.chStatus);
    this.chStatus = setTimeout(function(){
      this._checkStatus();
    }.bind(this),ClientController.checkStatusInterval)
  },

  _checkStatus:function(){
    this.gFetch('/system/client')
      .then(function(json) {
        this._scheduleCheckStatus();
        var info = json.ClientInfo;
        var status  = {
          application: info.application,
          user       : info.user,
          aclEnabled : info.aclEnabled
        };
        status.loggedIn      = (info.user.mail !== null);
        status.appAuthorized = (info.application.name !== null);
        status.online        = true;
        status.loading       = false;
        if(this._statusHasChanged(status)){
          this.status = status;
          this.fireClientStatusChange(this.status);
        }
      }.bind(this))
      .catch(function(err) {
        this._scheduleCheckStatus();
        var status = {};
        status.online  = false;
        status.loading = false;
        if(this._statusHasChanged(status)) {
          this.status = status;
          this.fireClientStatusChange(this.status);
        }
      }.bind(this))

  },

  _statusHasChanged:function(status){
    return(JSON.stringify(this.status) !== JSON.stringify(status));
  },

  gFetch : function(service,body,method,headers){
    var reqSettings={
      method: 'GET',
      body:JSON.stringify(body),
      headers: {
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json',
        'api-key'      : this.getProfileSetting('apiKey'),
        'access-token' : this.getProfileSetting('accessToken'),
      }
    };
    if(!!body)   reqSettings.method='POST';
    if(!!method) reqSettings.method=method;
    if(headers !== null && !!headers){
      for(var hk in headers){
        reqSettings.headers[hk]=headers[hk];
      }
    }
    return fetch(this.getProfileSetting('server')+service,reqSettings)
      .then(function(res)  {return res.json()})
      .then(function(json) {return this._checkResponseErrors(json)}.bind(this))
      .then(function(json) {return this._checkResponseRules(service,json)}.bind(this))
  },

  _checkResponseErrors:function(json){
    if(!!json.error) {
        var error = new Error(json.error.message)
        error.json = json
        throw error
    }
    else return json;
  },

  _checkResponseRules:function(service,json){
    //Recupero informazioni da risposta
    var settingsUpd = false;
    switch(service){
      case '/system/config' : {
        settingsUpd=true;
        //console.log(json.Configuration.adminApp.apiKey);
        this.settings.profiles[this.settings.selectedProfile].apiKey = json.Configuration.adminApp.apiKey;
      }break;
      case '/auth/login':{
        settingsUpd=true;
        this.settings.profiles[this.settings.selectedProfile].accessToken = json.Session.accessToken;
      }break;
      case '/auth/logout':{
        settingsUpd=true;
        this.settings.profiles[this.settings.selectedProfile].accessToken = '';
      }break;
    }
    if(settingsUpd==true){
      //console.log('settings updated!');
      this._saveSettings(this.settings);
    }

    return json;
  },

  chStatus : null,
  settings : null,
  status   : {loading: true},
  clients  : []
};

ClientController.settingsKey         = 'graphene-settings';
ClientController.settingScaffolding  = {version:0, selectedProfile:'', profiles:{}};
ClientController.instance            = null;
ClientController.checkStatusInterval = 5000;

ClientController.getInstance=function(){
  if(ClientController.instance === null)
    ClientController.instance = new ClientController()
  return ClientController.instance;
};
