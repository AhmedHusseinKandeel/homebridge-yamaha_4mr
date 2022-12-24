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
 
    let SpeakerService = new Service.Speaker("Amplifier");
    SpeakerService
        .getCharacteristic(Characteristic.Mute) // Mute!!
        .on('get', this.getSpeakerMuteCharacteristic.bind(this))
        .on('set', this.setSpeakerMuteCharacteristic.bind(this));

    SpeakerService
      .getCharacteristic(Characteristic.Active) // Power!!
        .on('get', this.getSpeakerActiveCharacteristic.bind(this))
        .on('set', this.setSpeakerActiveCharacteristic.bind(this));

        // SpeakerService
        // .getCharacteristic(Characteristic.Volume) // Volume!!
        //   .on('get', this.getSpeakerVolumeCharacteristic.bind(this))
        //   .on('set', this.setSpeakerVolumeCharacteristic.bind(this));

    this.informationService = informationService;
    this.SpeakerService = SpeakerService;
    return [informationService, SpeakerService];
  },
  
  getSpeakerMuteCharacteristic: function (next) {
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
   
  setSpeakerMuteCharacteristic: function (muted, next) {
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
  

  getSpeakerActiveCharacteristic: function (next) {
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
	  me.log('HTTP GetStatus result:' + (att.power=='on' ? "1" : "0"));
      return next(1, (att.power=='on'));
    });
  },
   
  setSpeakerActiveCharacteristic: function (on, next) {
    var url='http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/setPower?power=' + (on ? 'On' : 'standby');
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
  // speaker characteristics
  
  
  // getSpeakerVolumeCharacteristic: function (next) {
  //   const me = this;
	// var res = 50;
  //   request({
  //       method: 'GET',
  //           url: 'http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
  //           headers: {
  //               'X-AppName': 'MusicCast/1.0',
  //               'X-AppPort': '41100',
	// 		},
  //   }, 
  //   function (error, response, body) {
  //     if (error) {
  //       //me.log('HTTP get error ');
  //       me.log(error.message);
  //       return next(error);
  //     }
	//   att=JSON.parse(body);
	//   res = Math.floor((att.volume / this.maxVol) * 100);
	//   me.log('HTTP GetStatus result:' + res);
  //     return next(null,res);
  //   });
  // },
   
  // setSpeakerVolumeCharacteristic: function (volume, next) {
  //   var url='http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/setVolume?volume=' + Math.floor(volume/100 * this.maxVol);
	// const me = this;
  //   request({
  //     url: url  ,
  //     method: 'GET',
  //     body: ""
  //   },
  //   function (error, response) {
  //     if (error) {
  //       //me.log('error with HTTP url='+url);
  //       me.log(error.message);
  //       return next(error);
  //     }
	//   //me.log('HTTP setVolume succeeded with url:' + url);
  //     return next();
  //   });
  // }
}

