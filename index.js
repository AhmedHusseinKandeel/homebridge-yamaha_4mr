var Service, Characteristic;

const request = require('request');
const url = require('url');
 
var yamaha;



module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  
  homebridge.registerAccessory("homebridge-yamaha_4mr", "YamahaMC2", Yamaha_mcAccessory2);
}

function Yamaha_mcAccessory2(log, config) {
  this.currentState = false;
  this.log = log;
  this.name = config["name"];
  this.host = config["host"];
  this.zone = config["zone"];
  this.maxVol = config["maxvol"];
}

Yamaha_mcAccessory2.prototype = {
  getServices: function () {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Cambit")
      .setCharacteristic(Characteristic.Model, "Yamaha MC2")
      .setCharacteristic(Characteristic.SerialNumber, "6710160340");
 
    let SmartSpeakerService = new Service.SmartSpeaker();
    SmartSpeaker
        .getCharacteristic(Characteristic.CurrentMediaState) // CurrentMedia!!
        .onGet(this.handleCurrentMediaStateGet.bind(this));

    SmartSpeaker
      .getCharacteristic(Characteristic.TargetMediaState) // TargetMedia!!
      .onGet(this.handleTargetMediaStateGet.bind(this))
      .onSet(this.handleTargetMediaStateSet.bind(this));

      SmartSpeaker
      .getCharacteristic(Characteristic.Mute) // Mute!!
        .on('get', this.getSmartSpeakerMuteCharacteristic.bind(this))
        .on('set', this.setSmartSpeakerMuteCharacteristic.bind(this));  
     SmartSpeaker
        .getCharacteristic(Characteristic.Volume) // Volume!!
          .on('get', this.getSmartSpeakerVolumeCharacteristic.bind(this))
          .on('set', this.setSmartSpeakerVolumeCharacteristic.bind(this));

    this.informationService = informationService;
    this.SmartSpeakerSpeaker = SmartSpeakerSpeaker;
    return [informationService, SmartSpeakerService];
  },


  handleCurrentMediaStateGet() {
    this.log.debug('Triggered GET CurrentMediaState');

    // set this to a valid value for CurrentMediaState
    const currentValue = this.Characteristic.CurrentMediaState.PLAY;

    return currentValue;
  },

  handleTargetMediaStateGet() {
    this.log.debug('Triggered GET TargetMediaState');

    // set this to a valid value for TargetMediaState
    const currentValue = this.Characteristic.TargetMediaState.PLAY;

    return currentValue;
  },

  /**
   * Handle requests to set the "Target Media State" characteristic
   */
  // handleTargetMediaStateSet(value) {
  //   this.log.debug('Triggered SET TargetMediaState:' value);
   
  // },

  handleTargetMediaStateSet (value) {
    console.log("Setting TargetMediaState to: " + value);
    targetMediaState = value;
    currentMediaState = targetMediaState;

    callback();


  },

  
  getSmartSpeakerMuteCharacteristic: function (next) {
    const me = this;
    request({
        method: 'GET',
            url: 'http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
            headers: {
                'X-AppName': 'MusicCast/1.0',
                'X-AppPort': '41100',
			},
    }, 
    function (error, response, body) {
      if (error) {
        //me.log('HTTP get error ');
        me.log(error.message);
        return next(error);
      }
	  att=JSON.parse(body);
	  me.log('HTTP GetStatus result:' + (att.Mute=='muted' ? "true" : "false"));
      return next(1, (att.Mute=='muted'));
    });
  },
 
 
    setSmartSpeakerMuteCharacteristic: function (muted, next) {
      var url='http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/setMute?enable=' + (muted ? 'true' : 'false');
    const me = this;
      request({
        url: url  ,
        method: 'GET',
        body: ""
      },
      function (error, response) {
        if (error) {
          //me.log('error with HTTP url='+url);
          me.log(error.message);
          return next(error);
        }
      //me.log('HTTP setPower succeeded with url:' + url);
        return next();
      });
    },

  getSmartSpeakerVolumeCharacteristic: function (next) {
    const me = this;
	var res = 50;
  
    return next(null,res);
  },
   
  setSmartSpeakerVolumeCharacteristic: function (volume) {

     return volume();
  }
}

