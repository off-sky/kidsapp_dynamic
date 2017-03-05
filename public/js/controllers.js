angular.module('kiddsapp.controllers', [])
.controller('menubarController', ['$scope', '$uibModal', 'userFactory', function($scope, $uibModal, userFactory){
    userFactory.updateCurrentUser();
    var modalInstance;  
    $scope.openLoginModal = function(){
       
        modalInstance = $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'views/login.html',
              controller: 'loginModalController'
        })
    }
   
    $scope.currentUser = function(){
        return userFactory.currentUser;
    }
    $scope.doLogOut = function () {
        userFactory.logout();
    }
    
}])

.controller('indexController', ['$scope', '$state', '$uibModal', 'userFactory', '$anchorScroll', '$location', 'scrollTo', function($scope, $state, $uibModal, userFactory, $anchorScroll, $location, scrollTo){
    
    
    
    console.log('Index controller loaded...');
    $scope.currentUser = function(){
        return $localStorage.getObject('currentUser', {username:'', admin:false});
    }
    
    $scope.scrollToAnchor = function(anchor){
        console.log('Scrolling to '+anchor);
        $location.hash(anchor);
        $anchorScroll();
    }
    if (scrollTo == 'news') $scope.scrollToAnchor('news');
    
}])

.controller('loginModalController', ['$scope', '$uibModalInstance', 'userFactory', function($scope, $uibModalInstance, userFactory){
    $scope.closeModal = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.loginError = false;
    $scope.loginErrorText = '';
    $scope.signInError = false;
    $scope.signInErrorText = '';
    $scope.newUser = {username:'', email:'', password:'', adminCode:'', lastName:'', firstName:'', position:''};
    $scope.user = {username:'', password: ''}
    
    $scope.doLogIn = function(){
        $scope.loginError = false;
        if ($scope.user != '' && $scope.user.password != '') {
            userFactory.userResource.login.loginUser($scope.user, function(res){
                userFactory.saveToken(res.token);
                userFactory.updateCurrentUser();
                userFactory.printCurrentUser();
                $uibModalInstance.close();
            }, function(err){
               $scope.loginError = true;
               $scope.loginErrorText = err;
            });
        }
        
    }
    $scope.doSignIn = function(){
        $scope.signInError = false;
        if ($scope.newUser.username != '' && $scope.newUser.password != '' && $scope.newUser.email != '') {
            userFactory.userResource.register.registerUser($scope.newUser, function(res){
                userFactory.saveToken(res.token);
                userFactory.updateCurrentUser();
            }, function(err){
                $scope.signInError = true;
                $scope.signInErrorText = err;
            })
        }
    }
    
}])

.controller('newsController', ['$scope', 'newsFactory', 'userFactory', '$localStorage', '$uibModal', '$anchorScroll', '$location', '$state', function($scope, newsFactory, userFactory, $localStorage, $uibModal, $anchorScroll, $location, $state){
    userFactory.updateCurrentUser();
    $scope.blankNews = {
        title: '',
        date: '',
        photo: 'assets/news/blank.png',
        text: '',
    }
    var News = newsFactory.newsResource;
    var news = [];
//    console.log('Scroll to news value is: '+scrollToNews);
    
//    if (scrollToNews) $scope.scrollToAnchor('news');
    
    $scope.scrollToAnchor = function(anchor){
        console.log('Scrolling to '+anchor);
        $location.hash(anchor);
        $anchorScroll();
    }
    
    $scope.current = 0;
    $scope.initialize = function(){
        News.getNews(function(res){
            for(var i = res.length-1; i >=0; i--) {news.push(res[i]); console.log(res[i])}
            $scope.newsOne = news[$scope.current] || $scope.blankNews;
            $scope.newsTwo = news[$scope.current+1] || $scope.blankNews;
            $scope.newsThree = news[$scope.current+2] || $scope.blankNews;
            if ($scope.detailedIndex > 0) $scope.detailedNews = newsFactory.getNewsById($scope.detailedNews.id);
        }, function(err){
            console.log(err)
        })
        
    }
    
    function updateNews(){
        news.length = 0;
        News.getNews(function(res){
            for(var i = res.length-1; i >=0; i--) {news.push(res[i]); console.log(res[i])}
        }, function(err){
            console.log(err)
        })
    }
    
    $scope.initialize();    
    $scope.detailedIndex = 0;
    $scope.detailedNews = {};
    var newsAddModalInstance;
    
    $scope.openNewsAddModal = function(){
       var newsAddModalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/addnews.html',
              controller: 'newsAddModalController',
              resolve: {
                  News: ['newsFactory', function(newsFactory){
                        return newsFactory.newsResource;
                    }]
              }
        });
        newsAddModalInstance.result.then(function(newsToAdd){
            console.log('Adding news:');
            console.log(newsToAdd);
            newsToAdd.$postNews();
//            newsFactory.addNews(newsToAdd);
            
        }, function(message){
            console.log(message);
        })
    }
    
    $scope.openNewsChangeModal = function(newsId) {
        
        var newsChangeModalInstance = $uibModal.open(
            {
                animation: true,
                templateUrl: 'views/changenews.html',
                controller: 'newsChangeModalController',
                resolve: {
                    newsToChange: [function(newsFactory){
                        console.log('Retreiving news with id: '+newsId);
                        return News.getOneNews({newsId: newsId}, function(res){
                            return res;
                        }, function(err){})
                    }]
                }
            });
    
        newsChangeModalInstance.result.then(function(){
            updateNews()
        }, function(message){
            console.log(message);
        })
      
    }
    
    
    
    
    $scope.resetDetailed = function(){
         $scope.detailedIndex = 0;
         $scope.detailedNews = {};
    }
    
    
    $scope.currentUser = function(){
        return userFactory.currentUser;
    }
    
    $scope.isAdmin = function(){
        return userFactory.currentUser.admin;
    }

    
    $scope.scrollNext = function(){
        console.log('scrollNext clicked');
        console.log('News one title: '+$scope.newsOne.title);
        var newsSize = news.length;
        console.log('News length: '+news.length);
        
        if ($scope.current + 3 >= newsSize) {
            $scope.current = 0;
            $scope.newsOne = news[$scope.current] || $scope.blankNews;
        } else {
            $scope.current += 3;
            $scope.newsOne = news[$scope.current] || $scope.blankNews;
        }
        $scope.newsTwo = news[$scope.current+1] || $scope.blankNews;
        $scope.newsThree = news[$scope.current+2] || $scope.blankNews;  
    }
    
    $scope.scrollPrevious = function(){

        console.log('News length: '+news.length);
        
        if ($scope.current - 3 <= 0) {
            $scope.current = 0;
            $scope.newsOne = news[$scope.current] || $scope.blankNews;
        } else {
            $scope.current -= 3;
            $scope.newsOne = news[$scope.current] || $scope.blankNews;
        }
        console.log('current: '+$scope.current);
        console.log('current title: '+news[$scope.current].title);
            $scope.newsTwo = news[$scope.current+1] || $scope.blankNews;
            $scope.newsThree = news[$scope.current+2] || $scope.blankNews;
        
    }
    
    
}])

