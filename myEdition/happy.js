/*
 * http://happyjs.com/
 * @param {type} $
 * @returns {undefined}
 * version: 0.4
 *  changelog (-> has hardly changed from original! -> best way to update: merge):
 *    - supported classes in field definition
 *    - unHappy()-Method return the success state to form
 *    - unHappy()-Method will be called eachtimes (not only by submit)
 *    - 
 *    
 */

(function($){
  function trim(el) {
    return (''.trim) ? el.val().trim() : $.trim(el.val());
  }
  $.fn.isHappy = function (config) {
    var fields = [], item;
    
    function getError(error) {
      return $('<span id="'+error.id+'" class="unhappyMessage">'+error.message+'</span>');
    }
    
    /**
     * call handleSubmit from outside
     * jQuery(happyObject.handleSubmit)
     */
    this.handleSubmit = function () {
      handleSubmit();
    }
    
    /**
     * add a field per id
     * jQuery(happyObject.processField(opts, selector))
     */
    this.processField = function (opts, selector) {
      processField(opts, selector);
    }
    
    function handleSubmit() {
      var errors = false, i, l;
      for (i = 0, l = fields.length; i < l; i += 1) {
        if (!fields[i].testValid(true)) {
          errors = true;
        }
      }
      if (errors) {
        if (isFunction(config.unHappy)) {
          return config.unHappy();
        }
        return false;
      } else if (config.testMode) {
        if (window.console) console.warn('would have submitted');
        return false;
      }
    }
    function isFunction (obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    }
    function processField(opts, selector) {
      var field = $(selector),
        error = {
          message: opts.message,
          id: selector.slice(1) + '_unhappy'
        },
        errorEl = $(error.id).length > 0 ? $(error.id) : getError(error);
      
      fields.push(field);
      field.testValid = function (submit) {
        var val,
          position,
          el = $(this),
          gotFunc,
          error = false,
          temp, 
          required = !!el.get(0).attributes.getNamedItem('required') || opts.required,
          password = (field.attr('type') === 'password'),
          arg = isFunction(opts.arg) ? opts.arg() : opts.arg;
        
        // clean it or trim it
        if (isFunction(opts.clean)) {
          val = opts.clean(el.val());
        } else if (!opts.trim && !password) {
          val = trim(el);
        } else {
          val = el.val();
        }
        
        // write it back to the field
        el.val(val);
        
        // get the value
        gotFunc = ((val.length > 0 || required === 'sometimes') && isFunction(opts.test));
        
        // check if we've got an error on our hands
        // if (submit === true && required === true && val.length === 0) {
        // always run check (not only in submit)
        if (required === true && val.length === 0) {
          error = true;
        } else if (gotFunc) {
          error = !opts.test(val, arg);
        }
        
        if (error) {
          position = config.position || 'before';
          eval('el.addClass(\'unhappy\').'+position+'(errorEl);');
          // el.addClass('unhappy').before(errorEl);
          // call unHappy Function
          if (isFunction(config.unHappy)) {
            config.unHappy();
          }
          return false;
        } else {
          temp = errorEl.get(0);
          // this is for zepto
          if (temp.parentNode) {
            temp.parentNode.removeChild(temp);
          }
          el.removeClass('unhappy');
          return true;
        }
      };
      field.bind(config.when || 'blur', field.testValid);
    }

    var itemId;
    for (item in config.fields) {
      // if it's an multiple selector
      if (item.charAt(0) === '.') {
        objectCollection = $(item);
        if (objectCollection.length > 0) {
          // if we add the object per class
          for (i = 0; i < objectCollection.length; i++) {
            itemId = '#' + objectCollection[i].id;
            processField(config.fields[item], itemId);
          }
        }
      } else {
        processField(config.fields[item], item);
      }
    }
    
    if (config.submitButton) {
      $(config.submitButton).click(handleSubmit);
    } else {
      this.bind('submit', handleSubmit);
    }
    return this;
  };
})(this.jQuery || this.Zepto);