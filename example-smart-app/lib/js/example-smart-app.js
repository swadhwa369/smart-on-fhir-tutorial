function onReady(smart)  {
    if (smart.hasOwnProperty('patient')) {
      var patient = smart.patient;
      var pt = patient.read();
      var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
                              'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
                              'http://loinc.org|2089-1', 'http://loinc.org|55284-4']
                            }
                           }
                  });
  
      $.when(pt, obv).fail(onError);
  
      $.when(pt, obv).done(function(patient, obv) {
        var byCodes = smart.byCodes(obv, 'code');
        var gender = patient.gender;
        var dob = new Date(patient.birthDate);
        var day = dob.getDate();
        var monthIndex = dob.getMonth() + 1;
        var year = dob.getFullYear();
  
        var dobStr = monthIndex + '/' + day + '/' + year;
        var fname = '';
        var lname = '';
  
        if(typeof patient.name[0] !== 'undefined') {
          fname = patient.name[0].given.join(' ');
          lname = patient.name[0].family.join(' ');
        }
  
        var height = byCodes('8302-2');
        var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
        var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
        var hdl = byCodes('2085-9');
        var ldl = byCodes('2089-1');
  
        var p = defaultPatient();
        p.birthdate = dobStr;
        p.gender = gender;
        p.fname = fname;
        p.lname = lname;
        p.age = parseInt(calculateAge(dob));
  
        if(typeof height[0] != 'undefined' && typeof height[0].valueQuantity.value != 'undefined' && typeof height[0].valueQuantity.unit != 'undefined') {
          p.height = height[0].valueQuantity.value + ' ' + height[0].valueQuantity.unit;
        }
  
        if(typeof systolicbp != 'undefined')  {
          p.systolicbp = systolicbp;
        }
  
        if(typeof diastolicbp != 'undefined') {
          p.diastolicbp = diastolicbp;
        }
  
        if(typeof hdl[0] != 'undefined' && typeof hdl[0].valueQuantity.value != 'undefined' && typeof hdl[0].valueQuantity.unit != 'undefined') {
          p.hdl = hdl[0].valueQuantity.value + ' ' + hdl[0].valueQuantity.unit;
        }
  
        if(typeof ldl[0] != 'undefined' && typeof ldl[0].valueQuantity.value != 'undefined' && typeof ldl[0].valueQuantity.unit != 'undefined') {
          p.ldl = ldl[0].valueQuantity.value + ' ' + ldl[0].valueQuantity.unit;
        }
        ret.resolve(p);
      });
    } else {
      onError();
    }
  }
  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#age').html(p.age);
    $('#height').html(p.height);
    $('#systolicbp').html(p.systolicbp);
    $('#diastolicbp').html(p.diastolicbp);
    $('#ldl').html(p.ldl);
    $('#hdl').html(p.hdl);
  };