.controller('newsDetailController', ['$scope', 'newsId', '$state', 'newsFactory','$uibModalInstance', function($scope, newsId, $state, newsFactory, $uibModalInstance){
    $state.go("app.newsdetail", {newsId: newsId});
    $scope.newsDetailed = {};
    
    var news = [];
    var currentInd = -1;
    newsFactory.newsResource.getNews(function(res){
        news = res.map(function(news, newsInd){
            if (news._id == newsId) {
                $scope.newsDetailed = news;
                currentInd = newsInd;
                return news;
            } else {
                return news;
            }
        })
    }, function(err){
        console.log(err);
    });
    
    function incrementCurrInd(){
        currentInd = currentInd >= news.length - 1 ? 0 : ++currentInd;
    }
    
    function decrementCurrInd(){
        currentInd = currentInd <= 0 ? news.length - 1 : --currentInd;
    }
    
    $scope.closeModal = function(){
        $uibModalInstance.dismiss('Dismissed by user');
    }
    
    $scope.previousNews = function(){
        decrementCurrInd();
        $scope.newsDetailed = news[currentInd];
        $state.go("app.newsdetail", {newsId: $scope.newsDetailed._id});
    }
    
    $scope.nextNews = function(){
        incrementCurrInd();
        $scope.newsDetailed = news[currentInd];
        $state.go("app.newsdetail", {newsId: $scope.newsDetailed._id});
    }
    
    
    
}])
.controller('newsAddModalController', ['$scope', '$uibModalInstance', 'News', function($scope, $uibModalInstance, News){
    
    $scope.newsToAdd = new News();
    $scope.closeModal = function(){
        $uibModalInstance.dismiss('Dismissed by user');
    }
    $scope.saveNews = function(){
        var photoPreview = angular.element(document.querySelector('#img-preview'));
        var base64Image = photoPreview.attr('src');
        console.log('The following base64 string will be written to the server: ');
        console.log(base64Image);
        if(base64Image.length > 0)
            $scope.newsToAdd.photo = base64Image;
        
        $uibModalInstance.close($scope.newsToAdd);
    }
}])

.controller('newsChangeModalController', ['$scope', '$uibModalInstance', 'newsToChange', function($scope, $uibModalInstance, newsToChange){
    $scope.newsToChange = newsToChange;
    console.log('Changing news:');
    console.log($scope.newsToChange);
    $scope.saveChanges = function(){
        var photoPreview = angular.element(document.querySelector('#img-preview'));
        var base64Image = photoPreview.attr('src');
        console.log('The following base64 string will be written to the server: ');
        console.log(base64Image);
        $scope.newsToChange.photo = base64Image;
        newsToChange.$updateNews({newsId:newsToChange._id});
        $uibModalInstance.close(null);
    }
    $scope.dismissChanges = function(){
        $uibModalInstance.dismiss('Dismissed changes by user');
    }
    $scope.deleteNews = function() {
        newsToChange.$deleteNews({newsId:newsToChange._id});
        $uibModalInstance.close(null);
    }
}])

