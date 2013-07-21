/*  demo test by Antonis Karamitros
    19 July 2013  */

//  my DEMO module
var DEMO = (function($,ko){
    "use strict";
    
    //  our knockout model
    var DemoModel = function(){
        
        var self = this,
            words = {},
            ourSort = getSortByField('word');
        
        self.text = ko.observable('');  //  text input
        
        self.results = ko.observableArray([]);
        
        self.processText = ko.computed(function(){
            
            var wordsArray = self.text().split(/\W+/);
            self.results.removeAll();
            words = {};
            
            $.map(wordsArray, function(ele,i){
                
                ele = ele.toLowerCase();    //  we normalize to lower case all the words
                if(!ele) return false;      //  ignore empty words
                
                if(words[ele] !== undefined){
                    words[ele] += 1;
                } else {
                    words[ele] = 1;
                }
            });
            
            $.map(words, function(ele,i){
                self.results.push({
                    word: i,
                    appearances: words[i]
                });
            });
            
            //  sort the results alphabetically
            self.results.sort(ourSort);
            
        });
        
        self.hasResults = ko.computed(function(){
            //  return true if we have at least 1 result
            return (self.results().length > 0);
        });
        
        self.clearText = function(){
            //  clear the text
            self.text('');
        };
        
        self.sortByWord = function(){
            
            ourSort = getSortByField('word',!ourSort.inv);
            self.results.sort(ourSort);
        };
        
        self.sortByAppearances = function(){
            
            ourSort = getSortByField('appearances',!ourSort.inv);
            self.results.sort(ourSort);
            
        };
    };
    
    //  our function to sort the results however we want
    function getSortByField(field,inv){
        
        if(field === undefined) return function(){};
        
        var sortFn = function(a,b){
            
            if(inv===true){
                if(a[field] < b[field]) return 1;
                if(a[field] > b[field]) return -1;
            }
            if(a[field] < b[field]) return -1;
            if(a[field] > b[field]) return 1;
            return 0;
        };
        
        sortFn.field = field;
        sortFn.inv = !!inv;
        
        return sortFn;
    }
    
    
    //  show stuff on load
    function onLoad(){

        var $startBtn = $('#startBtn'),
            $descriptionContainer = $('#descriptionContainer');
        
        //  on load, show description
        $descriptionContainer.fadeIn(2000,function(){
            $startBtn.delay(500).fadeIn(500);
        });
        
        //  do initialization stuff

        //  apply knockout bindings with our model
        ko.applyBindings(new DemoModel());

        $startBtn.on('click',function(){
            
            //  do animation and start app
            hideDescription(start);
        });

        $('#goBackBtn').on('click',function(){

            $('#demoApp').fadeOut(400,function(){
                $startBtn.show();
                $descriptionContainer.fadeIn(400);
            });
        });
    }
    
    //  hide description
    function hideDescription(onComplete){
        
        $('#startBtn').fadeOut(500,function(){
            $('#descriptionContainer').fadeOut(500,function(){
              
              if(typeof onComplete === 'function'){
                onComplete();
              }
            });
        });
    }
    
    //  when the app starts
    function start(){
        
        $('#demoApp').fadeIn(1000);
        
        $('#sidebar').tooltip({
            title: 'Click on header to sort',
            placement: 'top',
            delay: {
                show: 100,
                hide: 1000
            }
        });
    }
  
    //    expose our demo interface
    return {
        onLoad: onLoad
    };
  
}(jQuery,ko));


//  when DOM ready...
$(function(){
    "use strict";
  
    DEMO.onLoad();
});
