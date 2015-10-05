(function () {
    'use strict';

    describe('controller', function () {
        var vm,
            dataSet,
            orderBy,
            $scope;

        // Свои проверки проверки.
        beforeEach(function () {
            jasmine.addMatchers({

                toBe100Percent: function() {
                    return {
                        compare: function (actual) {

                            // Сумма всех процетов должны быть равна 100.
                            var cnt = actual.length,
                                percents = 0;
                            while (--cnt > -1) {
                                percents += actual[cnt].Percent;
                            }

                            return {
                                pass: Math.round(percents) === 100,
                                message: Math.round(percents) != 100 ? 'Expect sum to be 100, but now is ' + percents : ''
                            };
                        }
                    }
                }
            });
        });
        beforeEach(module('testWork'));
        beforeEach(inject(function ($rootScope, _$controller_, _$filter_) {
            $scope = $rootScope.$new();
            vm = _$controller_('MainController', {
                $scope: $scope
            });

            orderBy = _$filter_('orderBy');

            // Для тестов, выберем последний набор данных.
            dataSet = vm.data[vm.data.length - 1];

        }));

        it('should have data', function () {
            // Проверим, что данные существуют.
            expect(vm.data).toEqual(jasmine.any(Array));
            expect(vm.data.length).toBeGreaterThan(3);
        });

        it('dataSet should be normalized', function () {

            expect(vm.selectSet).toEqual(jasmine.any(Function));
            vm.selectSet(dataSet);
            expect(vm.dataSet).toEqual(dataSet);
            // Сумма всех процетов должны быть равна 100.
            expect(vm.dataSet).toBe100Percent()
        });

        it('dataSet should be less then 100 when it changed', function () {
            vm.selectSet(dataSet);


            var appedValue = 10,
            // Уменьшим максимальное значение
                orderByPercent = orderBy(vm.dataSet, ['-Percent', 'Name']),
                higher = orderByPercent.shift(),
                lower = orderByPercent.pop(),
                currentValue = lower.Percent;

            higher.Percent -= appedValue;
            vm.change(higher);
            // Ожидаем, что минимальное увеличилось пропорционально изменению.
            expect(lower.Percent).toBe(currentValue + appedValue);
            // Сумма всех процентов должна быть 100.
            expect(vm.dataSet).toBe100Percent();

            // Увеличим минимальное.
            appedValue = 20;
            orderByPercent = orderBy(vm.dataSet, ['-Percent', 'Name']);
            higher = orderByPercent.shift();
            lower = orderByPercent.pop();
            currentValue = higher.Percent;

            console.log(higher.Percent);
            console.log(lower.Percent);
            lower.Percent += appedValue;
            vm.change(lower);
            // Ожидаем, что максимальное уменьшиться пропорционально.
            expect(higher.Percent).toBe(currentValue - appedValue);
            // Сумма всех процентов должна быть 100.
            expect(vm.dataSet).toBe100Percent();
        });

    });
})();