.controller('teachersController', ['$scope', 'teachersFactory', '$timeout', '$state', '$window', '$uibModal', '$anchorScroll', '$location', function($scope, teachersFactory, $timeout, $state, $window, $uibModal, $anchorScroll, $location){
    

//    Teacher scroll functionality 
    
    console.log('Teachers controller loaded!!!');
    var teachers = [];
    var blocks = ['minus', 'one', 'two', 'three', 'plus'];
    var teacherDisplay = [];
    var counter = 0;
    var leftCounter = 0;
    var smCounter = 0;
    $scope.teacherMinus = {};
    $scope.teacherPlus = {};
    $scope.teacherOne = {};
    $scope.teacherTwo = {};
    $scope.teacherThree = {};
    $scope.teacherCur = teachers[smCounter];
    initialize()
    
    
   function initialize() {
        counter = 0;
        leftCounter = 0;
        smCounter = 0;
        teachersFactory.teachersResource.getTeachers(function(res){
            teachers = res;
            $scope.teacherCur = teachers[smCounter];
            teacherDisplay = [];
            populate();
        }, function(err){
            console.log(err);
        })
    }
    
    
    function incrementCur(){
        if (smCounter == teachers.length-1) smCounter = 0;
        else smCounter++;
        $scope.teacherCur = teachers[smCounter];
    }
    
    function decrementCur(){
        if (smCounter == 0) smCounter = teachers.length-1;
        else smCounter--;
        $scope.teacherCur = teachers[smCounter];
    }
    
    function populate(){
        for (var i = 0; i < 5; i++){
            teacherDisplay[i] = teachers[counter];
            incrementCounter();
        }
        console.log('Counter:');
        console.log(counter);
        $scope.teacherMinus = teacherDisplay[blocks.indexOf('minus')];
        $scope.teacherOne = teacherDisplay[blocks.indexOf('one')];
        $scope.teacherTwo = teacherDisplay[blocks.indexOf('two')];
        $scope.teacherThree = teacherDisplay[blocks.indexOf('three')];
        $scope.teacherPlus = teacherDisplay[blocks.indexOf('plus')];
        
    }
    
    function populateTeacherByAlias(alias) {
        if (alias == 'minus') $scope.teacherMinus = teacherDisplay[blocks.indexOf('minus')];                   
        if (alias == 'one') $scope.teacherOne = teacherDisplay[blocks.indexOf('one')];
        if (alias == 'two')  $scope.teacherTwo = teacherDisplay[blocks.indexOf('two')];
        if (alias == 'three') $scope.teacherThree = teacherDisplay[blocks.indexOf('three')];
        if (alias == 'plus') $scope.teacherPlus = teacherDisplay[blocks.indexOf('plus')];
    }
    
    
    
    function incrementCounter(){
        if (counter + 1 < teachers.length) counter++;
        else counter = 0;
    }
    
    function incrementLeftCounter(){
        if (leftCounter + 1 < teachers.length) leftCounter++;
        else leftCounter = 0;
    }
    
    function decrementLeftCounter(){
        if (leftCounter == 0) leftCounter = teachers.length - 1;
        else --leftCounter;
        console.log('Left counter: '+leftCounter);
    }
    
    $scope.scrollTeacherNext = function(){
       incrementCur();       
       console.log('---------------Next scroll triggered------------')
       blocks.push(blocks.shift());
       console.log('Blocks:');
       console.log(blocks);
       teacherDisplay.shift();
       teacherDisplay.push(teachers[counter]);
       incrementLeftCounter();
       incrementCounter();
       console.log('Teacher display:');
       console.log(teacherDisplay);
       populateTeacherByAlias(blocks[blocks.length-1]);
    }
    
    
  $scope.scrollTeacherPrevious = function(){
      decrementCur(); 
      console.log('---------------Previous scroll triggered------------')
      blocks.unshift(blocks.pop());
      console.log('Blocks:');
      console.log(blocks);
      decrementLeftCounter();
      teacherDisplay.pop();
      teacherDisplay.unshift(teachers[leftCounter]);
      populateTeacherByAlias(blocks[0]);
  }
  //    End of teacher scroll functionality 
  
  
  
//  Edit teachers functionality
    $scope.openTeacherEditModal = function(){
        var teacherEditModalIstance = $uibModal.open({
            templateUrl: 'views/editteacher.html',
            controller: 'teacherEditModalController',
            resolve: {
                teachers: ['teachersFactory', function(teachersFactory){
                    return teachersFactory.teachersResource.getTeachers();
                }]
            }
        });
//        teacherEditModalIstance.result.then(function(newTeachers){
//            console.log('Replacing teachers with:');
//            console.log(newTeachers);
//            teachersFactory.replaceTeachers(newTeachers);
//            console.log(teachersFactory.teachers);
//            initialize();
//        }, function(message){
//            console.log(message);
//        });
    }
//  End of edit teachers functionality
  
}])

