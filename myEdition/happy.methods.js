/*
 * 
 * Library for happyJS.
 * At the end fo the file you can add custom validators if you want.
 * Attention: if you have a function with parameters: custom parms are on position 3,...
 *  Ex.: regist the number function number(<not used>, <min>, <max>)
 */

var happy = {
  /********** builtin: test functions **********/
  USPhone: function (val) {
    return /^\(?(\d{3})\)?[\- ]?\d{3}[\- ]?\d{4}$/.test(val)
  },
  
  // matches mm/dd/yyyy (requires leading 0's (which may be a bit silly, what do you think?)
  date: function (val) {
    return /^(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/(?:\d{4})/.test(val);
  },
  
  /**
   * matches date with date.js (also possible to check time values)
   * @param {type} val
   * @param {object} config for date. ex. {'format': 'd.M.yyyy'}
   * @returns {Boolean}
   */
  dateGerman: function (val, config) {
    var parsedVal = Date.parseExact(val, config.format);
    
    if (parsedVal !== null) {
      return true;
    } else {
      return false;
    }
  },
  
  email: function (val) {
    // return /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/.test(val);
    // return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(val);
    return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(val);
  },
  
  /**
   * Ex. for call:
   *    test: happy.number,
   *    arg: [0,59]  
   * @param {type} val
   * @param {object} config for number. ex. {'min': 0, 'max': 9 }
   * @returns {Boolean}
   */
  number: function (val, config) {
    config = typeof config !== 'undefined' ? config : {'min': null, 'max': null };

    // check: it's a nubmer
    if (/^-*[0-9,\.]+$/.test(val)) {
      var value = parseFloat(val);
      if (config.min !== null) {
        if (value < config.min) {
          return false;
        }
      }
      
      if (config.max !== null) {
        if (value > config.max) {
          return false;
        }
      }
      return true;
    }
    return false;
    // return /^[0-9]+$/.test(val);
  },
  
  minLength: function (val, length) {
    return val.length >= length;
  },
  
  maxLength: function (val, length) {
    return val.length <= length;
  },
  
  equal: function (val1, val2) {
    return (val1 == val2);
  },
  
  /********** custom: test functions **********/
  /**
   * check an url including parameters (if you want an url wihtout params use urlPlain)
   * @param {type} val
   * @returns {RegExp}
   * source: http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the
   */
  url: function (val) {
    // var reg_exUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/;
    var reg_exUrl = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;
    return reg_exUrl.test(val);
  },
  
  /**
   * only an url without paramerters
   * @param {type} val
   * @returns {RegExp}
   */
  urlPlain: function (val) {
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val);
  },
  
  /**
   * detect an valid url in a textblock
   * http://www.regexguru.com/2008/11/detecting-urls-in-a-block-of-text/
   * return: array with matches
   */
  urlInText: function (val) {
    var myRegExp = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:;,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:;,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:;,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi;
    return val.match(myRegExp);
  },
  
  
  /********** custom: clean functions **********/
  makeLowerCase: function (val) {
    return val.toLowerCase();
  },
  
  // check if there an http/https protocol before the url, else add it
  setHttp: function (val) {
    // if val empty leave function
    if (val.length == 0) {
      return '';
    }
    
    var protocol = val.split('://');
    var setHttp = false;
    
    if (protocol.length == 1) {
      setHttp = true;
    } else {
      switch (protocol[0]) {
        case 'http':
        case 'https':
          // leave val by false
          break;
        default:
          // no valid protocol, must be sett
          setHttp = true;
          break;
      }
    }
    
    if (setHttp) {
      val = 'http://' + val;
    }
  
    return val;
  },
  
  // try to write a valid date
  writeValidDate: function (val) {
    var parsedVal = Date.parse(val);
    
    
  }

};