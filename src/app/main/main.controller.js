(function () {
    'use strict';

    angular
        .module('testWork')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController(data) {
        var vm = this;

        vm.data = data;
        vm.dataSet = false;

        /**
         * Метод выбирает набор данных.
         */
        vm.selectSet = function (dataSet) {
            vm.dataSet = dataSet;
            vm.normalize(vm.dataSet);
        };

        /**
         * Метод нормализует набор данных.
         */
        vm.normalize = function (dataSet) {
            var sum = 0,
                coeff;

            // Найдём всё количество процентов.
            angular.forEach(dataSet, function(elem) {
                sum += parseFloat(elem.Percent);
            });

            // Найдём коэффицент.
            coeff = 100 / sum;

            // Приведём общее значение к 100.
            angular.forEach(dataSet, function(elem) {
                elem.Percent *= coeff;
            });
        };
    }
})();