.controller('teacherEditModalController', ['teachers', '$uibModalInstance', 'teachersFactory', '$scope', function(teachers, $uibModalInstance, teachersFactory, $scope){
    $scope.teachers = teachers;
    $scope.teacherForAdd = {firstName: '', lastName: '', position: '', photo: '', description: ''};
    $scope.showAddTeacherForm = false;
    $scope.editIndex = -1;
    $scope.editedTeacher = {};
    var teachersForUpdate = [],
        teachersForAdd = [],
        teachersForDelete = [];
    
    $scope.openAddTeacherForm = function(){
        $scope.showAddTeacherForm = true;
    }
    
    $scope.addTeacher = function(){
         var newTeacher = JSON.parse(JSON.stringify($scope.teacherForAdd))
         newTeacher._id = new Date().getMilliseconds+teachersForAdd.length;
         var photoPreview = angular.element(document.querySelector('#img-preview'));
         var base64Image = photoPreview.attr('src');
         newTeacher.photo = base64Image;
         newTeacher.newby = true;
         teachersForAdd.push(newTeacher);
         $scope.teachers.push(newTeacher);
         $scope.teacherForAdd = {firstName: '', lastName: '', position: '', photo: '', description: ''};
         $scope.showAddTeacherForm = false;
    }
    
    $scope.cancelTeacherAdd = function(){
        $scope.showAddTeacherForm = false;
        $scope.teacherForAdd = {firstName: '', lastName: '', position: '', photo: '', description: ''};
    }
    
    $scope.openTeacherEditForm  = function(teacher) {
        $scope.editIndex = teacher._id;
        $scope.editedTeacher = JSON.parse(JSON.stringify(teacher));
    }
    
    $scope.saveTeacherChanges = function(teacher){
        var photoPreview = angular.element(document.querySelector('#img-preview'));
        var base64Image = photoPreview.attr('src');
        teacher._id = $scope.editedTeacher._id;
        teacher.firstName = $scope.editedTeacher.firstName;
        teacher.lastName = $scope.editedTeacher.lastName;
        teacher.photo = base64Image;
        teacher.position = $scope.editedTeacher.position;
        teacher.description = $scope.editedTeacher.description;
        $scope.editedTeacher = {};
        if(!teacher.newby) teachersForUpdate.push(teacher);
        $scope.editIndex = -1;
        
    }
    
    $scope.cancelTeacherChanges = function(){
        $scope.editIndex = -1;
    }
    
    $scope.closeModal = function(){
        $uibModalInstance.dismiss('Teacher edit dismissed by user');
    }
    $scope.deleteTeacher = function(teacherId){
        $scope.teachers.map(function(x, y) {
        if(x._id == teacherId) $scope.teachers.splice(y, 1);
        return x._id})
        teachersForDelete.push(teacherId);
    }
//    $scope.saveTeacherChangesById = function(teacherId, newTeacher){
//        for(var i = 0; i < $scope.teachers.length; i++){
//           if ($scope.teachers[i].id == teacherId) $scope.teachers.splice(i, 1, newTeacher);
//        }
//    }
    
    $scope.saveChanges = function() {
        console.log('Teachers to be added:');
        console.log(teachersForAdd);
        console.log('Teachers to be updated:');
        console.log(teachersForUpdate);
        console.log('Teachers to be deleted:');
        console.log(teachersForDelete);
        
        var resource = teachersFactory.teachersResource;
        teachersForAdd.map(function(x){
            delete x._id;
            delete x.newby;
            console.log('Posting teacher to server:');
            console.log(x);
            resource.postTeacher(x);
        })
        teachersForUpdate.map(function(x){
            console.log('Updating teacher on server:');
            console.log(teachersForUpdate);
            resource.updateTeacher({teacherId:x._id}, x)
        })
        teachersForDelete.map(function(x){
            console.log('Deleting teacher on server:');
            console.log(x);
            resource.deleteTeacher({teacherId:x});
        })
        $uibModalInstance.close($scope.teachers);
    }
}])

.controller('teacherDetailController',  ['$scope', 'teacher', function($scope, teacher){
    $scope.teacher = teacher;
    
}])
.controller('galleryController',  ['$scope', '$state', 'galleryFactory', '$uibModal', function($scope, $state, galleryFactory, $uibModal){
    
    $scope.openEditEventModal = function(eventId){
        $uibModal.open({
            size: 'lg',
            templateUrl: 'views/event-edit.html',
            controller: 'editEventController',
            resolve: {
                editedEvent: ['galleryFactory', function(galleryFactory){
                    return galleryFactory.galleryResource.getOneEvent({eventId: eventId})
                }]
            }
        })
    }
    
    $scope.openAddEventModal = function(){
        $uibModal.open({
            size: 'lg',
            templateUrl: 'views/event-add.html',
            controller: 'addEventController'
        })
    }
    $scope.gallery = [];
    galleryFactory.galleryResource.getEvents(function(res){
        for(var j = res.length - 1; j >= 0; j--) $scope.gallery.push(res[j]);
    });
}])

.controller('editEventController', ['$uibModalInstance', '$scope', 'galleryFactory', 'editedEvent', function($uibModalInstance, $scope, galleryFactory, editedEvent){
    $scope.editedEvent = editedEvent;
    console.log($scope.editedEvent);
    $scope.closeModal = function(){
        $uibModalInstance.dismiss('Dismised by user');
    }
    $scope.saveChanges = function(){
        var photos = angular.element(document.querySelectorAll('.new-image'));
        var counter = 0;
        for (var i = 0; i < photos.length; i++){
            $scope.editedEvent.photos.push({ref: photos[i].src})
            console.log('Image source: ' + photos[i].src);
            counter++;
        }
        console.log(counter+' new photos added...');
        galleryFactory.galleryResource.updateEvent({eventId: $scope.editedEvent._id}, $scope.editedEvent);
        $uibModalInstance.close();
    }
    $scope.deletePhoto = function(id){
        $scope.editedEvent.photos.map(function(x, ind){
            if (x._id == id) $scope.editedEvent.photos.splice(ind, 1);
            console.log('Deleted photo: '+x._id);
        })
    }
    
    $scope.deleteEvent = function(){
         galleryFactory.galleryResource.deleteEvent({eventId: $scope.editedEvent._id});
        $uibModalInstance.close();
    }
}])

.controller('addEventController', ['$uibModalInstance', '$scope', 'galleryFactory', function($uibModalInstance, $scope, galleryFactory){
    $scope.newEvent = {name:'', date: '', photos: []}
    $scope.postEvent = function(){
       var photos = angular.element(document.querySelectorAll('.preview-image'));
       console.log('The following photos will be posted:');
       for (var i = 0; i < photos.length; i++) {
           $scope.newEvent.photos.push({ref: photos[i].src});
       }
       galleryFactory.galleryResource.postEvent($scope.newEvent);
       $uibModalInstance.close();
    }
    $scope.closeModal = function(){
        $uibModalInstance.dismiss('Dismised by user');
    }
}])

.controller('eventDetailController',  ['$scope', 'galleryFactory', 'eventId', function($scope, galleryFactory, eventId){
    $scope.event = {};
    $scope.upperPortion = [];
    $scope.lowerPortion = [];
    galleryFactory.galleryResource.getOneEvent({eventId: eventId}, function(res){
        $scope.event = res;
        var photos = res.photos;
        var middle = Math.ceil(photos.length/2);
        $scope.upperPortion = photos.slice(0, middle);
        $scope.lowerPortion = photos.slice(middle, photos.length);
    })
    
}])

