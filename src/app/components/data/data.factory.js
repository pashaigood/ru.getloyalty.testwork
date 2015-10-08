(function () {
    angular
        .module('testWork')
        .factory('dataFactory', data);

    /** @ngInject */
    function data($filter) {

        var orderBy = $filter('orderBy');

        return {
            /**
             * Метод возвращает тестовые данные.
             * @returns {*[]}
             */
            getData: function () {
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
            },

            /**
             * Метод нормализует набор данных.
             * При передачи второго параметра, нормализация
             * происходит относительно переданного элемента.
             *
             * @example
             * // В Наборе есть данные проценты: [20, 30, 50, 0]
             * // Пользователь изменил 4 параметр на 90
             * normalize(vm.dataSet, vm.dataSet[2]);
             * // В этом случаи значение 4 параметра останется 90,
             * // а в общем значения будут выглядеть как [10, 0, 0, 90].
             *
             * @param {Array<Object>} dataSet
             * @param {Object} element
             */
            normalize: function (dataSet, element) {
                var self = this,
                    sum = 0,
                    coeff,
                    normalizedPart = element ? 100 - element.Percent : 100;

                // Найдём всё количество процентов.
                angular.forEach(dataSet, function (elem) {
                    if (element !== elem) {
                        sum += elem.Percent;
                    }
                });


                if (normalizedPart === sum) {
                    return;
                }
                // Найдём коэффицент.
                coeff = sum > 0 ? normalizedPart / sum : 0;

                // Приведём общее значение к 100.
                angular.forEach(dataSet, function (elem) {
                    if (element !== elem) {
                        elem.Percent *= coeff;
                    }
                    self.finalizeElement(elem);
                });
            },

            /**
             * Метод финализирует элемент после обработки.
             * @param {Object} elem
             */
            finalizeElement: function (elem) {
                elem.Percent = Math.round(elem.Percent * 100) / 100;
                elem._Percent = elem.Percent;
            },

            /**
             * Метод формтаирует проценты элемента, преобразует для работы.
             * @param {Object} elem
             */
            format: function (elem) {
                if (angular.isString(elem.Percent)) {
                    elem.Percent = elem.Percent.replace(',', '.');
                    elem.Percent = parseFloat(elem.Percent);
                }
            },

            /**
             * Метод перерасчитывает текущий набор данных,
             * так чтобы их значение не привышало 100.
             * @param {Array<Object>} dataSet
             * @param {Object} elem
             */
            recalculate: function (dataSet, elem) {
                elem.Percent = elem.Percent > 0 ? elem.Percent : 0;
                elem.Percent = elem.Percent < 100 ? elem.Percent : 100;

                var value = elem.Percent,
                    oldValue = elem._Percent,
                    changedElement,
                    order = [];

                // Если значение уменьшилось,
                if (value < oldValue) {

                    // то это количество передается первому элементу,
                    // с наименьшим количеством.
                    order = orderBy(dataSet, ['Percent', 'Name']);

                }
                else
                // Если значение увеличилось,
                if (value > oldValue) {
                    // то это количество компенсируется первым
                    // элементом с наибольшим количеством.
                    order = orderBy(dataSet, ['-Percent', 'Name']);
                }
                else {
                    return;
                }


                var cnt = order.length;
                while ((cnt -= 1) > -1) {

                    while ((changedElement = order.shift()) === elem) {
                        // Убедимся, что элемент не являеться сам сабой.
                    }

                    if (changedElement) {
                        var newValue = changedElement.Percent + (oldValue - value);

                        // Если значение получиться меньше нуля,
                        // То отнимаем только то, что до нуля.
                        // Перём следующий элемент из сортировки и проделываем тоже самое с ним.

                        if (newValue < 0) {
                            // Найдём количество процентов,
                            // которые ещё не компенсировали.
                            // И компенсируем его у следующего элемента.
                            oldValue = value + newValue;
                            changedElement.Percent = 0;
                            this.finalizeElement(changedElement);
                            continue;

                        }
                        else if (newValue > 100) {
                            changedElement.Percent = 100;
                        }
                        else {
                            changedElement.Percent = newValue;
                        }

                        this.finalizeElement(changedElement);
                        this.finalizeElement(elem);
                        break;

                    }

                }

            }


        };
    }
})();