(function() {
    function coin(id, price, oldPrice, marketCap, oldMarketCap, volume, oldVolume, marketShare, oldMarketShare, change, oldChange) {
    	this.id = id;
        this.price = price;
        this.oldPrice = oldPrice;
        this.marketCap = marketCap;
        this.oldMarketCap = oldMarketCap;
        this.volume = volume;
        this.oldVolume = oldVolume;
        this.marketShare = marketShare;
        this.oldMarketShare = oldMarketShare;
        this.change = change;
        this.oldChange = oldChange;
    }

    var bitcoin = new coin("bitcoin");
    var bitcoinCash = new coin("bitcoin-cash");
    var ethereum = new coin("ethereum");
    var monero = new coin("monero");
    var siacoin = new coin("siacoin");

    var coinList = [bitcoin, bitcoinCash, ethereum, monero, siacoin];

    var totalMarketCap, oldTotalMarketCap;

    var chart;

    $(document).ready(function() {
        myTimer();
        setInterval(function() {
            myTimer();
        }, 60000);
        createChart();
    });

    function myTimer() {

        function runInOrder(callback) {
            getGlobalData(function() {
                getTickerData(function() {
                    updateTable(callback);
                });
            });
        };

        runInOrder();

        function getGlobalData(callback) {
            $.getJSON("https://api.coingecko.com/api/v3/global", function(json) {
				totalMarketCap = fixed(parseFloat(json.data.total_market_cap.usd / 1000000000), 2);
				callback();
			});
        }

        function getTickerData(callback) {
        	$.getJSON('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false', function(json) {
        	    for (var i = 0; i < coinList.length; i++) {
        	    $.each(json, function(index, value) {
        	    	if (value.id == coinList[i].id) {
        	    		coinList[i].marketCap = parseInt(value.market_cap);
        	    		coinList[i].price = fixed(parseFloat(value.current_price), 2);
        	    		coinList[i].volume = parseInt(value['total_volume']);
                        coinList[i].change = fixed(parseFloat(value.price_change_percentage_24h), 2);
                        coinList[i].marketShare = fixed((coinList[i].marketCap * 0.0000001 / totalMarketCap), 2);
        	    	}
        	    });
                }
			callback();
            });	
        }

        function updateTable(callback) {

            // Update total market cap.
            if (!oldTotalMarketCap || oldTotalMarketCap == totalMarketCap) {
                $('#totalMarketCap').text('$' + totalMarketCap + 'B').removeClass();
            } else if (totalMarketCap > oldTotalMarketCap) {
                $('#totalMarketCap').text('$' + totalMarketCap + 'B').removeClass().addClass('green');
            } else {
                $('#totalMarketCap').text('$' + totalMarketCap + 'B').removeClass().addClass('red');
            }
            oldTotalMarketCap = totalMarketCap;

            // Update entries for each coin.
            for (var i = 0; i < coinList.length; i++) {

                if (!coinList[i].oldPrice || coinList[i].oldPrice == coinList[i].price) {
                    $('#' + coinList[i].id + 'Price').text('$' + coinList[i].price.toLocaleString().commafy()).removeClass();
                } else if (coinList[i].price > coinList[i].oldPrice) {
                    $('#' + coinList[i].id + 'Price').text('$' + coinList[i].price.toLocaleString().commafy()).removeClass().addClass('green');
                } else {
                    $('#' + coinList[i].id + 'Price').text('$' + coinList[i].price.toLocaleString().commafy()).removeClass().addClass('red');
                }
                coinList[i].oldPrice = parseFloat(coinList[i].price);

                if (!coinList[i].oldMarketCap || coinList[i].oldMarketCap == coinList[i].marketCap) {
                    $('#' + coinList[i].id + 'MarketCap').text('$' + coinList[i].marketCap.toLocaleString()).removeClass();
                } else if (coinList[i].marketCap > coinList[i].oldMarketCap) {
                    $('#' + coinList[i].id + 'MarketCap').text('$' + coinList[i].marketCap.toLocaleString()).removeClass().addClass('green');
                } else {
                    $('#' + coinList[i].id + 'MarketCap').text('$' + coinList[i].marketCap.toLocaleString()).removeClass().addClass('red');
                }
                coinList[i].oldMarketCap = coinList[i].marketCap;

                if (!coinList[i].oldMarketShare || coinList[i].oldMarketShare == coinList[i].MarketShare) {
                    $('#' + coinList[i].id + 'MarketShare').text(coinList[i].marketShare + '%').removeClass();
                    chart.data.datasets[0].data[i] = fixed(coinList[i].marketShare, 2);
                    chart.update();
                } else if (coinList[i].marketShare > coinList[i].oldMarketShare) {
                    $('#' + coinList[i].id + 'MarketShare').text(coinList[i].marketShare + '%').removeClass().addClass('green');
                    chart.data.datasets[0].data[i] = fixed(coinList[i].marketShare, 2);
                    chart.update();
                } else {
                    $('#' + coinList[i].id + 'MarketShare').text(coinList[i].marketShare + '%').removeClass().addClass('red');
                    chart.data.datasets[0].data[i] = fixed(coinList[i].marketShare, 2);
                    chart.update();
                }
                coinList[i].oldMarketShare = coinList[i].marketShare;

                if (!coinList[i].oldVolume || coinList[i].oldVolume == coinList[i].volume) {
                    $('#' + coinList[i].id + 'Volume').text('$' + coinList[i].volume.toLocaleString().commafy()).removeClass();
                } else if (coinList[i].volume > coinList[i].oldVolume) {
                    $('#' + coinList[i].id + 'Volume').text('$' + coinList[i].volume.toLocaleString().commafy()).removeClass().addClass('green');
                } else {
                    $('#' + coinList[i].id + 'Volume').text('$' + coinList[i].volume.toLocaleString().commafy()).removeClass().addClass('red');

                }
                coinList[i].oldVolume = parseInt(coinList[i].volume);

                if (!coinList[i].oldChange || coinList[i].oldChange == coinList[i].change) {
                    $('#' + coinList[i].id + 'Change').text(coinList[i].change.commafy() + '%').removeClass();
                } else if (parseFloat(coinList[i].change) > parseFloat(coinList[i].oldChange)) {
                    $('#' + coinList[i].id + 'Change').text(coinList[i].change.commafy() + '%').removeClass().addClass('green');
                } else {
                    $('#' + coinList[i].id + 'Change').text(coinList[i].change.commafy() + '%').removeClass().addClass('red');
                }
                coinList[i].oldChange = coinList[i].change;
            }

            chart.data.datasets[0].data[5] = fixed(calculateOthersMarketShare(), 2);
            chart.update();

            updateBrowserTab();

            callback && callback();
        }
    }


    function createChart() {

        $(function() {

            Chart.defaults.global.legend.display = false;
            Chart.defaults.global.animation.duration = 0;
            Chart.defaults.global.defaultFontFamily = "Verdana";

            var ctx = document.getElementById('myChart').getContext('2d');

            chart = new Chart(ctx, {

                // The type of chart we want to create
                type: 'horizontalBar',

                // The data for our dataset
                data: {
                    labels: ["Bitcoin", "Bitcoin Cash", "Ethereum", "Monero", "Siacoin", "Others"],
                    datasets: [{
                        backgroundColor: ['#2196f3', '#f44336', '#9c27b0', '#ffca28', '#439647', '#ffffff'],
                        borderColor: '#000000',
                    }]
                },

                // Configuration options go here
                options: {
                    scales: {
                        yAxes: [{
                            id: 'y-axis-0',
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                fontColor: "white",
                                fontSize: 14,
                                beginAtZero: true,
                            },
                            afterBuildTicks: function(chart) {}
                        }],
                        xAxes: [{
                            id: 'x-axis-0',
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: "white",
                                fontSize: 14,
                                beginAtZero: true,
                            }
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var dataset = data['datasets'][0];
                                var percent = dataset['data'][tooltipItem['index']];
                                return percent + '%';
                            }
                        }
                    }
                }
            });
        });
    }

    /**
     * Rounds decimals.
     * @param {number} num - The number to round...
     * @param {number} scale - How many decimal places?
     */
    function fixed(num, scale) {
        return (+(Math.round(+(num + 'e' + scale)) + 'e' + -scale)).toFixed(scale);
    }

    // Formats string representation of numbers with commas. 
    // E.g. 1000 --> 1,000
    String.prototype.commafy = function() {
        return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
            return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,');
        });
    };

    function updateBrowserTab() {
        document.title = "Crypto Compare | $" + bitcoin.price.toLocaleString().commafy();
    }

    function calculateOthersMarketShare() {
        return 100 - bitcoin.marketShare - bitcoinCash.marketShare - ethereum.marketShare - monero.marketShare - siacoin.marketShare;
    }

})();
