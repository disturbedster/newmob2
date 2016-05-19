// Initialize your app
var server_domain = "http://ec2-54-191-36-85.us-west-2.compute.amazonaws.com/mobphp/";



var myApp = new Framework7({
	
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
	swipeBackPage: true,
	pushState: true,
    template7Pages: true
});

// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false,
});


if(window.location.hash == ""){
    mainView.router.loadPage('index.html');
}

function apply_company(company_id){	
	var id = eval('('+localStorage.getItem('user_date')+')')["id"];
	var request = $.ajax({
     	url: server_domain + "api/mobile_insert_final_report.php",
       	method: "POST",
       	data: {'company_id': company_id, 'id': id, 'table': 'users_update'}       
     });
      

     
	request.done(function( msg ) {
		alert(msg)
		myApp.closeModal('.popup-company');
     });
}

function logout() {
	localStorage.clear();	
	 $('.popup-login').addClass('modal-in').fadeIn('slow');
}

function openSkype () {           
   }

$$(document).on('pageInit', function (e) {


function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}
	

  if(localStorage.getItem('user_date') == null){
  	
    $('.popup-login').addClass('modal-in').fadeIn('slow');
  }


/********************** Index page ****************************/

if($('[data-page="index"]').length > 0 && localStorage.getItem('user_date') != null){
		var user_type = eval('('+localStorage.getItem('user_date')+')')["user_type"];
		$('.list-nav ul li:not([data-type*='+user_type+'])').hide();
		
						
     	
	}


/********************** Students List page ****************************/

if($('[data-page="userslist"]').length > 0){	

	var id = eval('('+localStorage.getItem('user_date')+')')["id"];
	var user_type = eval('('+localStorage.getItem('user_date')+')')["user_type"];
    var request = $.ajax({
     	url:  server_domain + "api/studentslist.php",
       	method: "GET",
       	data: {'id':id, 'user_type': user_type}       
     });
      

     
	request.done(function( users ) {
		var users = eval('(' + users + ')');
     	$('.features_list').html('');
     	for (var i = users.length - 1; i >= 0; i--) {
     		var fullname = users[i]["fullname"];
     		var uni_id = users[i]["uni_id"];
     		
     		var userblock = '<li order="'+i+'"><a href="usersdetails.html?id='+uni_id+'"><img src="images/icons/turquoise/user.png" alt="" title=""><span>'+fullname+' / ' + uni_id + '</span></a></li>';
     		$('.features_list').prepend(userblock);     		
     	}
     });
     
   

}


/********************** Students Details page ****************************/

if($('[data-page="usersdetails"]').length > 0){	
	var uni_id = getUrlVars()["id"];		
     var request = $.ajax({
       url:  server_domain + "api/studentsdetails.php",
       method: "GET",
       data: {'uni_id':uni_id }
       
     });
      

     // if data was saved
     request.done(function( user ) {

     	var user = eval('(' + user + ')');
     	$('#usersdetails').html('');
     	for (var i = user.length - 1; i >= 0; i--) {
     		var fullname = user[i]["fullname"];
     		var uni_id = user[i]["uni_id"];
     		var id = user[i]["id"];
     		var email = user[i]["email"];
     		var phone_number = user[i]["phone_number"];
     		var major = user[i]["major_name"];
     		var company_name = user[i]["company_name"];
     		var user_type = eval('('+localStorage.getItem('user_date')+')')["user_type"];

     		var userblock = fullname + '<br>' + uni_id + '<br>'+ email + '<br>'+ phone_number + '<br>' + major + '<br>' + company_name;
		    userblock +=  '<p><a href="email.html?id='+id+'&uni_id='+uni_id+'">Send Email</a></p>';
		    
		    if(user_type == '1'){
		    	userblock +=  '<p><a href="attendance.html?id='+id+'&fullname='+fullname+'&uni_id='+uni_id+'">Attendance</a></p>';
		    	userblock +=  '<p><a href="weekly.html?id='+id+'&fullname='+fullname+'&uni_id='+uni_id+'">Weekly Report</a></p>';
		    	userblock +=  '<p><a href="final_report.html?id='+id+'&fullname='+fullname+'&uni_id='+uni_id+'">Final Report</a></p>';	
		    }else if(user_type == '2'){
		    	userblock +=  '<p><a href="attendance_form.html?uni_id='+uni_id+'&fullname='+fullname+'&id='+id+'">Attendance</a></p>';	
		   		userblock +=  '<p><a href="final_report_form.html?uni_id='+uni_id+'&fullname='+fullname+'&id='+id+'">Final Report</a></p>';
		    }	    
			     		   
     		$('[data-page="usersdetails"] #usersdetails').prepend(userblock);
     	}
     });
}



/********************** Attendance Form page ****************************/

if($('[data-page="attendance_form"]').length > 0){		
		var uni_id = getUrlVars()["uni_id"];
		var fullname = decodeURI(getUrlVars()["fullname"]);
		var user_id = getUrlVars()["id"];
		$('.data.navbar_home_link a').attr('href','usersdetails.html?id='+uni_id);
		var block = '<input type="hidden" name="user_id" value="'+user_id+'">';	
		$('form#attendance').prepend(block);	
		var date = new Date();
    	date = date.toDateString();
		$('input[name=name]').val(fullname);
		$('input[name=id]').val(uni_id);
		$('input[name=date]').val(date);		
     
	}


/********************** Attendance  page ****************************/

if($('[data-page="attendance"]').length > 0){
	
		var uni_id = getUrlVars()["uni_id"];
		$('.data.navbar_home_link a').attr('href','usersdetails.html?id='+uni_id);
		var id = getUrlVars()["id"];
		var fullname = decodeURI(getUrlVars()["fullname"]);
		if(id == null){
			var id = eval('('+localStorage.getItem('user_date')+')')["id"];
			var fullname = eval('('+localStorage.getItem('user_date')+')')["fullname"];
		}
		
		$('h2.fullname').html(fullname);		
     	var request = $.ajax({
       		url:  server_domain + "api/attendance.php",
       		method: "GET",
       		data: {'id':id}       
     	});
      

     // if data was saved
     	request.done(function( users ) {

     		var users = eval('(' + users + ')');
     		$('.features_list').html('');
     		var total_hours = 0;
     		for (var i = users.length - 1; i >= 0; i--) {
     			var duration = users[i]["duration"];
     			var date = users[i]["date"];
     			total_hours = total_hours + parseInt(duration);
     			var userblock = '<tr> <td>'+date+' </td> <td>'+duration+' hours</td>	</tr>' ;
     			$('.attendance_list tbody').prepend(userblock); 

     		}
     		var block = '<tr> <th>Total Hours = </th> <th>'+total_hours+' hours</th>	</tr>';
     		$('.attendance_list tfoot').prepend(block);
     	});
     
   

}




/********************** Final report form page ****************************/

if($('[data-page="final_report_form"]').length > 0){

		var uni_id = getUrlVars()["uni_id"];
		var fullname = decodeURI(getUrlVars()["fullname"]);
		var user_id = getUrlVars()["id"];
		$('.data.navbar_home_link a').attr('href','usersdetails.html?id='+uni_id);
		var block = '<input type="hidden" name="user_id" value="'+user_id+'">';	
		$('form#final_report').prepend(block);	
		var date = new Date();
    	date = date.toDateString();
		$('input[name=std_name]').val(fullname);
		$('input[name=std_id]').val(uni_id);
		$('input[name=date]').val(date);		
     
	}




/********************** Final report  page ****************************/

if($('[data-page="final_report"]').length > 0){
	

		var id = getUrlVars()["id"];
		var uni_id = getUrlVars()["uni_id"];
		$('.data.navbar_home_link a').attr('href','usersdetails.html?id='+uni_id);
		var fullname = decodeURI(getUrlVars()["fullname"]);
		if(id == null){
			var id = eval('('+localStorage.getItem('user_date')+')')["id"];
			var fullname = eval('('+localStorage.getItem('user_date')+')')["fullname"];
		}
		
				
     	var request = $.ajax({
       		url:  server_domain + "api/finalreport.php",
       		method: "GET",
       		data: {'id':id}       
     	});
      

     // if data was saved
        request.done(function( users ) {
            
            var users = eval('(' + users + ')');
            $('.final_report_list').html('');           
            for (var i = users.length - 1; i >= 0; i--) {

                var activities = users[i]["activities"];
                var commiment = users[i]["commiment"];
                var absence = users[i]["absence"];
                var recomendation = users[i]["recomendation"];
                var tasks = users[i]["tasks"];
                var interaction = users[i]["interaction"];
                var learning = users[i]["learning"];
                var compliance = users[i]["compliance"];
                var propose = users[i]["propose"];
                var important = users[i]["important"];
                var conclusion = users[i]["conclusion"];
                var thoughts = users[i]["thoughts"];
                /////////////////////////////////////////////////////////////////////////////////
                

                var block = '<tr> <th>Student Name</th> <td>'+fullname+'</td>   </tr>' ;
                block += '<tr> <th>Activites</th> <td>'+activities+'</td>   </tr>' ;
                block += '<tr> <th>commiment</th> <td>'+commiment+'</td>    </tr>' ;
                block += '<tr> <th>absence</th> <td>'+absence+'</td>    </tr>' ;
                block += '<tr> <th>recomendation</th> <td>'+recomendation+'</td>    </tr>' ;
                block += '<tr> <th>tasks</th> <td>'+tasks+'</td>    </tr>' ;
                block += '<tr> <th>interaction</th> <td>'+interaction+'</td>    </tr>' ;
                block += '<tr> <th>learning</th> <td>'+learning+'</td>  </tr>' ;
                block += '<tr> <th>compliance</th> <td>'+compliance+'</td>  </tr>' ;
                block += '<tr> <th>propose</th> <td>'+propose+'</td>    </tr>' ;
                block += '<tr> <th>important</th> <td>'+important+'</td>    </tr>' ;
                block += '<tr> <th>conclusion</th> <td>'+conclusion+'</td>  </tr>' ;
                block += '<tr> <th>thoughts</th> <td>'+thoughts+'</td>  </tr>' ;
                ///////////////////////////////////////////////////////////////////////////////

                block = '<tbody>' + block + '</tbody>';
                $('.final_report_list').prepend(block); 
     			

     		}
     		
     	});
     
   

}



/********************** Classes List page ****************************/

if($('[data-page="classlist"]').length > 0){	

	 var company_id = eval('('+localStorage.getItem('user_date')+')')["company_id"];		
     var request = $.ajax({
       	url:  server_domain + "api/classeslist.php",
       	method: "GET",
       	data: {'company_id': company_id}
       
     });     

     
     request.done(function( classes ) {     		
     		var classes = eval('(' + classes + ')');
     		for (var i = classes.length - 1; i >= 0; i--) {
     			var class_name = classes[i]["name"];
     			var date_time = classes[i]["time"];

     			var classblock = '<li><a href="#" class="open-class"><span>'+class_name+'</span> <span style="margin-left: 70px;">' + date_time + '</span></a></li>';
     			$('.class_list').prepend(classblock);
     	}
     });

}



/********************** Companies List page ****************************/

if($('[data-page="companylist"]').length > 0){
	
     var request = $.ajax({
       url:  server_domain + "api/companieslist.php",
       method: "GET",           
     });
     
          
     request.done(function( companies ) { 
     	console.log(companies);    		
     	var companies = eval('(' + companies + ')');
     	for (var i = companies.length - 1; i >= 0; i--) {
     		var company_name = companies[i]["company_name"]; 
     		var company_description = companies[i]["company_description"];
     		var company_email = companies[i]["company_email"]; 
     		var company_website = companies[i]["company_website"];
     		var spv_name = companies[i]["fullname"];     		

     		var classblock  = 	'<li class="accordion-item"> \
     								 <a href="#" class="item-content item-link"> \
     								 	<div class="item-inner"><div class="item-title">'+company_name+'</div></div> \
     								 </a> \
     								 <div class="accordion-item-content"> \
     								 	<div class="content-block"> \
     								 		<div> About Company: '+company_description+'</div> \
     								 		<div> Email: '+company_email+'</div> \
     								 		<div> Website: '+company_website+'</div> \
     								 		<div> supervisor name: '+spv_name+'</div> \
     								 		<a href="#">Apply</a>  \
     								 	</div> \
     								 </div> \
     							</li>';
     		$('.company_list').prepend(classblock);
     	}
     });

}


/********************** profile page ****************************/

if($('[data-page="profile"]').length > 0){
	var name = eval('('+localStorage.getItem('user_date')+')')["fullname"];
	var email = eval('('+localStorage.getItem('user_date')+')')["email"];
	var phone_number = eval('('+localStorage.getItem('user_date')+')')["phone_number"];
	var uni_id = eval('('+localStorage.getItem('user_date')+')')["uni_id"];	
	$('input[name=name]').val(name);
	$('input[name=uni_id]').val(uni_id);
	$('input[name=email]').val(email);
	$('input[name=phone_number]').val(phone_number);
}


/********************** Email page ****************************/

if($('[data-page="email"]').length > 0){
	var reciver_id = getUrlVars()["id"];
	var uni_id = getUrlVars()["uni_id"];
	var sender_id = eval('('+localStorage.getItem('user_date')+')')["id"];
	var block = '<input type="hidden" name="reciver_id" value="'+reciver_id+'"> <input type="hidden" name="sender_id" value="'+sender_id+'">';	
	$('.data.navbar_home_link a').attr('href','usersdetails.html?id='+uni_id);
	$('form#email').prepend(block);	
}





/********************** Messages List page ****************************/

if($('[data-page="messages_list"]').length > 0){	

	   var id = eval('('+localStorage.getItem('user_date')+')')["id"];		
       var request = $.ajax({
       url:  server_domain + "api/messageslist.php",
       method: "GET",
       data: {'id': id}
       
     });     

     
     request.done(function( classes ) {     		
     	var classes = eval('(' + classes + ')');
     	for (var i = classes.length - 1; i >= 0; i--) {
     		var sender = classes[i]["sender"];
     		var text = classes[i]["text"];
			var create_at = classes[i]["create_at"]; 
     		var classblock = '<li> <div class="feat_small_details"> <h4>'+sender+'</h4> <h6>'+ create_at +'</h6><p>'+text+'</p> </div> </li>';
     		
     		$('.messages_list').prepend(classblock);
     	}
     });

}



/********************** Weekly Report Form page ****************************/

if($('[data-page="weekly_form"]').length > 0){
		var user_id = eval('('+localStorage.getItem('user_date')+')')["id"];
		var uni_id = eval('('+localStorage.getItem('user_date')+')')["uni_id"];
		var fullname = eval('('+localStorage.getItem('user_date')+')')["fullname"];
		
		 	
		var block = '<input type="hidden" name="user_id" value="'+user_id+'">';	
		$('form#weekly').prepend(block);		
		$('input[name=name]').val(fullname);
		$('input[name=id]').val(uni_id);
				
     
	}





/********************** Final report  page ****************************/

if($('[data-page="weekly_report"]').length > 0){
	

		var id = getUrlVars()["id"];
		var uni_id = getUrlVars()["uni_id"];
		$('.data.navbar_home_link a').attr('href','usersdetails.html?id='+uni_id);
		var fullname = decodeURI(getUrlVars()["fullname"]);
		if(id == null){
			var id = eval('('+localStorage.getItem('user_date')+')')["id"];
			var fullname = eval('('+localStorage.getItem('user_date')+')')["fullname"];
		}
		
				
     	var request = $.ajax({
       		url:  server_domain + "api/weeklyreport.php",
       		method: "GET",
       		data: {'id':id}       
     	});
      

     // if data was saved
     	request.done(function( users ) {
            
     		var users = eval('(' + users + ')');
     		$('.final_report_list').html('');     		
     		for (var i = users.length - 1; i >= 0; i--) {

     			
     			var tasks = users[i]["tasks"];
                var comments = users[i]["comments"];
                var benefit = users[i]["benefit"];
                var week_start_date = users[i]["week_start_date"];
                var week_end_date = users[i]["week_end_date"];
     			
				/////////////////////////////////////////////////////////////////////////////////
     			

     			var block = '<tr> <th>Tasks</th> <td>'+tasks+'</td>	</tr>' ;
                block +='<tr> <th>Comments</th> <td>'+comments+'</td>  </tr>' ;
                block +='<tr> <th>Benefit</th> <td>'+benefit+'</td>  </tr>' ;
                block +='<tr> <th>Week Start Date</th> <td>'+week_start_date+'</td>  </tr>' ;
                block +='<tr> <th>Week End Date</th> <td>'+week_end_date+'</td>  </tr>' ;
     			
     			///////////////////////////////////////////////////////////////////////////////

     			block = '<tbody>' + block + '</tbody>';
     			$('.weekly_report_list').prepend(block); 
     			

     		}
     		
     	});
     
   

}



/********************** Right panel (Account) ****************************/
if (localStorage.getItem('user_date') != null){
	var user_name = eval('('+localStorage.getItem('user_date')+')')["fullname"];
	$('#user_name').html('Hi, ' + user_name);
}


/********************** Form submiting ****************************/
	
   $('form').submit(function(e){     
     // disable redirect
     e.preventDefault();

     // collect all data in the form for any input or select
     var inputs = $(this).find('input,select,textarea,number');
     var data = {};
     inputs.each(function(){
        data[$(this).attr('name')] = $(this).val();
     });
	
	
     // send data to server
     var request = $.ajax({
     	url:  server_domain + "api/mobile_insert_final_report.php",
       	method: "POST",
       	data: data
       
     });
      

     // if data was saved
     request.done(function( msg ) {
     	
     	if(msg.indexOf('fullname') >= 0){
			localStorage.setItem('user_date',msg);
			var user_name = eval('('+localStorage.getItem('user_date')+')')["fullname"];
			$('#user_name').html('Hi, ' + user_name);
			var status = eval('('+localStorage.getItem('user_date')+')')["status"];
			var user_type = eval('('+localStorage.getItem('user_date')+')')["user_type"];
			if(status == "inactive" && user_type == "3" && company_id == null){
				
				
				
				
				var request = $.ajax({
			       url:  server_domain + "api/companieslist.php",
			       method: "GET",           
			     });
			     
			          
			     request.done(function( companies ) { 			     		
			     	var companies = eval('(' + companies + ')');
			     	$('.popup-company .company_li').html("");
			     	for (var i = companies.length - 1; i >= 0; i--) {
			     		var company_name = companies[i]["company_name"]; 
			     		var company_description = companies[i]["company_description"];
			     		var company_email = companies[i]["company_email"]; 
			     		var company_website = companies[i]["company_website"];
			     		var spv_name = companies[i]["fullname"]; 
			     		var company_id = companies[i]["company_id"];    		
			
			     		var classblock  = 	'<li class="accordion-item"> \
     								 <a href="#" class="item-content item-link"> \
     								 	<div class="item-inner"><div class="item-title">'+company_name+'</div></div> \
     								 </a> \
     								 <div class="accordion-item-content"> \
     								 	<div class="content-block"> \
     								 		<div> About Company: '+company_description+'</div> \
     								 		<div> Email: '+company_email+'</div> \
     								 		<div> Website: '+company_website+'</div> \
     								 		<div> supervisor name: '+spv_name+'</div> \
     								 		<a href="#" onclick="apply_company('+company_id+');">Apply</a>  \
     								 	</div> \
     								 </div> \
     							</li>';
			     		$('.popup-company .company_li').prepend(classblock);
			     	}
			     });
			
				myApp.popup('.popup-company');
			}

			$('.list-nav ul li:not([data-type*='+user_type+'])').hide();
			$('.popup-login').addClass('modal-in').fadeOut('slow');
     	}else{
     			 alert(msg);
     	}
      
      // alert(msg);

       //$('body').prepend(msg);
     });
      

     // if there is an error
     request.fail(function( jqXHR, textStatus ) {
       alert( "Request failed: " + textStatus );
     });

  });









		

	
	document.addEventListener('touchmove', function(event) {
	   if(event.target.parentNode.className.indexOf('navbarpages') != -1 || event.target.className.indexOf('navbarpages') != -1 ) {
		event.preventDefault(); }
	}, false);
	
	// Add ScrollFix
	var scrollingContent = document.getElementById("pages_maincontent");

	try{
	new ScrollFix(scrollingContent);
	}catch(e){}
	
	
	var ScrollFix = function(elem) {
		// Variables to track inputs
		var startY = startTopScroll = deltaY = undefined,
	
		elem = elem || elem.querySelector(elem);
	
		// If there is no element, then do nothing	
		if(!elem)
			return;
	
		// Handle the start of interactions
		elem.addEventListener('touchstart', function(event){
			startY = event.touches[0].pageY;
			startTopScroll = elem.scrollTop;
	
			if(startTopScroll <= 0)
				elem.scrollTop = 1;
	
			if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
				elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
		}, false);
	};


	/* Custom Code */

	
                  

 

               
            
	
		
		
});
