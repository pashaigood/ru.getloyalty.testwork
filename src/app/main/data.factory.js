(function() {
   angular
       .module('testWork')
       .factory('data', data);

        /** @ngInject */
        function data() {
            return [
                // First data set
                [
                    {
                        Name: 'Item 1',
                        Percent: '20,4'
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
                        Percent: 30
                    },
                    {
                        Name: 'Item 3',
                        Percent: 50
                    }
                ],
                // Fourth data set
                [
                    {
                        Name: 'Item 1',
                        Percent: '20,67'
                    },
                    {
                        Name: 'Item 2',
                        Percent: '40.45'
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
            ];
        }
})();