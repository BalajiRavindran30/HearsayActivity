define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var hearsayfields = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Template Selection", "key": "step1" },
        { "label": "Map the Template Field", "key": "step2", "active": false},
        { "label": "Review Template Field", "key": "step3", "active": false}
    ];
    var currentStep = steps[0].key;
    var pageno=1;
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        
        // Disable the next button if a value isn't selected
        $(document).on('change','select[name="integrationType"]',function(){
            var selectedValue = getIntegrationValue();
            console.log('Integration Type '+$('select[name="integrationType"]'));
            if(selectedValue == 'currentJourney'){
                lastStepEnabled = !lastStepEnabled; // toggle status
                steps[1].active = true;
                steps[2].active = true; // toggle active
                connection.trigger('updateSteps', steps);
            } else {
                steps[2].active = true;
                steps[1].active = false; // toggle active
                connection.trigger('updateSteps', steps);
            }
            //$('').html(message);
        });
    }

    function initialize (data) {
        if (data) {
            payload = data;
        }
        console.log('data '+getIntegrationType());
        var mapfields;
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        $.each(inArguments, function(index, inArgument) {
            $.each(inArgument, function(key, val) {
                if (key === 'hearsayfields') {
                    mapfields = val;
                }
            });
        });

        // If there is no message selected, disable the next button
        if (!mapfields) {
            showStep(null, 1);
            connection.trigger('updateButton', { button: 'next', enabled: false });
            // If there is a message, skip to the summary step
        } else {
            var div_data = '';
	    for (var key in mapfields) {
		if (mapfields.hasOwnProperty(key)) {
		var val = mapfields[key];
		console.log('key '+key);
		console.log('value '+val);
		if(val != '--Select--' && key != '--Select--'){
			div_data += "<li>"+key+' : '+val+"</li>";
		   }
		}
	    }
	    $('#mydiv3').html('<div class="e1container"><div><img src="images/hearsay.png" width="50" height="50"><label class="e1pageheader">Hearsay Systems</label></div><div class="row epaddingbottom10"><div class="col-md-11 elRowPg1"><div><label class="e1labelheaderPage1">DATA EXTENSION TEMPLATES (NEW)</label></div>'+div_data+'</div><div class="col-md-1"></div></div><hr class="e1linecolor"/></div>');
	    showStep(null, 3);
        }
    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        // console.log(tokens);
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        // console.log(endpoints);
    }

    function onClickedNext () {
	var selectOption = getIntegrationValue();
        if (currentStep.key === 'step3') {
            save();
        } else if(currentStep.key === 'step1' && selectOption == 'currentJourney'){
		console.log('input data '+$('input[name="leadsActivity"]')[0]);
		var input = $('input[name="leadsActivity"]')[0];
		//var validityState_object = input.validity;
		if (input.value == '' || input.value == undefined){
	    		input.setCustomValidity('Must enter your template name!');
	    		input.reportValidity();
			showStep(null, 1);
			connection.trigger('ready');
		} else {
	    		connection.trigger('nextStep');
		}
        } else if(currentStep.key === 'step2'){
		hearsayfields [$('select[name="control1"]').find('option:selected').attr('value').trim()] != '--Select--' ? hearsayfields [$('select[name="control1"]').find('option:selected').attr('value').trim()] = $('select[name="control5"]').find('option:selected').attr('value').trim() : hearsayfields;
		hearsayfields [$('select[name="control2"]').find('option:selected').attr('value').trim()] != '--Select--' ? hearsayfields [$('select[name="control2"]').find('option:selected').attr('value').trim()] = $('select[name="control6"]').find('option:selected').attr('value').trim() : hearsayfields;
		hearsayfields [$('select[name="control3"]').find('option:selected').attr('value').trim()] != '--Select--' ? hearsayfields [$('select[name="control3"]').find('option:selected').attr('value').trim()] = $('select[name="control7"]').find('option:selected').attr('value').trim() : hearsayfields;
		hearsayfields [$('select[name="control4"]').find('option:selected').attr('value').trim()] != '--Select--' ? hearsayfields [$('select[name="control4"]').find('option:selected').attr('value').trim()] = $('select[name="control8"]').find('option:selected').attr('value').trim() : hearsayfields;
		hearsayfields [$('select[name="control9"]').find('option:selected').attr('value').trim()] != '--Select--' ? hearsayfields [$('select[name="control9"]').find('option:selected').attr('value').trim()] = $('select[name="control3"]').find('option:selected').attr('value').trim() : hearsayfields;
		hearsayfields [$('select[name="control10"]').find('option:selected').attr('value').trim()] != '--Select--' ? hearsayfields [$('select[name="control10"]').find('option:selected').attr('value').trim()] = $('select[name="control4"]').find('option:selected').attr('value').trim() : hearsayfields;
		hearsayfields [$('select[name="control11"]').find('option:selected').attr('value').trim()] != '--Select--' ? hearsayfields [$('select[name="control11"]').find('option:selected').attr('value').trim()] = $('select[name="control5"]').find('option:selected').attr('value').trim() : hearsayfields;
		hearsayfields [$('select[name="control12"]').find('option:selected').attr('value').trim()] != '--Select--' ? hearsayfields [$('select[name="control12"]').find('option:selected').attr('value').trim()] = $('select[name="control6"]').find('option:selected').attr('value').trim() : hearsayfields;
		//hearsayfields [$('select[name="control13"]').find('option:selected').attr('value').trim()] = $('select[name="control6"]').find('option:selected').attr('value').trim();
		//hearsayfields [$('select[name="control14"]').find('option:selected').attr('value').trim()] = $('select[name="control7"]').find('option:selected').attr('value').trim();
		//hearsayfields [$('select[name="control4"]').find('option:selected').attr('value').trim()] = $('select[name="control8"]').find('option:selected').attr('value').trim();
		//hearsayfields [$('select[name="control9"]').find('option:selected').attr('value').trim()] = $('select[name="control13"]').find('option:selected').attr('value').trim();
		//hearsayfields [$('select[name="control10"]').find('option:selected').attr('value').trim()] = $('select[name="control14"]').find('option:selected').attr('value').trim();
		//hearsayfields [$('select[name="control11"]').find('option:selected').attr('value').trim()] = $('select[name="control15"]').find('option:selected').attr('value').trim();
		//hearsayfields [$('select[name="control12"]').find('option:selected').attr('value').trim()] = $('select[name="control16"]').find('option:selected').attr('value').trim();
		console.log('hearsayfields '+hearsayfields);
		var div_data = '';
	    	for (var key in hearsayfields) {
			if (hearsayfields.hasOwnProperty(key)) {
				var val = hearsayfields[key];
				console.log('key '+key);
				console.log('value '+val);
				div_data += "<li>"+key+' : '+val+"</li>";
			}
	    	}
	    	$('#mydiv3').html('<div class="e1container"><div><img src="images/hearsay.png" width="50" height="50"><label class="e1pageheader">Hearsay Systems</label></div><div class="row epaddingbottom10"><div class="col-md-11 elRowPg1"><div><label class="e1labelheaderPage1">DATA EXTENSION TEMPLATES (NEW)</label></div>'+div_data+'</div><div class="col-md-1"></div></div><hr class="e1linecolor"/></div>');
		connection.trigger('nextStep');
	}
    }

    function onClickedBack () {
        connection.trigger('prevStep');
    }

    function onGotoStep (step) {
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex-1];
        }

        currentStep = step;

        $('.step').hide();

         switch(currentStep.key) {
            case 'step1':
		$(function() {
			CallReactPage(pageno);
		});													
                connection.trigger('updateButton', {
                    button: 'next',
                    enabled: Boolean(getIntegrationValue())
                });
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: false
                });
                break;
            case 'step2':
		$(function() {
			CallReactPage(2);
		});
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: true
                });
                if (lastStepEnabled) {
                    connection.trigger('updateButton', {
                        button: 'next',
                        text: 'next',
                        visible: true
                    });
                } else {
                    connection.trigger('updateButton', {
                        button: 'next',
                        text: 'done',
                        visible: true
                    });
                }
                break;
            case 'step3':
		$(function() {
			CallReactPage(3);
		});
                connection.trigger('updateButton', {
                     button: 'back',
                     visible: true
                });
                connection.trigger('updateButton', {
                     button: 'next',
                     text: 'done',
                     visible: true
                });
                break;
        }
    }

    function save() {
        var name = $('select[name="integrationType"]').find('option:selected').html();
	console.log('name '+name);
        //var value = getMessage();
	//var value = hearsayfields;

        // 'payload' is initialized on 'initActivity' above.
        // Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property
        // may be overridden as desired.
	console.log('hearsayfields '+hearsayfields);
        payload.name = name;

        payload['arguments'].execute.inArguments = [{ "hearsayfields": hearsayfields }];

        payload['metaData'].isConfigured = true;

        connection.trigger('updateActivity', payload);
    }

    function CallReactPage(pgno){
	var sdivname='mydiv';
	if(pgno==1 || pgno>3 ){
	pgno=1;
	pageno=1;
	$('#row1').show();
	$('#row2').hide();
	$('#row3').hide();
	}
	else if(pgno==2){
	sdivname="mydiv2";
	$('#row2').show();
	$('#row1').hide();
	$('#row3').hide();
	}
	else if(pgno==3){
	sdivname="mydiv3";
	$('#row3').show();
	$('#row1').hide();
	$('#row2').hide();
	}
	if(hearsayfields && pgno==3){
		ReactDOM.render(React.createElement(HearsayPage1, {pageno: pgno}), document.getElementById(sdivname).innerHTML);
	} else {
		ReactDOM.render(React.createElement(HearsayPage1, {pageno: pgno}), document.getElementById(sdivname));
	}
    }

    function getIntegrationType() {
	console.log('IntegrationType '+$('select[name="integrationType"]').find('option:selected').html());
        return $('select[name="integrationType"]').find('option:selected').html();
    }
	
    function getIntegrationValue() {
	console.log('value '+$('select[name="integrationType"]').find('option:selected').attr('value').trim());
        return $('select[name="integrationType"]').find('option:selected').attr('value').trim();
    }

});
