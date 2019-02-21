(function() {

    let isFirstLoad = true;

    class Coin {
        constructor(id) {
            this.id = id;
            this.price = 0;
            this.oldPrice = 0;
            this.marketCap = 0;
            this.oldMarketCap = 0;
            this.volume = 0;
            this.oldVolume = 0;
            this.marketShare = 0;
            this.oldMarketShare = 0;
            this.change = 0;
            this.oldChange = 0;
        }
    }

    const coins = ["bitcoin", "bitcoin-cash", "ethereum", "monero", "siacoin"].map(id => new Coin(id));
    let totalMarketCap, oldTotalMarketCap;
    let chart;

    $(document).ready(() => {
        updateData();
        setInterval(updateData, 60000);
        createChart();
    });

    async function updateData() {
        try {
            await getGlobalData();
            await getTickerData();
            updateTable();
            if (isFirstLoad) isFirstLoad = false;
        } catch (error) {
            console.error("Error updating data:", error);
        }
    }

    async function getGlobalData() {
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/global");
            const json = await response.json();
            if (!isFirstLoad) {
                oldTotalMarketCap = totalMarketCap
            }
            totalMarketCap = fixed(parseFloat(json.data.total_market_cap.usd / 1000000000), 2);
            if (isFirstLoad) {
                oldTotalMarketCap = totalMarketCap
            }
        } catch (error) {
            console.error("Error fetching global data:", error);
        }
    }

    async function getTickerData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
            const data = await response.json();
            coins.forEach(coin => {
                const coinData = data.find(item => item.id === coin.id);
                if (coinData) {
                    if (!isFirstLoad) {
                        coin.oldMarketCap = coin.marketCap;
                        coin.oldPrice = coin.price;
                        coin.oldVolume = coin.volume;
                        coin.oldChange = coin.change;
                        coin.oldMarketShare = coin.marketShare;
                    }
                    coin.marketCap = parseInt(coinData.market_cap);
                    coin.price = fixed(parseFloat(coinData.current_price), 2);
                    coin.volume = parseInt(coinData.total_volume);
                    coin.change = fixed(parseFloat(coinData.price_change_percentage_24h), 2);
                    coin.marketShare = fixed((coin.marketCap * 0.0000001 / totalMarketCap), 2);
                    if (isFirstLoad) {
                        coin.oldMarketCap = coin.marketCap;
                        coin.oldPrice = coin.price;
                        coin.oldVolume = coin.volume;
                        coin.oldChange = coin.change;
                        coin.oldMarketShare = coin.marketShare;
                    }
                }
            });
        } catch (error) {
            console.error("Error fetching ticker data:", error);
        }
    }

    function updateTable() {
        updateTotalMarketCap();
        coins.forEach((coin, i) => {
            updateCoinData(coin, 'Price', coin.price, coin.oldPrice, '$', '');
            updateCoinData(coin, 'MarketCap', coin.marketCap, coin.oldMarketCap, '$', '');
            updateCoinData(coin, 'Volume', coin.volume, coin.oldVolume, '$', '');
            updateCoinData(coin, 'MarketShare', coin.marketShare, coin.oldMarketShare, '', '%');
            updateCoinData(coin, 'Change', coin.change, coin.oldChange, '', '%');
            chart.data.datasets[0].data[i] = fixed(coin.marketShare, 2);
        });
        chart.data.datasets[0].data[5] = fixed(calculateOthersMarketShare(), 2);
        chart.update();
        updateBrowserTab();
    }

    function updateTotalMarketCap() {
        const element = $('#totalMarketCap');
        const newText = `$${totalMarketCap}B`;
        if (element.text() !== newText) {
            element.text(newText).removeClass();
            if (oldTotalMarketCap !== undefined && oldTotalMarketCap !== totalMarketCap) {
                element.addClass(totalMarketCap > oldTotalMarketCap ? 'green' : 'red');
            }
        }
    }

    function updateCoinData(coin, field, newValue, oldValue, prefix = '', suffix = '') {
        const element = $(`#${coin.id}${field}`);
        const newText = `${prefix}${newValue.toLocaleString().commafy()}${suffix}`;
        if (element.text() !== newText) {
            element.text(newText).removeClass();
            if (oldValue !== undefined && oldValue !== newValue) {
                element.addClass(newValue > oldValue ? 'green' : 'red');
            }
        }
    }

    function createChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        Chart.defaults.global.animation.duration = 0;
        Chart.defaults.global.defaultFontFamily = "Verdana";
        chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: ["Bitcoin", "Bitcoin Cash", "Ethereum", "Monero", "Siacoin", "Others"],
                datasets: [{
                    backgroundColor: ['#2196f3', '#f44336', '#9c27b0', '#ffca28', '#439647', '#ffffff'],
                    borderColor: '#000000',
                }]
            },
            options: {
                scales: {
                    yAxes: [{ gridLines: { display: false }, ticks: { fontColor: "white", fontSize: 14, beginAtZero: true } }],
                    xAxes: [{ gridLines: { display: false }, ticks: { fontColor: "white", fontSize: 14, beginAtZero: true } }]
                },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: (tooltipItem, data) => `${data.datasets[0].data[tooltipItem.index]}%`
                    }
                },
                legend: {
                    display: false
                }
            }
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
        return this.replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,'));
    };

    function updateBrowserTab() {
        const bitcoinPrice = coins.find(coin => coin.id === 'bitcoin')?.price;
        if (bitcoinPrice) {
            document.title = `Crypto Compare | $${bitcoinPrice.toLocaleString().commafy()}`;
        }
    }

    function calculateOthersMarketShare() {
        return 100 - coins.reduce((acc, coin) => acc + parseFloat(coin.marketShare), 0);
    }

})();