.controller('aboutusController', ['$state', 'userFactory', '$scope', '$anchorScroll', '$location', 'scrollTo', function($state, userFactory, $scope, $anchorScroll, $location, scrollTo){
    $state.go('app.aboutus.general', {scrollTo: scrollTo});
    userFactory.updateCurrentUser();
    console.log('Current state: '+$state.current.name+'.');
    $scope.currentUser = function(){
        return userFactory.currentUser;
    }
    $scope.isAdmin = function(){
        return userFactory.currentUser.admin;
    }
}])

.controller('photoFrameController', ['$scope', 'galleryFactory', '$uibModalInstance', '$state', 'eventId', 'photoId', function($scope, galleryFactory, $uibModalInstance, $state, eventId, photoId){
//    if (!$state.is('aboutus.photo.detail'))
    $state.go('app.aboutus.detail', {eventId: eventId, photoId: photoId});
    $scope.currentPhoto = {};
    $scope.currentEvent = {};
    $scope.closeModal = function() {
        $uibModalInstance.dismiss();
    }
//     Photo scroll functionality
    var eventIndex = -1;
    var photoIndex = -1;
    var gallery = [];
    galleryFactory.galleryResource.query(function(res){
        for(var r = res.length - 1; r >= 0; r--)
            gallery.push(res[r]);
        gallery.map(function(x, ind){
            if (x._id == eventId) {
                $scope.currentEvent = x;
                eventIndex = ind;
                x.photos.map(function(y, yInd){
                    if(y._id == photoId) {
                        $scope.currentPhoto = y;
                        photoIndex = yInd;
                    }
                })
            }
        })
        console.log($scope.currentPhoto);
        
    }, function(err){
        console.log(err);
    })
    
    function incrementEventIndex() {
        eventIndex = eventIndex >= gallery.length - 1 ? 0 : ++eventIndex;
        console.log('Incremented event index: '+eventIndex);
    };
    
    function decrementEventIndex() {
        eventIndex = eventIndex <= 0 ? gallery.length-1 : --eventIndex;
        console.log('Decremented event index: '+eventIndex);
    };
    
    $scope.nextPhoto = function() {
        var photosInCurrentEvent = $scope.currentEvent.photos.length;
        if (photoIndex >= photosInCurrentEvent-1) {
            incrementEventIndex();
            $scope.currentEvent = gallery[eventIndex];
            photoIndex = 0;
            $scope.currentPhoto = $scope.currentEvent.photos[photoIndex];
            $state.go('app.aboutus.detail', {eventId:$scope.currentEvent._id, photoId: $scope.currentPhoto._id});
        } else {
            photoIndex++;
            $scope.currentPhoto = $scope.currentEvent.photos[photoIndex];
            $state.go('app.aboutus.detail', {eventId: $scope.currentEvent._id, photoId: $scope.currentPhoto._id});
        }
    };
    
    
    $scope.previousPhoto = function(){
        if (photoIndex == 0) {
           decrementEventIndex();
           $scope.currentEvent = gallery[eventIndex];
            photoIndex = $scope.currentEvent.photos.length - 1;
            $scope.currentPhoto = $scope.currentEvent.photos[photoIndex];
            $state.go('app.aboutus.detail', {eventId:$scope.currentEvent._id, photoId: $scope.currentPhoto._id});
        } else {
            photoIndex--;
            $scope.currentPhoto = $scope.currentEvent.photos[photoIndex];
            $state.go('app.aboutus.detail', {eventId:$scope.currentEvent._id, photoId: $scope.currentPhoto._id});
        }
    };
    
//    End of Photo scroll functionality
}])


