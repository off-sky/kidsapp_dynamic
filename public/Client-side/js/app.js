
//'use strict'
angular.module('kiddsapp', ['kiddsapp.controllers', 'kiddsapp.services', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'ngResource', 'ngCookies'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
    
    .state('app', {
        url: '/',
        params: {
            scrollTo: ''
        },
        onEnter: [function(){
            console.log('Entered main state');
        }],
        views: {
            'header': {
                templateUrl: 'views/index-header.html',
                controller: 'indexController'
            },
            'mainContent': {
                templateUrl: 'views/index-content.html',
                controller: 'newsController'
            },
            'footer': {
                templateUrl: 'views/footer.html'
            }
        },
        resolve: {
            scrollTo: ['$stateParams', function($stateParams){
                return $stateParams.scrollTo
            }]
        }
        
    })
    
    
    .state('app.newsframe', {
        url: '',
        params: {
            newsId: null
        },
        onEnter: ['$uibModal', '$stateParams', 'newsFactory', 'my_config', '$state', function($uibModal, $stateParams, newsFactory, my_config, $state){
            if (!my_config.modalOpen) {
                console.log('Opening news detail modal');
                my_config.modalOpen = true;
                $uibModal.open({
                    size: 'lg',
                    controller: 'newsDetailController',
                    templateUrl: 'views/news-frame.html',
                    resolve: {
                        newsId: [function(){
                            return $stateParams.newsId;
                        }]

                    }
                }).result.then(function(){
                    my_config.modalOpen = false;
                    $state.go('app');
                    
                }, function(){
                    my_config.modalOpen = false;
                    $state.go('app');
                })
            }
        }]
    })
    
    
    .state('app.newsdetail', {
        url: 'news/:newsId',
        onEnter: ['$state', '$stateParams', 'my_config', function($state, $stateParams, my_config){
            if (!my_config.modalOpen)
                $state.go("app.newsframe", {newsId: $stateParams.newsId})
        }]
    })
    
        
    .state('app.aboutus', {
        url: 'aboutus',
        params: {
            scrollTo: ''
        },
        views: {
            'header@': {
                templateUrl: 'views/common-header.html',
            },
            'mainContent@': {
                templateUrl: 'views/aboutus-content.html',
                controller: 'aboutusController'
            }
        },
        resolve: {
            scrollTo: ['$stateParams', function($stateParams){
                return $stateParams.scrollTo;
            }]
        }
        
    })
    
    
    .state('app.aboutus.general', {
        params: {
            scrollTo: ''
        },
        onEnter: ['scrollTo', '$anchorScroll', '$location', '$timeout', function(scrollTo, $anchorScroll, $location, $timeout){
                console.log('Entered aboutus general. Will scroll to '+scrollTo)
                 if(scrollTo != '') {
                    $timeout(function(){
                        $location.hash(scrollTo);
                        $anchorScroll();
                        $location.hash('');
                }, 500);
                }                
                
            }],
        url: '/',
        views: {
           'teacherFrame' : {
                templateUrl: 'views/teachers.html',
           },
            'galleryFrame': {
                templateUrl: 'views/gallery.html',
            }
       },
        resolve: {
            scrollTo: ['$stateParams', function($stateParams){
                return $stateParams.scrollTo;
            }]
        }
        
    })
    
    
    
    .state('app.aboutus.teacher', {
        url: '/teachers/:teacherId',
        views: {
           'teacherFrame' : {
                templateUrl: 'views/teacher-detail.html',
                controller: 'teacherDetailController'
           },
            'galleryFrame': {
                templateUrl: 'views/gallery.html',
                controller: 'galleryController'
            }
           
       },
        resolve: {
            teacher: ['$stateParams', 'teachersFactory', function($stateParams, teachersFactory){
                return teachersFactory.teachersResource.getOneTeacher({teacherId: $stateParams.teacherId});
            }]
        }
    })
    
    
    .state('app.aboutus.event', {
        url: '/gallery/:eventId',
        views: {
            'teacherFrame' : {
                templateUrl: 'views/teachers.html',
                controller: 'teachersController'
           },
           'galleryFrame' : {
                templateUrl: 'views/event-detail.html',
                controller: 'eventDetailController'
           }
       },
        resolve: {
            eventId: ['$stateParams', function($stateParams){
                return $stateParams.eventId;
            }]
        }
    })
    
    .state('app.aboutus.photo', {
        url: '/',
        params: {
            eventId: null,
            photoId: null
        },
         onEnter: ['$uibModal', 'galleryFactory', '$state', '$stateParams', 'previousState', function($uibModal, galleryFactory, $state, $stateParams, previousState){
             var eventId = $stateParams.eventId;
             var photoId = $stateParams.photoId;
             $uibModal.open({
                 animation: true,
                 size: 'lg',
                 templateUrl: 'views/photo-frame.html',
                 controller: 'photoFrameController', 
                 resolve: {
                     eventId: [function(){
                         return eventId;
                     }],
                     photoId: [function(){
                         return photoId;
                     }]
                 }
             }).result.finally(function(){
                 if (previousState.name == "app.aboutus.event") $state.go('app.aboutus.event', {eventId: eventId});
                 else $state.go('app.aboutus.general', {scrollTo:'gallery'});
             })
         }],
        resolve: {
            previousState: ['$state', function($state){
                var currentStateData = {
                            name: $state.current.name,
                            params: $state.params,
                            URL: $state.href($state.current.name, $state.params)
                        };
                return currentStateData;
            }]
        }
        
    })
    
    .state('app.aboutus.detail', {
       url: '/gallery/:eventId/:photoId',
        onEnter: ['previousState', '$state', 'photoInfo', function(previousState, $state, photoInfo){
            console.log('This is previous state:')
            console.log(previousState);
            if (previousState.name != 'app.aboutus.photo' && previousState.name != 'app.aboutus.detail' && previousState.name != 'app.aboutus.general') $state.go('app.aboutus.photo', {
                eventId: photoInfo.eventId,
                photoId: photoInfo.photoId
            }) 
        }],
        resolve: {
            photoInfo: ['galleryFactory', '$stateParams',  function(galleryFactory, $stateParams){
                return {eventId: $stateParams.eventId, photoId: $stateParams.photoId};
            }],
            previousState: ['$state', function($state){
                var currentStateData = {
                            name: $state.current.name,
                            params: $state.params,
                            URL: $state.href($state.current.name, $state.params)
                        };
                return currentStateData;
            }]
        }
    })
    
    .state('app.services', {
        url: 'services',
        params: {
            scrollTo: ''
        },
        views: {
            'header@': {
                templateUrl: 'views/common-header.html'
            },
            'mainContent@': {
                templateUrl: 'views/services-content.html',
                controller: 'servicesController'
            },
        },
        resolve: {
            scrollTo: ['$stateParams', function($stateParams){
               return $stateParams.scrollTo; 
            }]
        }
    })
    
    .state('app.contactus', {
        url: 'contactus',
        //debug
        onEnter: [function(){
            console.log('Entered contactus state');
        }],
        views: {
            'header@': {
                templateUrl: 'views/common-header.html',
            },
            'mainContent@': {
                templateUrl: 'views/contactus-content.html',
                controller: 'contactusController'
            }
        }
    })
    
    .state('app.passtest_initial', {
        url: 'passtest',
        views: {
            'header@': {
                templateUrl: 'views/common-header.html',
            },
           'mainContent@' : {
               templateUrl: 'views/passtest-initial.html',
               controller: 'passTestInitialController'  
           }
        },
        resolve: {
            tests: ['passTestFactory', function(passTestFactory){
                return passTestFactory.getTests();
            }]
        }
    })
    
    .state('app.passtest_test', {
        url: ':alias',
        params: {
            testDetails: null
        },
        views: {
            'header@': {
                templateUrl: 'views/common-header.html',
            },
           'mainContent@' : {
               templateUrl: 'views/passtest-test.html',
               controller: 'passTestTestController'  
           }
        },
        resolve: {
            testDetails: ['$stateParams', function($stateParams, passTestFactory){
                return $stateParams.testDetails;
            }],
            test: ['$stateParams', 'passTestFactory', function($stateParams, passTestFactory){
                var tests = passTestFactory.getTests();
                var test;
                var test_copy = {};
                for (var i = 0; i < tests.length; i++) {
                    if (tests[i].alias == $stateParams.alias) {
                        test =  tests[i];
                    }
                }

                test_copy = JSON.parse(JSON.stringify(test));
                return test_copy;
                
                
            }]
        }
    })
    
    .state('app.passtest_result', {
        url: 'results/',
        params: {
            testDetails: null
        },
        views: {
            'header@': {
                templateUrl: 'views/common-header.html',
            },
            'mainContent@' : {
                templateUrl: 'views/passtest-result.html',
                controller: 'passTestResultController'
            }
        },
        resolve: {
            testDetails: ['$stateParams', function($stateParams){
               return $stateParams.testDetails; 
            }]
        }
    })
    .state('app.passtest_result_saved', {
        url: 'results/:trId',
        views: {
            'header@': {
                templateUrl: 'views/common-header.html',
            },
            'mainContent@' : {
                templateUrl: 'views/passtest-result.html',
                controller: 'passTestResultSavedController',
                resolve: {
                    testDetails: ['$stateParams', 'passTestFactory', function($stateParams, passTestFactory){
                        return passTestFactory.testResultResource.getOneResult({trId: $stateParams.trId}, function(res){
                           console.log('Parsing');
                           console.log(res.questionString);
                           var questionObject = JSON.parse(res.questionString);
                           var questions = questionObject.questions;
                           delete res.questionString;
                           res.questions = questions;
                           console.log('Test result:');
                           res.date = new Date(res.createdAt);
                           console.log(res);
                           return res;
                       }, function(err){
                               console.log(err);
                        }); 
                    }]
                }
            }
        }
    })
    
    
    
   $urlRouterProvider.otherwise('/');
    
}])
.run(function($rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});