(function () {
    'use strict';

    angular
        .module('testWork')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController(dataFactory) {
        var vm = this;

        function init() {
            var data = vm.data = dataFactory.getData();
            if (vm.data.length) {
                vm.selectSet(data[data.length - 1]);
            }
        }


        /**
         * Метод выбирает набор данных.
         * @param {Array<Object>} dataSet
         */
        vm.selectSet = function (dataSet) {
            vm.dataSet = dataSet;
            angular.forEach(dataSet, function (elem) {
                dataFactory.format(elem);
            });
            dataFactory.normalize(vm.dataSet);
        };

        /**
         * Метод обрабатывает изменение процентов в моделе.
         * @param {Object} elem
         */
        vm.change = function (elem) {
            dataFactory.format(elem);
            dataFactory.recalculate(vm.dataSet, elem);
            dataFactory.normalize(vm.dataSet, elem);
        };



        init();
    }
})();