.controller('loginController', [function(){
    
}])
.controller('servicesController', ['$anchorScroll', '$location', 'scrollTo', 'userFactory', '$scope', function($anchorScroll, $location, scrollTo, $state, userFactory, $scope){
    if (scrollTo != '') {
        $location.hash(scrollTo);
        $anchorScroll();
    }
    
}])
//.controller('passTestController', ['$state', 'userFactory', '$scope', function($state, userFactory, $scope){
//    $state.go('passtest_initial');
//}])
.controller('passTestInitialController', ['$scope', 'tests', '$state', '$window', 'captchaFactory', function($scope, tests, $state, $window, captchaFactory){
    
    $scope.captcha = captchaFactory.getCaptcha();
    $scope.captcha.input = "";
    $scope.wrongCaptcha = false;
    $scope.tests = tests;
    $scope.testDetails = {
        test_name: '',
        remember: false,
        username: '',
        result_code: '',
        date: new Date()
    }
    $scope.printRemember = function(){
        console.log($scope.testDetails.remember);
    }
    
    
    $scope.generateTest = function(alias, testname){
        console.log("Checking capcha...");
        console.log(captchaFactory.checkCaptcha($scope.captcha.input, $scope.captcha.id));
        if($scope.testDetails.remember && !captchaFactory.checkCaptcha($scope.captcha.input, $scope.captcha.id)) {
            console.log("Wrong captcha...");
            $scope.wrongCaptcha = true;
            return;
        }
        $scope.testDetails.test_name = testname;
        $state.go('app.passtest_test', {alias: alias, testDetails: $scope.testDetails}); 
    }
    
    
    
}])
.controller('passTestTestController', ['testDetails', 'test', '$scope', '$state', '$uibModal', 'passTestFactory', function(testDetails, test, $scope, $state, $uibModal, passTestFactory){
    if (testDetails == null) $state.go('app.passtest_initial');
    var test = test;
    var questionCycleCounter = 0;
    var shouldCheckLevel = false;
    var currentGrammar = '';
    $scope.testDetails = testDetails;
    $scope.testDetails.level = 0;
    $scope.testDetails.grammar = {total:0, scored:0};
    $scope.testDetails.lexis = {total:0, scored:0};
    $scope.testDetails.reading = {total:0, scored:0};
    $scope.testDetails.listening = {total:0, scored:0};
    $scope.testDetails.questions = [];
    $scope.testDetails.recommendedGrammar = [];
    $scope.currentQuestion = {};
  
    
    $scope.saveAndNext = function(){
        $scope.testDetails.questions.push($scope.currentQuestion);
        if ($scope.currentQuestion.target == 'Grammar') {
            $scope.testDetails.grammar.total++;
            $scope.testDetails.grammar.scored += $scope.currentQuestion.result;
        }
        if ($scope.currentQuestion.target == 'Lexis') {
            $scope.testDetails.lexis.total++;
            $scope.testDetails.lexis.scored += $scope.currentQuestion.result;
        }
        if ($scope.currentQuestion.target == 'Reading') {
            $scope.testDetails.reading.total++;
            $scope.testDetails.reading.scored += $scope.currentQuestion.result;
        }
        if ($scope.currentQuestion.target == 'Listening') {
            $scope.testDetails.listening.total++;
            $scope.testDetails.listening.scored += $scope.currentQuestion.result;
        }
        assignQuestion();
    }
    
    $scope.showResult = function(){
        $uibModal.open({
            size: 'md',
            templateUrl: 'views/show-test-result.html',
            controller: 'showTestResultController',
            resolve: {
                testDetails: [function(){
                    return $scope.testDetails;
                }]
            }
        })
    }
    
    function assignQuestion(){
//        for debug
//        $scope.currentQuestion = test.levels[$scope.testDetails.level].matchQuestions[0];
        console.log('Current overall result:');
        calculateStatistics();
        console.log($scope.testDetails.overallRating);
        if (currentLevelEmpty()) {
            console.log('Current level is empty!');
            $scope.printResult();
            return;
        }
            do {
                pickAQuestion();
                //debug
                console.log($scope.currentQuestion);
                questionCycleCounter++;
            } while ($scope.currentQuestion == null)
                
            
        if ($scope.currentQuestion.type == 'oddWordOut')
             $scope.currentQuestion.a = ''
        else
            $scope.currentQuestion.a = [];
    }
    
    function currentLevelEmpty(){
        if ($scope.testDetails.level > 2) return true;
        var empty = true;
        if (test.levels[$scope.testDetails.level].grammar.length != 0) empty = false;
        if (test.levels[$scope.testDetails.level].matchQuestions.length != 0) empty = false;
        if (test.levels[$scope.testDetails.level].textTrueOrFalseQuestions.length != 0) empty = false;
        if (test.levels[$scope.testDetails.level].listeningTrueOrFalseQuestions.length != 0) empty = false;
        if (test.levels[$scope.testDetails.level].oddWordOutQuestions.length != 0) empty = false;
        return empty;
    }
    
    function pickAQuestion(){
        if (questionCycleCounter < 4) {
            if (shouldCheckLevel) checkLevel();
            var topicObject = popRandomArrayElement(test.levels[$scope.testDetails.level].grammar);
            $scope.currentQuestion = popRandomArrayElement(topicObject.elem).elem;
            currentGrammar = test.levels[$scope.testDetails.level].grammar_Topics[topicObject.index];
        } else if (questionCycleCounter < 5) {
            if (shouldCheckLevel) checkLevel();
            $scope.currentQuestion = popRandomArrayElement(test.levels[$scope.testDetails.level].oddWordOutQuestions).elem;
        } else if (questionCycleCounter < 6) {
            if (shouldCheckLevel) checkLevel();
            $scope.currentQuestion = popRandomArrayElement(test.levels[$scope.testDetails.level].matchQuestions).elem;
        }else if (questionCycleCounter == 6) {
            if (shouldCheckLevel) checkLevel();
            $scope.currentQuestion = popRandomArrayElement(test.levels[$scope.testDetails.level].listeningTrueOrFalseQuestions).elem;
        } else if (questionCycleCounter == 7) {
            if (shouldCheckLevel) checkLevel();
            $scope.currentQuestion = popRandomArrayElement(test.levels[$scope.testDetails.level].textTrueOrFalseQuestions).elem;
        } else if (questionCycleCounter == 8) {
            questionCycleCounter = 0;
            if (shouldCheckLevel) {$scope.printResult();}
            else if (!eligibleForSecondChance()) $scope.printResult();
            else checkLevel();
            assignQuestion();
        }
         console.log(questionCycleCounter);
        
    }
    
    //testing and debugging
    assignQuestion();
    
    function checkLevel(){
        console.log('Checking level...');
        var eligible = eligibleForNextLevel();
        if (eligible && $scope.testDetails.level == 2) {
            if ($scope.testDetails.overallRating > 95) $scope.testDetails.level = 4;
            else $scope.testDetails.level = 3;
            $scope.printResult();
            return;
        }
        if (eligible) {
            $scope.testDetails.level++;
            console.log('Changed to level: '+$scope.testDetails.level);
            questionCycleCounter = 0;
            shouldCheckLevel = false;
            
        }  else if (!shouldCheckLevel) {
            shouldCheckLevel = true;
        }
        
    }
    
    function eligibleForSecondChance(){
        calculateStatistics();
         if ($scope.testDetails.overallRating >= 60) {
             console.log('Eligible for a second chance.');
             return true;
         } else {
             console.log('Not eligible for a second chance.');
             return false;
         }
    }
    
    function eligibleForNextLevel(){
        calculateStatistics();
        if ($scope.testDetails.overallRating >= 80) {
            console.log('Overall rating: '+$scope.testDetails.overallRating);
            console.log('Eligible for next level');
            return true
        }   else {
            console.log('Overall rating: '+$scope.testDetails.overallRating);
            console.log('Not Eligible for next level');
            return false;
        }
    }
    
    function calculateStatistics(){
            $scope.testDetails.grammar.rating = Math.round(($scope.testDetails.grammar.scored / $scope.testDetails.grammar.total)*100);
            if (isNaN($scope.testDetails.grammar.rating)) $scope.testDetails.grammar.rating = 0;
            $scope.testDetails.lexis.rating = Math.round(($scope.testDetails.lexis.scored / $scope.testDetails.lexis.total)*100);
            if (isNaN($scope.testDetails.lexis.rating)) $scope.testDetails.lexis.rating = 0;
            $scope.testDetails.reading.rating = Math.round(($scope.testDetails.reading.scored / $scope.testDetails.reading.total)*100);
            if (isNaN($scope.testDetails.reading.rating)) $scope.testDetails.reading.rating = 0;
            $scope.testDetails.listening.rating = Math.round(($scope.testDetails.listening.scored / $scope.testDetails.listening.total)*100);
            if (isNaN($scope.testDetails.listening.rating)) $scope.testDetails.listening.rating = 0;
            $scope.testDetails.overallRating = Math.round(($scope.testDetails.grammar.rating + $scope.testDetails.lexis.rating +
            $scope.testDetails.reading.rating + $scope.testDetails.listening.rating) / 4)
    }
    
    
    function pickRandomLexisQuestion(){
        var random = Math.random()*10;
        if (random < 5) return popRandomArrayElement(test.levels[$scope.testDetails.level].oddWordOutQuestions);
        else return popRandomArrayElement(test.levels[$scope.testDetails.level].matchQuestions);
    }
    
    function popRandomArrayElement(array){
        if (array == null) return {elem: null, index: -1};
        if (array.length == 0) return {elem: null, index: -1};
        var ind = Math.floor(Math.random()*array.length);
        var element = array[ind];
        array.splice(ind, 1);
        return {
            elem: element,
            index: ind
        }
    }
    
    
    //test Match question
    var lookingForRightCounterPart = false;
    var lookingForLeftCounterPart = false;
    $scope.highlight = '';
    var colors = ["Aqua", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"]
    
   
    $scope.getColorLeft = function(item){
        var leftAnswers = $scope.currentQuestion.userInput[0];
        var colorInd = leftAnswers.indexOf(item);
        if (colorInd == -1) return 'Black'
        else return colors[colorInd];
    }
    
    $scope.getColorRight = function(item){
        var rightAnswers = $scope.currentQuestion.userInput[1];
        var colorInd = rightAnswers.indexOf(item);
        if (colorInd == -1) return 'Black'
        else return colors[colorInd];
    }
    
    $scope.handleLeftClick = function(item){
        var leftAnswers = $scope.currentQuestion.userInput[0];
        var rightAnswers = $scope.currentQuestion.userInput[1];
        var index = leftAnswers.indexOf(item.id);
        if (!lookingForRightCounterPart) {
            if (index == -1) {
                leftAnswers.push(item.id);
                if (!lookingForLeftCounterPart) lookingForRightCounterPart = true;
            }
            else {
                leftAnswers.splice(index, 1);
                if (index < rightAnswers.length) {
                    $scope.currentQuestion.right[rightAnswers[index]].add = false;
                    rightAnswers.splice(index, 1); }
            }
            lookingForLeftCounterPart = false;
        } else {
            if (index == -1) {
                $scope.currentQuestion.left[leftAnswers.pop()].add = false;
                leftAnswers.push(item.id);
            } else {
                leftAnswers.splice(index, 1); item.add = false;
                lookingForRightCounterPart = false;
                if (index < rightAnswers.length) { 
                    $scope.currentQuestion.right[rightAnswers[index]].add = false;
                    rightAnswers.splice(index, 1);
                }
            }
            
        }
    }
    
    
    $scope.handleRightClick = function(item){
        var leftAnswers = $scope.currentQuestion.userInput[0];
        var rightAnswers = $scope.currentQuestion.userInput[1];
        var index = rightAnswers.indexOf(item.id);
        
         if (!lookingForLeftCounterPart)   {
                if (index == -1) {
                    rightAnswers.push(item.id);
                    if (!lookingForRightCounterPart) lookingForLeftCounterPart = true;
                }
                else {
                    rightAnswers.splice(index, 1);
                    if (index < leftAnswers.length) { 
                        $scope.currentQuestion.left[leftAnswers[index]].add = false; 
                        leftAnswers.splice(index, 1);}
                }
                lookingForRightCounterPart = false;
                
            } else {
                if (index == -1) {
                    $scope.currentQuestion.right[rightAnswers.pop()].add = false;
                    rightAnswers.push(item.id);
                } else {
                    rightAnswers.splice(index, 1); item.add = false;
                    lookingForLeftCounterPart = false;
                    if (index < leftAnswers.length) {
                        $scope.currentQuestion.left[leftAnswers[index]].add = false; 
                        leftAnswers.splice(index, 1); 
                    }
                }
            }
        
    }
    
    $scope.printResult = function(){
        calculateStatistics();
        console.log($scope.testDetails);
        if ($scope.testDetails.remember && $scope.testDetails.username.length > 0) {
            var questionObject = {questions : $scope.testDetails.questions}
            var questionString = JSON.stringify(questionObject);
            delete $scope.testDetails.questions;
            $scope.testDetails.questionString = questionString;
            passTestFactory.testResultResource.postResult($scope.testDetails, function(res){
                $state.go('app.passtest_result_saved', {trId: res.id});
            }, function(err){ console.log(err)}); 
        } else $state.go('app.passtest_result', {testDetails: $scope.testDetails});  
    }
    //end of test MatchQuestion
    

    
    $scope.processTrueOrFalseClick = function(question, option){
        if(option.add == true) {
            question.a.push(option.id);
        } else {
            var ind = question.a.indexOf(option.id);
            question.a.splice(ind, 1);
        }
        console.log('Answers for '+question.type+':');
        console.log(question.a);
    }
    
    $scope.setOddWordAnswer = function(word) {
        $scope.currentQuestion.a = word;
    }
    
    $scope.checkTrueOrFalse = function(question) {
        var incr = 1 / question.q.length;
        var result = 0;
        for(var i = 0; i < question.q.length; i++) {
            var id = question.q[i].id;
            
            //prepare for display
            if (question.c.indexOf(id) != -1) {
                console.log('Assigning true to option correct')
                question.q[i].correct = true;
            } else {
                console.log('Assigning false to option correct')
                 question.q[i].correct = false;
            }
            
            if (question.c.indexOf(id) == -1 && question.a.indexOf(id) == -1) {
                result += incr;
                continue;
            } 
            else {
                if (question.c.indexOf(id) != -1 && question.a.indexOf(id) != -1) {
                    result += incr;
                    continue;
                }
                result -= incr;
            }  
        }
        if (question.a.length == 0) {
            question.result = 0;
            $scope.saveAndNext();
            return;
        }
        
        if (result < 0.6 && $scope.currentQuestion.type == 'multipleChoiceGrammar') 
            $scope.testDetails.recommendedGrammar.push(currentGrammar);
        if (result < 0) result = 0;
        question.result = result;
        $scope.saveAndNext();    
    }
    
      $scope.checkMatchQuestion = function(question) {
         var incr = 1 / question.left.length;
         var result = 0;
         for (var i = 0; i < question.left.length; i++) {
            if (question.userInput[0].indexOf(question.c[0][i]) == -1) {
                    question.left[question.c[0][i]].correct = false;
                    question.right[question.c[1][i]].correct = false;
                    console.log('Decrementing result by: '+incr);
                    continue;
                }
             else {
                    if (question.userInput[1][question.userInput[0].indexOf(question.c[0][i])]
                       == question.c[1][i]) {
                        console.log('Incrementing result by: '+incr);
                        result += incr;
                        question.left[question.c[0][i]].correct = true;
                        question.right[question.c[1][i]].correct = true;
                    } else {
                        question.left[question.c[0][i]].correct = false;
                        question.right[question.c[1][i]].correct = false;
                        continue;
                    }
                }
        }
        if (result < 0) result = 0;
        question.result = result;
        $scope.saveAndNext();
     }
    
    $scope.checkOddWordOutQuestion = function(question){
        if (question.odd == question.a)
            question.result = 1;
        else
            question.result = 0;
        $scope.saveAndNext();
    }
    
    
    
}])

.controller('showTestResultController', ['$scope', 'testDetails', '$uibModalInstance', function($scope, testDetails, $uibModalInstance){
    $scope.testDetails = testDetails;
    $scope.closeModal = function(){
        $uibModalInstance.dismiss('Dismissed by user...');
    }
    $scope.getTextLevel = function(level_id) {
        if (level_id == 0) return 'Незайманий'
        if (level_id == 1) return 'Початковий'
        if (level_id == 2) return 'Середній'
        if (level_id == 3) return 'Високий'
        if (level_id == 4) return 'Неперевершений'
        
    }
}])

.controller('passTestResultController', ['$scope', 'testDetails', '$state', function($scope, testDetails, $state){
    if (testDetails == null) $state.go('app.passtest_initial');
    $scope.testDetails = testDetails;
    $scope.message = '';
    $scope.getTextLevel = function(level_id) {
        if (level_id == 0) return 'Незайманий'
        if (level_id == 1) return 'Початковий'
        if (level_id == 2) return 'Середній'
        if (level_id == 3) return 'Високий'
        if (level_id == 4) return 'Неперевершений'
        
    }
}])

.controller('passTestResultSavedController', ['$scope', 'passTestFactory', '$state', 'testDetails', function($scope, passTestFactory, $state, testDetails){
    console.log('PasstestResultSaved Controller loaded');
    $scope.testDetails = testDetails;
    $scope.message = 'Скопіюйте посилання на свій результат, щоб потім отримати доступ до нього.';
    $scope.getTextLevel = function(level_id) {
        if (level_id == 0) return 'Незайманий'
        if (level_id == 1) return 'Початковий'
        if (level_id == 2) return 'Середній'
        if (level_id == 3) return 'Високий'
        if (level_id == 4) return 'Неперевершений'
        
    }
}])

.controller('contactusController', ['$state', 'userFactory', '$scope', function($state, userFactory, $scope){
    $scope.mapUrl = 'assets/Map.png';
    $scope.showLarge = false;
    $scope.mapText = 'Натисніть на карту, щоб збільшити.'
    $scope.toggleMap = function() {
        if (!$scope.showLarge) {
            $scope.mapUrl = 'assets/Map_ex.png';
            $scope.mapText = 'Натисніть на карту, щоб зменшити.'
        }
        else {
            $scope.mapUrl = 'assets/Map.png';
             $scope.mapText = 'Натисніть на карту, щоб збільшити.'
        }
         $scope.showLarge = ! $scope.showLarge;
    }
}])

