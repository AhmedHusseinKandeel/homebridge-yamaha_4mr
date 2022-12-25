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
 
    let SpeakerService = new Service.SmartSpeaker();
    SmartSpeaker
        .getCharacteristic(Characteristic.CurrentMediaState) // CurrentMedia!!
        .onGet(this.handleCurrentMediaStateGet.bind(this));

    SmartSpeaker
      .getCharacteristic(Characteristic.TargetMediaState) // TargetMedia!!
      .onGet(this.handleTargetMediaStateGet.bind(this))
      .onSet(this.handleTargetMediaStateSet.bind(this));

      SmartSpeaker
      .getCharacteristic(Characteristic.Mute) // Mute!!
        .on('get', this.getSpeakerMuteCharacteristic.bind(this))
        .on('set', this.setSpeakerMuteCharacteristic.bind(this));  
     SmartSpeaker
        .getCharacteristic(Characteristic.Volume) // Volume!!
          .on('get', this.getSpeakerVolumeCharacteristic.bind(this))
          .on('set', this.setSpeakerVolumeCharacteristic.bind(this));

    this.informationService = informationService;
    this.SmartSpeaker = SmartSpeaker;
    return [informationService, SpeakerService];
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

  
  getSpeakerMuteCharacteristic() {


    const SpeakerMute = this.Characteristic.SpeakerMute.Mute;

    return SpeakerMute;

  },
 
  setSpeakerMuteCharacteristic  (Mute) {
    // this.log.debug('Triggered SET SpeakerMute:' Mute);
    // return Mute;


    console.log("Setting SpeakerMute to: " + Mute);
    SpeakerMute = Mute;
   

    callback();
  },
  


   


  
  
  getSpeakerVolumeCharacteristic: function (next) {
    const me = this;
	var res = 50;
  
    return next(null,res);
  },
   
  setSpeakerVolumeCharacteristic: function (volume) {

     return volume();
  }
}

