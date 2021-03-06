var products = [
	{id : 4, name : 'Pen', cost : 5, units : 20, category : 'stationary'},
	{id : 8, name : 'Pencil', cost : 20, units : 10, category : 'stationary'},
	{id : 2, name : 'Mouse', cost : 100, units : 10, category : 'stationary'},
	{id : 5, name : 'Len', cost : 70, units : 30, category : 'grocery'},
	{id : 6, name : 'Ten', cost : 20, units : 50, category : 'grocery'},
	{id : 3, name : 'Hen', cost : 40, units : 20, category : 'livestock'},
];

/*
sort
filter
all
any
groupBy

min
max
reduce
map
*/

function describe(title, fn){
	console.group(title);
	fn();
	console.groupEnd();
}

describe('Default List', function(){
	console.table(products);
});

describe('Sort', function(){
	describe('Default Sort [products by id]', function(){
		function sort(){
			for(var i=0; i < products.length-1; i++)
				for(var j=i+1; j < products.length; j++)
					if (products[i].id > products[j].id){
						var temp = products[i];
						products[i] = products[j];
						products[j] = temp;
					}
		}
		sort();
		console.table(products);
	});

	function sort(list, comparer){
		var comparerFn = function(){ return 0; };
		if (typeof comparer === 'string'){
			comparerFn = function(item1, item2){
				if (item1[comparer] > item2[comparer]) return 1;
				if (item1[comparer] < item2[comparer]) return -1;
				return 0
			}
		}
		if (typeof comparer === 'function'){
			comparerFn = comparer;
		}
		for(var i=0; i < list.length-1; i++)
			for(var j=i+1; j < list.length; j++)
				if (comparerFn(list[i], list[j]) > 0){
					var temp = list[i];
					list[i] = list[j];
					list[j] = temp;
				}
	}
	describe('Any list by any attribute', function(){
		/*function sort(list, attrName){
			for(var i=0; i < list.length-1; i++)
				for(var j=i+1; j < list.length; j++)
					if (list[i][attrName] > list[j][attrName]){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}*/
		describe('Products by cost', function(){
			sort(products, 'cost');
			console.table(products);
		});

		describe('Products by units', function(){
			sort(products, 'units');
			console.table(products);
		});

	});

	describe('Any list by any comparer', function(){
		/*function sort(list, comparer){
			for(var i=0; i < list.length-1; i++)
				for(var j=i+1; j < list.length; j++)
					if (comparer(list[i], list[j]) > 0){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}*/
		describe('Products by value [cost * units]', function(){
			var productComparerByValue = function(p1, p2){
				var p1Value = p1.cost * p1.units,
					p2Value = p2.cost * p2.units;
				if (p1Value < p2Value) return -1;
				if (p1Value > p2Value) return 1;
				return 0
			};
			sort(products, productComparerByValue);
			console.table(products);
		});

	});
});

describe('Filter', function(){
	function filter(list, criteria){
		var result = [];
		for(var index=0; index < list.length; index++)
			if (criteria(list[index]))
				result.push(list[index]);
		return result;
	}

	function negate(criteria){
		return function(){
			return !criteria.apply(this, arguments);
		}
	}

	describe("Filtering by Cost", function(){
		var isCostly = function(product){
			return product.cost > 50;
		};
		/*var isAffordable = function(product){
			//return product.cost <= 50;
			return !isCostly(product);
		};*/
		var isAffordable = negate(isCostly);

		describe('All costly products [cost > 50]', function(){
			var costlyProducts = filter(products, isCostly);
			console.table(costlyProducts);
		});
		describe('All affordable products [cost <= 50]', function(){
			var affordableProducts = filter(products, isAffordable);
			console.table(affordableProducts);
		});
	});

	describe('Filtering by category', function(){
		var isStationary = function(product){
			return product.category === 'stationary';
		};
		/*var isNonStationary = function(product){
			//return product.category !== 'stationary';
			return !isStationary(product);
		};*/
		var isNonStationary = negate(isStationary);

		describe('All stationary products', function(){
			var stationaryProducts = filter(products, isStationary);
			console.table(stationaryProducts);
		});

		describe('All non stationary products', function(){
			var nonStationaryProducts = filter(products, isNonStationary);
			console.table(nonStationaryProducts);
		});
	});

	describe("Filtering by units", function(){
		var isUnderStocked = function(product){
			return product.units <= 20;
		};
		var isWellStocked = negate(isUnderStocked);

		describe('All under stocked products [ units <= 20 ]', function(){
			var underStockedProducts = filter(products, isUnderStocked);
			console.table(underStockedProducts);
		});

		describe('All well stocked products [!underStockedProducts]', function(){
			var wellStockedProducts = filter(products, isWellStocked);
			console.table(wellStockedProducts);
		});
	});
});

describe('GroupBy', function(){
	function groupBy(list, keySelector){
		var result = {};
		for(var index=0; index < list.length; index++){
			var key = keySelector(list[index]);
			if (typeof result[key] === 'undefined')
				result[key] = [];
			result[key].push(list[index]);
		}
		return result;
	}
	function printGroup(groupedObj){
		for(var key in groupedObj)
			describe('Key - [' + key + ']', function(){
				console.table(groupedObj[key]);
			});
	}
	describe("Products by category", function(){
		var categoryKeySelector = function(product){
			return product.category;
		};
		var productsByCategory = groupBy(products, categoryKeySelector);
		printGroup(productsByCategory);
	});

	describe("Products by cost", function(){
		var costKeySelector = function(product){
			return product.cost > 50 ? 'costly' : 'affordable';
		};
		var productsByCost = groupBy(products, costKeySelector);
		printGroup(productsByCost);
	});
});

function before(count, fn){
	var result = null;
	return function(){
		if (--count >= 0)
			result = fn.apply(this, arguments);
		return result;
    }
}





