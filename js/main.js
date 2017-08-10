String.prototype.commafy = function() {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,');
    });
};

// because Number.prototype.toFixed() doesn't behave as expected...
function fixed(num, scale) {
    return (+(Math.round(+(num + 'e' + scale)) + 'e' + -scale)).toFixed(scale);
}

(function() {

    var apiLinkTicker = 'https://api.coinmarketcap.com/v1/ticker/?limit=10';
    var totalCap;
    var totalCapTemp;
    var bitcoinPriceTemp;
    var bccPriceTemp;
    var bitcoinMarketCap;
    var bccMarketCap;
    var bitcoinMarketCapTemp;
    var bccMarketCapTemp;
    var bitcoinMarketShareTemp;
    var bccMarketShareTemp;
    var bitcoinMarketShare;
    var bccMarketShare;
    var bitcoinVolTemp;
    var bccVolTemp;
    var bitcoinChangeTemp;
    var bccChangeTemp;
    var bitcoinTxTemp;
    var chart;
    var myVar = setInterval(myTimer, 60000);

    $(document).ready(function() {
        myTimer();
    });

    function myTimer() {

        function getTotalCap(callback) {
            $.getJSON('https://api.coinmarketcap.com/v1/global/', function(json) {
                totalCap = fixed(parseFloat(json.total_market_cap_usd / 1000000000), 2);
                if (!totalCapTemp || totalCapTemp == totalCap) {
                    $('#totalCap').text('$' + totalCap + 'B').removeClass();
                } else if (totalCap > totalCapTemp) {
                    setTimeout(function() {
                        $('#totalCap').text('$' + totalCap + 'B').removeClass().addClass('green');
                    }, 1);
                    getBitcoinShare();
                    getBccShare();
                } else {
                    setTimeout(function() {
                        $('#totalCap').text('$' + totalCap + 'B').removeClass().addClass('red');
                    }, 1);
                    getBitcoinShare();
                    getBccShare();
                }
                totalCapTemp = totalCap;
                callback();
            });
        }

        $.getJSON(apiLinkTicker, function(json) {
            $.each(json, function(index, value) {
                if (value.id == 'bitcoin') {
                    var bitcoinPrice = fixed(parseFloat(value.price_usd), 2);
                    if (!bitcoinPriceTemp || bitcoinPriceTemp == bitcoinPrice) {
                        $('#bitcoinPrice').text('$' + bitcoinPrice.toLocaleString().commafy()).removeClass();
                    } else if (bitcoinPrice > bitcoinPriceTemp) {
                        setTimeout(function() {
                            $('#bitcoinPrice').text('$' + bitcoinPrice.toLocaleString().commafy()).removeClass().addClass('green');
                        }, 1);
                    } else {
                        setTimeout(function() {
                            $('#bitcoinPrice').text('$' + bitcoinPrice.toLocaleString().commafy()).removeClass().addClass('red');
                        }, 1);
                    }
                    bitcoinPriceTemp = parseFloat(bitcoinPrice);
                }
            });
        });

        $.getJSON(apiLinkTicker, function(json) {
            $.each(json, function(index, value) {
                if (value.id == 'bitcoin-cash') {
                    var bccPrice = fixed(parseFloat(value.price_usd), 2);
                    if (!bccPriceTemp || bccPriceTemp == bccPrice) {
                        $('#bccPrice').text('$' + bccPrice.toLocaleString().commafy()).removeClass();
                    } else if (bccPrice > bccPriceTemp) {
                        setTimeout(function() {
                            $('#bccPrice').text('$' + bccPrice.toLocaleString().commafy()).removeClass().addClass('green');
                        }, 1);
                    } else {
                        setTimeout(function() {
                            $('#bccPrice').text('$' + bccPrice.toLocaleString().commafy()).removeClass().addClass('red');
                        }, 1);
                    }
                    bccPriceTemp = parseFloat(bccPrice);
                }
            });
        });

        $.getJSON(apiLinkTicker, function(json) {
            $.each(json, function(index, value) {
                if (value.id == 'bitcoin') {
                    var bitcoinVol = parseInt(value['24h_volume_usd']);
                    if (!bitcoinVolTemp || bitcoinVolTemp == bitcoinVol) {
                        $('#bitcoinVol').text('$' + bitcoinVol.toLocaleString().commafy()).removeClass();
                    } else if (bitcoinVol > bitcoinVolTemp) {
                        setTimeout(function() {
                            $('#bitcoinVol').text('$' + bitcoinVol.toLocaleString().commafy()).removeClass().addClass('green');
                        }, 1);
                    } else {
                        setTimeout(function() {
                            $('#bitcoinVol').text('$' + bitcoinVol.toLocaleString().commafy()).removeClass().addClass('red');
                        }, 1);
                    }
                    bitcoinVolTemp = parseInt(bitcoinVol);
                }
            });
        });

        $.getJSON(apiLinkTicker, function(json) {
            $.each(json, function(index, value) {
                if (value.id == 'bitcoin-cash') {
                    var bccVol = parseInt(value['24h_volume_usd']);
                    if (!bccVolTemp || bccVolTemp == bccVol) {
                        $('#bccVol').text('$' + bccVol.toLocaleString().commafy()).removeClass();
                    } else if (bccVol > bccVolTemp) {
                        setTimeout(function() {
                            $('#bccVol').text('$' + bccVol.toLocaleString().commafy()).removeClass().addClass('green');
                        }, 1);
                    } else {
                        setTimeout(function() {
                            $('#bccVol').text('$' + bccVol.toLocaleString().commafy()).removeClass().addClass('red');
                        }, 1);
                    }
                    bccVolTemp = parseInt(bccVol);
                }
            });
        });

        $.getJSON(apiLinkTicker, function(json) {
            $.each(json, function(index, value) {
                if (value.id == 'bitcoin') {
                    var bitcoinChange = fixed(parseFloat(value.percent_change_24h), 2);
                    if (!bitcoinChangeTemp || bitcoinChangeTemp == bitcoinChange) {
                        $('#bitcoinChange').text(bitcoinChange.commafy() + '%').removeClass();
                    } else if (parseFloat(bitcoinChange) > parseFloat(bitcoinChangeTemp)) {
                        setTimeout(function() {
                            $('#bitcoinChange').text(bitcoinChange.commafy() + '%').removeClass().addClass('green');
                        }, 1);
                    } else {
                        setTimeout(function() {
                            $('#bitcoinChange').text(bitcoinChange.commafy() + '%').removeClass().addClass('red');
                        }, 1);
                    }
                    bitcoinChangeTemp = bitcoinChange;
                }
            });
        });

        $.getJSON(apiLinkTicker, function(json) {
            $.each(json, function(index, value) {
                if (value.id == 'bitcoin-cash') {
                    var bccChange = fixed(parseFloat(value.percent_change_24h), 2);
                    if (!bccChangeTemp || bccChangeTemp == bccChange) {
                        $('#bccChange').text(bccChange.commafy() + '%').removeClass();
                    } else if (parseFloat(bccChange) > parseFloat(bccChangeTemp)) {
                        setTimeout(function() {
                            $('#bccChange').text(bccChange.commafy() + '%').removeClass().addClass('green');
                        }, 1);
                    } else {
                        setTimeout(function() {
                            $('#bccChange').text(bccChange.commafy() + '%').removeClass().addClass('red');
                        }, 1);
                    }
                    bccChangeTemp = bccChange;
                }
            });
        });

        $.getJSON('https://api.blockchain.info/stats?cors=true', function(json) {
            var bitcoinTx = json.n_tx.toLocaleString();
            if (!bitcoinTxTemp || bitcoinTxTemp == bitcoinTx) {
                $('#bitcoinTx').text(bitcoinTx).removeClass();
            } else if (parseInt(bitcoinTx) > parseInt(bitcoinTxTemp)) {
                setTimeout(function() {
                    $('#bitcoinTx').text(bitcoinTx).removeClass().addClass('green');
                }, 1);
            } else {
                setTimeout(function() {
                    $('#bitcoinTx').text(bitcoinTx).removeClass().addClass('red');
                }, 1);
            }
            bitcoinTxTemp = bitcoinTx;
        });

        function getBitcoinMarketCap(callback) {
            $.getJSON(apiLinkTicker, function(json) {
                $.each(json, function(index, value) {
                    if (value.id == 'bitcoin') {
                        bitcoinMarketCap = parseInt(value.market_cap_usd);
                        if (!bitcoinMarketCapTemp) {
                            $('#bitcoinMarketCap').text('$' + bitcoinMarketCap.toLocaleString()).removeClass();
                            getBitcoinShare();
                        } else if (bitcoinMarketCapTemp == bitcoinMarketCap) {
                            $('#bitcoinMarketCap').text('$' + bitcoinMarketCap.toLocaleString()).removeClass();
                        } else if (bitcoinMarketCap > bitcoinMarketCapTemp) {
                            setTimeout(function() {
                                $('#bitcoinMarketCap').text('$' + bitcoinMarketCap.toLocaleString()).removeClass().addClass('green');
                            }, 1);
                            getBitcoinShare();
                        } else {
                            setTimeout(function() {
                                $('#bitcoinMarketCap').text('$' + bitcoinMarketCap.toLocaleString()).removeClass().addClass('red');
                            }, 1);
                            getBitcoinShare();
                        }
                        bitcoinMarketCapTemp = bitcoinMarketCap;
                        callback();
                    }
                });
            });
        }

        function getBccMarketCap(callback) {
            $.getJSON(apiLinkTicker, function(json) {
                $.each(json, function(index, value) {
                    if (value.id == 'bitcoin-cash') {
                        bccMarketCap = parseInt(value.market_cap_usd);
                        if (!bccMarketCapTemp) {
                            $('#bccMarketCap').text('$' + bccMarketCap.toLocaleString()).removeClass();
                            getBccShare();
                        } else if (bccMarketCapTemp == bccMarketCap) {
                            $('#bccMarketCap').text('$' + bccMarketCap.toLocaleString()).removeClass();
                        } else if (bccMarketCap > bccMarketCapTemp) {
                            setTimeout(function() {
                                $('#bccMarketCap').text('$' + bccMarketCap.toLocaleString()).removeClass().addClass('green');
                            }, 1);
                            getBccShare();
                        } else {
                            setTimeout(function() {
                                $('#bccMarketCap').text('$' + bccMarketCap.toLocaleString()).removeClass().addClass('red');
                            }, 1);
                            getBccShare();
                        }
                        bccMarketCapTemp = bccMarketCap;
                        callback();
                    }
                });
            });
        }

        function getBitcoinShare(callback) {
            bitcoinMarketShare = fixed((bitcoinMarketCap * 0.0000001 / totalCap), 2);
            if (!bitcoinMarketShareTemp || bitcoinMarketShareTemp == bitcoinMarketShare) {
                $('#bitcoinMarketShare').text(bitcoinMarketShare + '%').removeClass();
            } else if (bitcoinMarketShare > bitcoinMarketShareTemp) {
                $('#bitcoinMarketShare').text(bitcoinMarketShare + '%').removeClass().addClass('green');
                chart.update();
            } else {
                $('#bitcoinMarketShare').text(bitcoinMarketShare + '%').removeClass().addClass('red');
                chart.update();
            }
            bitcoinMarketShareTemp = bitcoinMarketShare;
            callback && callback();
        }

        function getBccShare(callback) {
            bccMarketShare = fixed((bccMarketCap * 0.0000001 / totalCap), 2);
            if (!bccMarketShareTemp || bccMarketShareTemp == bccMarketShare) {
                $('#bccMarketShare').text(bccMarketShare + '%').removeClass();
            } else if (bccMarketShare > bccMarketShareTemp) {
                $('#bccMarketShare').text(bccMarketShare + '%').removeClass().addClass('green');
                chart.update();
            } else {
                $('#bccMarketShare').text(bccMarketShare + '%').removeClass().addClass('red');
                chart.update();
            }
            bccMarketShareTemp = bccMarketShare;
            callback && callback();
        }

        function runInOrder(callback) {
            getTotalCap(function() {
                getBitcoinMarketCap(function() {
                    getBccMarketCap(function() {
                        getBitcoinShare(function() {
                            getBccShare(callback);
                        });
                    });
                });
            });
        }

        runInOrder(createChart);
    }



    function createChart() {
        $(function() {
            Chart.defaults.global.legend.display = false;
            Chart.defaults.global.animation.duration = 0;
            var ctx = document.getElementById('myChart').getContext('2d');
            $('#myChart').css('background-color', '#222428');

            chart = new Chart(ctx, {

                // The type of chart we want to create
                type: 'doughnut',

                // The data for our dataset
                data: {
                    labels: ["Bitcoin", "Bitcoin Cash", "Others"],
                    datasets: [{
                        label: "dataset",
                        backgroundColor: ['#2196f3', '#f44336', '#FFFFFF'],
                        borderColor: '#000000',
                        data: [bitcoinMarketShare, bccMarketShare, fixed(100 - bccMarketShare - bitcoinMarketShare, 2)],
                    }]
                },

                // Configuration options go here
                options: {
                    cutoutPercentage: 70,
                    rotation: 185
                }
            });
        });
    }



})();