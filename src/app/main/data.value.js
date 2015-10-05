(function() {
   angular
       .module('testWork')
       .value('data', [
           // First data set
           [
               {
                   Name: 'Item 1',
                   Percent: 20
               }
           ],
           // Second data set
           [
               {
                   Name: 'Item 1',
                   Percent: 20
               },
               {
                   Name: 'Item 2',
                   Percent: 40
               }
           ],
           // Third data set
           [
               {
                   Name: 'Item 1',
                   Percent: 20
               },
               {
                   Name: 'Item 2',
                   Percent: 40
               },
               {
                   Name: 'Item 3',
                   Percent: 60
               }
           ],
           // Fourth data set
           [
               {
                   Name: 'Item 1',
                   Percent: 20
               },
               {
                   Name: 'Item 2',
                   Percent: 40
               },
               {
                   Name: 'Item 3',
                   Percent: 60
               },
               {
                   Name: 'Item 4',
                   Percent: 0
               }
           ]
       ]);
})();