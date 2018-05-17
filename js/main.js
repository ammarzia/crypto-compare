(function() {
    function coin(price, oldPrice, marketCap, oldMarketCap, volume, oldVolume, marketShare, oldMarketShare, change, oldChange) {
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

    var bitcoin = new coin();
    var bitcoinCash = new coin();
    var ethereum = new coin();
    var monero = new coin();
    var siacoin = new coin();

    var totalCap, totalCapTemp;

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
            $.getJSON('https://api.coinmarketcap.com/v1/global/', function(json) {
                totalCap = fixed(parseFloat(json.total_market_cap_usd / 1000000000), 2);
                callback();
            });
        }

        function getTickerData(callback) {
            $.getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=250', function(json) {
                $.each(json, function(index, value) {
                    if (value.id == 'bitcoin') {
                        bitcoin.marketCap = parseInt(value.market_cap_usd);
                        bitcoin.price = fixed(parseFloat(value.price_usd), 2);
                        bitcoin.volume = parseInt(value['24h_volume_usd']);
                        bitcoin.change = fixed(parseFloat(value.percent_change_24h), 2);
                        bitcoin.marketShare = fixed((bitcoin.marketCap * 0.0000001 / totalCap), 2);
                    }
                    if (value.id == 'bitcoin-cash') {
                        bitcoinCash.marketCap = parseInt(value.market_cap_usd);
                        bitcoinCash.price = fixed(parseFloat(value.price_usd), 2);
                        bitcoinCash.volume = parseInt(value['24h_volume_usd']);
                        bitcoinCash.change = fixed(parseFloat(value.percent_change_24h), 2);
                        bitcoinCash.marketShare = fixed((bitcoinCash.marketCap * 0.0000001 / totalCap), 2);
                    }
                    if (value.id == 'ethereum') {
                        ethereum.marketCap = parseInt(value.market_cap_usd);
                        ethereum.price = fixed(parseFloat(value.price_usd), 2);
                        ethereum.volume = parseInt(value['24h_volume_usd']);
                        ethereum.change = fixed(parseFloat(value.percent_change_24h), 2);
                        ethereum.marketShare = fixed((ethereum.marketCap * 0.0000001 / totalCap), 2);
                    }
                    if (value.id == 'monero') {
                        monero.marketCap = parseInt(value.market_cap_usd);
                        monero.price = fixed(parseFloat(value.price_usd), 2);
                        monero.volume = parseInt(value['24h_volume_usd']);
                        monero.change = fixed(parseFloat(value.percent_change_24h), 2);
                        monero.marketShare = fixed((monero.marketCap * 0.0000001 / totalCap), 2);
                    }
                    if (value.id == 'siacoin') {
                        siacoin.marketCap = parseInt(value.market_cap_usd);
                        siacoin.price = fixed(parseFloat(value.price_usd), 2);
                        siacoin.volume = parseInt(value['24h_volume_usd']);
                        siacoin.change = fixed(parseFloat(value.percent_change_24h), 2);
                        siacoin.marketShare = fixed((siacoin.marketCap * 0.0000001 / totalCap), 2);
                    }
                });
                callback();
            });
        }

        function updateTable(callback) {

            // Global
            if (!totalCapTemp || totalCapTemp == totalCap) {
                $('#totalCap').text('$' + totalCap + 'B').removeClass();
            } else if (totalCap > totalCapTemp) {
                $('#totalCap').text('$' + totalCap + 'B').removeClass().addClass('green');
            } else {
                $('#totalCap').text('$' + totalCap + 'B').removeClass().addClass('red');
            }
            totalCapTemp = totalCap;


            // Bitcoin
            if (!bitcoin.oldPrice || bitcoin.oldPrice == bitcoin.price) {
                $('#bitcoinPrice').text('$' + bitcoin.price.toLocaleString().commafy()).removeClass();
            } else if (bitcoin.price > bitcoin.oldPrice) {
                $('#bitcoinPrice').text('$' + bitcoin.price.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#bitcoinPrice').text('$' + bitcoin.price.toLocaleString().commafy()).removeClass().addClass('red');
            }
            bitcoin.oldPrice = parseFloat(bitcoin.price);

            if (!bitcoin.oldMarketCap) {
                $('#bitcoinMarketCap').text('$' + bitcoin.marketCap.toLocaleString()).removeClass();
            } else if (bitcoin.oldMarketCap == bitcoin.marketCap) {
                $('#bitcoinMarketCap').text('$' + bitcoin.marketCap.toLocaleString()).removeClass();
            } else if (bitcoin.marketCap > bitcoin.oldMarketCap) {
                $('#bitcoinMarketCap').text('$' + bitcoin.marketCap.toLocaleString()).removeClass().addClass('green');
            } else {
                $('#bitcoinMarketCap').text('$' + bitcoin.marketCap.toLocaleString()).removeClass().addClass('red');
            }
            bitcoin.oldMarketCap = bitcoin.marketCap;

            if (!bitcoin.oldMarketShare || bitcoin.oldMarketShare == bitcoin.MarketShare) {
                $('#bitcoinMarketShare').text(bitcoin.marketShare + '%').removeClass();
                chart.data.datasets[0].data[0] = fixed(bitcoin.marketShare, 2);
                chart.update();
            } else if (bitcoin.marketShare > bitcoin.oldMarketShare) {
                $('#bitcoinMarketShare').text(bitcoin.marketShare + '%').removeClass().addClass('green');
                chart.data.datasets[0].data[0] = fixed(bitcoin.marketShare, 2);
                chart.update();
            } else {
                $('#bitcoinMarketShare').text(bitcoin.marketShare + '%').removeClass().addClass('red');
                chart.data.datasets[0].data[0] = fixed(bitcoin.marketShare, 2);
                chart.update();
            }
            bitcoin.oldMarketShare = bitcoin.marketShare;

            if (!bitcoin.oldVolume || bitcoin.oldVolume == bitcoin.volume) {
                $('#bitcoinVol').text('$' + bitcoin.volume.toLocaleString().commafy()).removeClass();
            } else if (bitcoin.volume > bitcoin.oldVolume) {
                $('#bitcoinVol').text('$' + bitcoin.volume.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#bitcoinVol').text('$' + bitcoin.volume.toLocaleString().commafy()).removeClass().addClass('red');

            }
            bitcoin.oldVolume = parseInt(bitcoin.volume);

            if (!bitcoin.oldChange || bitcoin.oldChange == bitcoin.change) {
                $('#bitcoinChange').text(bitcoin.change.commafy() + '%').removeClass();
            } else if (parseFloat(bitcoin.change) > parseFloat(bitcoin.oldChange)) {
                $('#bitcoinChange').text(bitcoin.change.commafy() + '%').removeClass().addClass('green');
            } else {
                $('#bitcoinChange').text(bitcoin.change.commafy() + '%').removeClass().addClass('red');
            }
            bitcoin.oldChange = bitcoin.change;


            // Bitcoin Cash
            if (!bitcoinCash.oldPrice || bitcoinCash.oldPrice == bitcoinCash.price) {
                $('#bitcoinCashPrice').text('$' + bitcoinCash.price.toLocaleString().commafy()).removeClass();
            } else if (bitcoinCash.price > bitcoinCash.oldPrice) {
                $('#bitcoinCashPrice').text('$' + bitcoinCash.price.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#bitcoinCashPrice').text('$' + bitcoinCash.price.toLocaleString().commafy()).removeClass().addClass('red');
            }
            bitcoinCash.oldPrice = parseFloat(bitcoinCash.price);

            if (!bitcoinCash.oldMarketCap) {
                $('#bitcoinCashMarketCap').text('$' + bitcoinCash.marketCap.toLocaleString()).removeClass();
            } else if (bitcoinCash.oldMarketCap == bitcoinCash.marketCap) {
                $('#bitcoinCashMarketCap').text('$' + bitcoinCash.marketCap.toLocaleString()).removeClass();
            } else if (bitcoinCash.marketCap > bitcoinCash.oldMarketCap) {
                $('#bitcoinCashMarketCap').text('$' + bitcoinCash.marketCap.toLocaleString()).removeClass().addClass('green');
            } else {
                $('#bitcoinCashMarketCap').text('$' + bitcoinCash.marketCap.toLocaleString()).removeClass().addClass('red');
            }
            bitcoinCash.oldMarketCap = bitcoinCashMarketCap;

            if (!bitcoinCash.oldMarketShare || bitcoinCash.oldMarketShare == bitcoinCash.marketShare) {
                $('#bitcoinCashMarketShare').text(bitcoinCash.marketShare + '%').removeClass();
                chart.data.datasets[0].data[1] = fixed(bitcoinCash.marketShare, 2);
                chart.update();
            } else if (bitcoinCash.marketShare > bitcoinCash.oldMarketShare) {
                $('#bitcoinCashMarketShare').text(bitcoinCash.marketShare + '%').removeClass().addClass('green');
                chart.data.datasets[0].data[1] = fixed(bitcoinCash.marketShare, 2);
                chart.update();
            } else {
                $('#bitcoinCashMarketShare').text(bitcoinCash.marketShare + '%').removeClass().addClass('red');
                chart.data.datasets[0].data[1] = fixed(bitcoinCash.marketShare, 2);
                chart.update();
            }
            bitcoinCash.oldMarketShare = bitcoinCash.marketShare;

            if (!bitcoinCash.oldVolume || bitcoinCash.oldVolume == bitcoinCash.volume) {
                $('#bitcoinCashVol').text('$' + bitcoinCash.volume.toLocaleString().commafy()).removeClass();
            } else if (bitcoinCash.volume > bitcoinCash.oldVolume) {
                $('#bitcoinCashVol').text('$' + bitcoinCash.volume.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#bitcoinCashVol').text('$' + bitcoinCash.volume.toLocaleString().commafy()).removeClass().addClass('red');
            }
            bitcoinCash.oldVolume = parseInt(bitcoinCash.volume);

            if (!bitcoinCash.oldChange || bitcoinCash.oldChange == bitcoinCashChange) {
                $('#bitcoinCashChange').text(bitcoinCash.change.commafy() + '%').removeClass();
            } else if (parseFloat(bitcoinCash.change) > parseFloat(bitcoinCash.oldChange)) {
                $('#bitcoinCashChange').text(bitcoinCash.change.commafy() + '%').removeClass().addClass('green');
            } else {
                $('#bitcoinCashChange').text(bitcoinCash.change.commafy() + '%').removeClass().addClass('red');
            }
            bitcoinCash.oldChange = bitcoinCashChange;


            // Ethereum
            if (!ethereum.oldPrice || ethereum.oldPrice == ethereum.price) {
                $('#ethereumPrice').text('$' + ethereum.price.toLocaleString().commafy()).removeClass();
            } else if (ethereum.price > ethereum.oldPrice) {
                $('#ethereumPrice').text('$' + ethereum.price.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#ethereumPrice').text('$' + ethereum.price.toLocaleString().commafy()).removeClass().addClass('red');
            }
            ethereum.oldPrice = parseFloat(ethereum.price);

            if (!ethereum.oldMarketCap) {
                $('#ethereumMarketCap').text('$' + ethereum.marketCap.toLocaleString()).removeClass();
            } else if (ethereum.oldMarketCap == ethereum.marketCap) {
                $('#ethereumMarketCap').text('$' + ethereum.marketCap.toLocaleString()).removeClass();
            } else if (ethereum.marketCap > ethereum.oldMarketCap) {
                $('#ethereumMarketCap').text('$' + ethereum.marketCap.toLocaleString()).removeClass().addClass('green');
            } else {
                $('#ethereumMarketCap').text('$' + ethereum.marketCap.toLocaleString()).removeClass().addClass('red');
            }
            ethereum.oldMarketCap = ethereum.marketCap;

            if (!ethereum.oldMarketShare || ethereum.oldMarketShare == ethereum.marketShare) {
                $('#ethereumMarketShare').text(ethereum.marketShare + '%').removeClass();
                chart.data.datasets[0].data[2] = fixed(ethereum.marketShare, 2);
                chart.update();
            } else if (ethereum.marketShare > ethereum.oldMarketShare) {
                $('#ethereumMarketShare').text(ethereum.marketShare + '%').removeClass().addClass('green');
                chart.data.datasets[0].data[2] = fixed(ethereum.marketShare, 2);
                chart.update();
            } else {
                $('#ethereumMarketShare').text(ethereum.marketShare + '%').removeClass().addClass('red');
                chart.data.datasets[0].data[2] = fixed(ethereum.marketShare, 2);
                chart.update();
            }
            ethereum.oldMarketShare = ethereum.marketShare;

            if (!ethereum.oldVolume || ethereum.oldVolume == ethereum.volume) {
                $('#ethereumVol').text('$' + ethereum.volume.toLocaleString().commafy()).removeClass();
            } else if (ethereum.volume > ethereum.oldVolume) {
                $('#ethereumVol').text('$' + ethereum.volume.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#ethereumVol').text('$' + ethereum.volume.toLocaleString().commafy()).removeClass().addClass('red');

            }
            ethereum.oldVolume = parseInt(ethereum.volume);

            if (!ethereum.oldChange || ethereum.oldChange == ethereum.change) {
                $('#ethereumChange').text(ethereum.change.commafy() + '%').removeClass();
            } else if (parseFloat(ethereum.change) > parseFloat(ethereum.oldChange)) {
                $('#ethereumChange').text(ethereum.change.commafy() + '%').removeClass().addClass('green');
            } else {
                $('#ethereumChange').text(ethereum.change.commafy() + '%').removeClass().addClass('red');
            }
            ethereum.oldChange = ethereum.change;


            // Monero
            if (!monero.oldPrice || monero.oldPrice == monero.price) {
                $('#moneroPrice').text('$' + monero.price.toLocaleString().commafy()).removeClass();
            } else if (monero.price > monero.oldPrice) {
                $('#moneroPrice').text('$' + monero.price.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#moneroPrice').text('$' + monero.price.toLocaleString().commafy()).removeClass().addClass('red');
            }
            monero.oldPrice = parseFloat(moneroPrice);

            if (!monero.oldMarketCap) {
                $('#moneroMarketCap').text('$' + monero.marketCap.toLocaleString()).removeClass();
            } else if (monero.oldMarketCap == moneroMarketCap) {
                $('#moneroMarketCap').text('$' + monero.marketCap.toLocaleString()).removeClass();
            } else if (monero.marketCap > monero.oldMarketCap) {
                $('#moneroMarketCap').text('$' + monero.marketCap.toLocaleString()).removeClass().addClass('green');
            } else {
                $('#moneroMarketCap').text('$' + monero.marketCap.toLocaleString()).removeClass().addClass('red');
            }
            monero.oldMarketCap = monero.marketCap;

            if (!monero.oldMarketShare || monero.oldMarketShare == moneroMarketShare) {
                $('#moneroMarketShare').text(monero.marketShare + '%').removeClass();
                chart.data.datasets[0].data[3] = fixed(monero.marketShare, 2);
                chart.update();
            } else if (monero.marketShare > monero.oldMarketShare) {
                $('#moneroMarketShare').text(monero.marketShare + '%').removeClass().addClass('green');
                chart.data.datasets[0].data[3] = fixed(monero.marketShare, 2);
                chart.update();
            } else {
                $('#moneroMarketShare').text(monero.marketShare + '%').removeClass().addClass('red');
                chart.data.datasets[0].data[3] = fixed(monero.marketShare, 2);
                chart.update();
            }
            monero.oldMarketShare = monero.marketShare;

            if (!monero.oldVolume || monero.oldVolume == moneroVol) {
                $('#moneroVol').text('$' + monero.volume.toLocaleString().commafy()).removeClass();
            } else if (monero.volume > monero.oldVolume) {
                $('#moneroVol').text('$' + monero.volume.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#moneroVol').text('$' + monero.volume.toLocaleString().commafy()).removeClass().addClass('red');
            }
            monero.oldVolume = parseInt(monero.volume);

            if (!monero.oldChange || monero.oldChange == monero.change) {
                $('#moneroChange').text(monero.change.commafy() + '%').removeClass();
            } else if (parseFloat(monero.change) > parseFloat(monero.oldChange)) {
                $('#moneroChange').text(monero.change.commafy() + '%').removeClass().addClass('green');
            } else {
                $('#moneroChange').text(monero.change.commafy() + '%').removeClass().addClass('red');
            }
            monero.oldChange = moneroChange;


            // Siacoin
            if (!siacoin.oldPrice || siacoin.oldPrice == siacoinPrice) {
                $('#siacoinPrice').text('$' + siacoin.price.toLocaleString().commafy()).removeClass();
            } else if (siacoin.price > siacoin.oldPrice) {
                $('#siacoinPrice').text('$' + siacoin.price.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#siacoinPrice').text('$' + siacoin.price.toLocaleString().commafy()).removeClass().addClass('red');

            }
            siacoin.oldPrice = parseFloat(siacoin.price);

            if (!siacoin.oldMarketCap) {
                $('#siacoinMarketCap').text('$' + siacoin.marketCap.toLocaleString()).removeClass();
            } else if (siacoin.oldMarketCap == siacoin.marketCap) {
                $('#siacoinMarketCap').text('$' + siacoin.marketCap.toLocaleString()).removeClass();
            } else if (siacoin.marketCap > siacoin.oldMarketCap) {
                $('#siacoinMarketCap').text('$' + siacoin.marketCap.toLocaleString()).removeClass().addClass('green');
            } else {
                $('#siacoinMarketCap').text('$' + siacoin.marketCap.toLocaleString()).removeClass().addClass('red');
            }
            siacoin.oldMarketCap = siacoin.marketCap;

            if (!siacoin.oldMarketShare || siacoin.oldMarketShare == siacoin.marketShare) {
                $('#siacoinMarketShare').text(siacoin.marketShare + '%').removeClass();
                chart.data.datasets[0].data[4] = fixed(siacoin.marketShare, 2);
                chart.update();
            } else if (siacoin.marketShare > siacoin.oldMarketShare) {
                $('#siacoinMarketShare').text(siacoin.marketShare + '%').removeClass().addClass('green');
                chart.data.datasets[0].data[4] = fixed(siacoin.marketShare, 2);
                chart.update();
            } else {
                $('#siacoinMarketShare').text(siacoin.marketShare + '%').removeClass().addClass('red');
                chart.data.datasets[0].data[4] = fixed(siacoin.marketShare, 2);
                chart.update();
            }
            siacoin.oldMarketShare = siacoin.marketShare;

            if (!siacoin.oldVolume || siacoin.oldVolume == siacoin.volume) {
                $('#siacoinVol').text('$' + siacoin.volume.toLocaleString().commafy()).removeClass();
            } else if (siacoin.volume > siacoin.oldVolume) {
                $('#siacoinVol').text('$' + siacoin.volume.toLocaleString().commafy()).removeClass().addClass('green');
            } else {
                $('#siacoinVol').text('$' + siacoin.volume.toLocaleString().commafy()).removeClass().addClass('red');
            }
            siacoin.oldVolume = parseInt(siacoin.volume);

            if (!siacoin.oldChange || siacoin.oldChange == siacoin.change) {
                $('#siacoinChange').text(siacoin.change.commafy() + '%').removeClass();
            } else if (parseFloat(siacoin.change) > parseFloat(siacoin.oldChange)) {
                $('#siacoinChange').text(siacoin.change.commafy() + '%').removeClass().addClass('green');
            } else {
                $('#siacoinChange').text(siacoin.change.commafy() + '%').removeClass().addClass('red');
            }
            siacoin.oldChange = siacoin.change;

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

    // Formats numbers with commas. 
    // E.g. $1000 --> $1,000
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