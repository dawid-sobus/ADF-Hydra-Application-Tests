/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.19414893617021275, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-1-1"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Dodaj-usługę-2-0"], "isController": false}, {"data": [0.475, 500, 1500, "(POST) Dodaj-usługę-1-0"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-2-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-powiązaną-usługę (do task-0)-1"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Logowanie-0"], "isController": false}, {"data": [0.175, 500, 1500, "(GET) Strona-główna"], "isController": false}, {"data": [0.175, 500, 1500, "(POST) Logowanie-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Logowanie"], "isController": false}, {"data": [0.0, 500, 1500, "Wyświetlanie Zadań (strona główna, serwis)"], "isController": true}, {"data": [0.3, 500, 1500, "(GET) Otwórz-plik-pdf-1 (do task-0)"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Dodaj-klienta"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-dane-klienta-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-dane-klienta"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-powiązaną-usługę (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Główne usługi (czy istnieją zadania)"], "isController": false}, {"data": [0.075, 500, 1500, "(GET) Kalendarz"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "Dawanie, Edytowanie Klientów i Zadań (zakładka klieńci)"], "isController": true}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-2"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Edytuj-usługę (do task-0)"], "isController": false}, {"data": [0.25, 500, 1500, "(DELETE) Edytuj-pliki \"usuń- plik\" [pdf4] (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-usługę (do task-0)-1"], "isController": false}, {"data": [0.425, 500, 1500, "(GET) Klienci"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Edytuj-usługę (do task-0)-0"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Edytuj-dane-klienta-0"], "isController": false}, {"data": [0.225, 500, 1500, "(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-1"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Serwis (czy istnieją zadania)"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Dodaj-usługę"], "isController": false}, {"data": [0.0, 500, 1500, "Logowanie"], "isController": true}, {"data": [0.0, 500, 1500, "(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-0"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Edytuj-dane-klienta"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Dodaj-powiązaną-usługę (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-usługę (do task-0)"], "isController": false}, {"data": [0.225, 500, 1500, "(GET) Kalendarz-Dzień (czy istnieją zadania)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-klienta"], "isController": false}, {"data": [0.35, 500, 1500, "(POST) Dodaj-klienta-0"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Powiązene zadania (czy istnieją zadania)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-klienta-1"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Dodaj-powiązaną-usługę (do task-0)-0"], "isController": false}, {"data": [0.45, 500, 1500, "(GET) Edytuj-pliki (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Wszystkie usługi (czy istnieją zadania)"], "isController": false}, {"data": [0.025, 500, 1500, "(GET) Strona-główna (czy istnieją zadania)"], "isController": false}, {"data": [0.975, 500, 1500, "(GET) Logowanie"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Otwórz-klienta"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 860, 0, 0.0, 1810.6011627906987, 5, 4637, 1636.0, 2958.5, 3162.85, 3947.6499999999996, 14.747239179641952, 1038.1867152132347, 285.61911075005145], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["(POST) Dodaj-usługę-1-1", 20, 0, 0.0, 1893.2999999999997, 1558, 2379, 1699.0, 2371.8, 2378.65, 2379.0, 2.794857462269424, 79.73613707029067, 0.5868108929569592], "isController": false}, {"data": ["(POST) Dodaj-usługę-2-0", 20, 0, 0.0, 1005.0, 907, 1302, 965.5, 1240.5000000000005, 1299.7, 1302.0, 3.457814661134163, 1.121088347164592, 1.941643974757953], "isController": false}, {"data": ["(POST) Dodaj-usługę-1-0", 20, 0, 0.0, 1243.5500000000002, 950, 1564, 1296.0, 1475.0, 1559.6499999999999, 1564.0, 2.918855808523059, 0.9463477816695854, 1.6162023861646233], "isController": false}, {"data": ["(POST) Dodaj-usługę-2-1", 20, 0, 0.0, 1615.2500000000002, 1559, 1709, 1615.0, 1677.9, 1707.5, 1709.0, 3.283533081595797, 132.30970899688063, 0.6894136841241175], "isController": false}, {"data": ["(POST) Dodaj-powiązaną-usługę (do task-0)-1", 20, 0, 0.0, 1647.4499999999996, 1564, 1706, 1657.5, 1702.8, 1705.85, 1706.0, 3.2803017877644747, 171.50372365507624, 0.688735238641955], "isController": false}, {"data": ["(POST) Logowanie-0", 20, 0, 0.0, 968.1, 758, 1396, 910.0, 1185.6000000000001, 1385.7999999999997, 1396.0, 3.3829499323410013, 0.8787741035182679, 0.974580302774019], "isController": false}, {"data": ["(GET) Strona-główna", 20, 0, 0.0, 1597.3999999999999, 1034, 1997, 1558.5, 1957.4, 1995.25, 1997.0, 2.8608210556429694, 0.5028787011872408, 0.5084662423115435], "isController": false}, {"data": ["(POST) Logowanie-1", 20, 0, 0.0, 1697.65, 1258, 2179, 1734.0, 2159.2000000000003, 2178.55, 2179.0, 2.8300551860761285, 137.53957655299277, 0.3565206240271685], "isController": false}, {"data": ["(POST) Logowanie", 20, 0, 0.0, 2665.9999999999995, 2088, 3574, 2686.0, 3340.9000000000005, 3563.35, 3574.0, 2.5294043252813965, 123.58511445554572, 1.0473314784368282], "isController": false}, {"data": ["Wyświetlanie Zadań (strona główna, serwis)", 20, 0, 0.0, 16480.6, 14977, 18265, 16209.5, 18169.600000000002, 18261.35, 18265.0, 0.9429514380009429, 2292.15987446959, 1.0175403701084393], "isController": true}, {"data": ["(GET) Otwórz-plik-pdf-1 (do task-0)", 20, 0, 0.0, 1358.85, 991, 1981, 1167.0, 1880.1000000000004, 1976.95, 1981.0, 2.7129679869777537, 1.7962815382528488, 0.6040592783505154], "isController": false}, {"data": ["(GET) Dodaj-klienta", 20, 0, 0.0, 786.4000000000001, 624, 1105, 703.5, 1064.5000000000002, 1103.4, 1105.0, 3.3467202141900936, 18.393888052208837, 0.46736424866131193], "isController": false}, {"data": ["(POST) Edytuj-dane-klienta-1", 20, 0, 0.0, 2013.95, 1571, 2507, 2176.0, 2369.8, 2500.25, 2507.0, 2.6392187912377936, 44.39570652711797, 0.5541328516759039], "isController": false}, {"data": ["(POST) Edytuj-dane-klienta", 20, 0, 0.0, 3158.7999999999997, 2535, 3760, 3203.0, 3747.5, 3759.6, 3760.0, 2.3446658851113713, 40.20105967907386, 1.4608367526377493], "isController": false}, {"data": ["(POST) Dodaj-powiązaną-usługę (do task-0)", 20, 0, 0.0, 2958.0499999999997, 2838, 3071, 2964.5, 3036.4, 3069.3, 3071.0, 2.706726214643389, 142.39309488767086, 2.170138888888889], "isController": false}, {"data": ["(GET) Główne usługi (czy istnieją zadania)", 20, 0, 0.0, 2679.0999999999995, 2320, 3224, 2637.0, 3102.2000000000003, 3218.2999999999997, 3224.0, 2.2499718753515583, 1301.8811874226574, 0.3361774384070199], "isController": false}, {"data": ["(GET) Kalendarz", 20, 0, 0.0, 2114.749999999999, 1317, 2768, 2256.5, 2394.1, 2749.3999999999996, 2768.0, 2.889338341519792, 14.621632114995666, 0.4119564432245016], "isController": false}, {"data": ["Test", 20, 0, 0.0, 54171.05, 53047, 55337, 54084.0, 55039.3, 55322.7, 55337.0, 0.34233093131129866, 943.9216635839052, 189.7803786608014], "isController": true}, {"data": ["Dawanie, Edytowanie Klientów i Zadań (zakładka klieńci)", 20, 0, 0.0, 34850.049999999996, 34036, 35438, 34876.0, 35433.5, 35437.9, 35438.0, 0.48866301798279904, 135.00377663976985, 270.1142097097342], "isController": true}, {"data": ["(POST) Dodaj-usługę-1", 20, 0, 0.0, 3136.9500000000007, 2565, 3934, 3022.5, 3749.5, 3924.85, 3934.0, 2.370229912301493, 68.39016021272813, 1.8100779213083669], "isController": false}, {"data": ["(POST) Dodaj-usługę-2", 20, 0, 0.0, 2620.1999999999994, 2497, 2980, 2585.0, 2811.6000000000004, 2972.35, 2980.0, 2.7056277056277054, 109.90027225378788, 2.0873494994588744], "isController": false}, {"data": ["(GET) Edytuj-usługę (do task-0)", 20, 0, 0.0, 1312.4499999999998, 1263, 1383, 1301.0, 1377.7, 1382.8, 1383.0, 3.3829499323410013, 14.360358169824087, 0.6640360707036536], "isController": false}, {"data": ["(DELETE) Edytuj-pliki \"usuń- plik\" [pdf4] (do task-0)", 20, 0, 0.0, 1653.95, 1042, 2252, 1501.0, 2227.5, 2250.85, 2252.0, 2.3775558725630055, 0.780135520684736, 648.8832917261055], "isController": false}, {"data": ["(POST) Edytuj-usługę (do task-0)-1", 20, 0, 0.0, 1668.15, 1577, 1827, 1651.5, 1764.2, 1823.8999999999999, 1827.0, 3.17359568390987, 165.96200858854334, 0.66633112503967], "isController": false}, {"data": ["(GET) Klienci", 20, 0, 0.0, 1226.2500000000002, 937, 1526, 1233.5, 1502.0, 1524.8, 1526.0, 3.041825095057034, 88.5278041825095, 0.406962927756654], "isController": false}, {"data": ["(POST) Edytuj-usługę (do task-0)-0", 20, 0, 0.0, 646.2000000000002, 603, 679, 647.0, 668.8, 678.5, 679.0, 3.8358266206367473, 1.2436469121595704, 2.168890247410817], "isController": false}, {"data": ["(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)", 20, 0, 0.0, 3753.5000000000005, 2909, 4637, 3879.0, 4546.400000000001, 4632.75, 4637.0, 2.12630236019562, 25.47669456331065, 581.5864707367638], "isController": false}, {"data": ["(POST) Edytuj-dane-klienta-0", 20, 0, 0.0, 1144.35, 925, 1492, 1018.5, 1445.7, 1489.7, 1492.0, 3.1530821377896894, 1.022288349361501, 1.302493890903358], "isController": false}, {"data": ["(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-1", 20, 0, 0.0, 1752.9500000000003, 1279, 2280, 1667.0, 2267.9, 2279.4, 2280.0, 2.5936973155232783, 30.040916588315394, 0.6382926987420567], "isController": false}, {"data": ["(GET) Serwis (czy istnieją zadania)", 20, 0, 0.0, 2665.15, 2263, 3092, 2661.0, 3075.6, 3091.4, 3092.0, 2.257591150242691, 1974.796772702901, 0.2998363246416074], "isController": false}, {"data": ["(GET) Dodaj-usługę", 20, 0, 0.0, 874.1500000000001, 644, 1110, 920.5, 1091.5, 1109.3, 1110.0, 3.0455306837216387, 13.91605280188823, 0.5204764352063347], "isController": false}, {"data": ["Logowanie", 20, 0, 0.0, 2840.3999999999996, 2152, 3876, 2852.5, 3448.2, 3854.6499999999996, 3876.0, 2.4606299212598426, 123.59619140625, 1.3192244402066928], "isController": true}, {"data": ["(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-0", 20, 0, 0.0, 2001.1, 1595, 2877, 1731.5, 2737.6, 2870.15, 2877.0, 2.4962556165751373, 0.9970395968547179, 682.161815869945], "isController": false}, {"data": ["(GET) Edytuj-dane-klienta", 20, 0, 0.0, 1060.8000000000002, 921, 1472, 995.0, 1454.1000000000001, 1471.65, 1472.0, 3.4007821799013773, 9.880202133990817, 0.5878305135181091], "isController": false}, {"data": ["(GET) Dodaj-powiązaną-usługę (do task-0)", 20, 0, 0.0, 964.3499999999999, 921, 1018, 964.0, 1006.8000000000001, 1017.5, 1018.0, 3.717472118959108, 17.204199581784387, 0.7623722118959108], "isController": false}, {"data": ["(POST) Edytuj-usługę (do task-0)", 20, 0, 0.0, 2314.7000000000003, 2212, 2476, 2287.0, 2419.9, 2473.2, 2476.0, 2.8830906732016723, 151.70490891235403, 2.235521479025515], "isController": false}, {"data": ["(GET) Kalendarz-Dzień (czy istnieją zadania)", 20, 0, 0.0, 1755.1500000000003, 1185, 2321, 1627.5, 2311.7000000000003, 2320.7, 2321.0, 3.4584125886218224, 496.748281601245, 0.5302448988414318], "isController": false}, {"data": ["(POST) Dodaj-klienta", 20, 0, 0.0, 3078.05, 2872, 3736, 2995.0, 3370.2000000000003, 3717.95, 3736.0, 2.4761668936486316, 42.397708191469604, 1.8861427510214188], "isController": false}, {"data": ["(POST) Dodaj-klienta-0", 20, 0, 0.0, 1447.3500000000001, 1254, 2116, 1333.0, 1770.6000000000001, 2099.0499999999997, 2116.0, 3.108003108003108, 1.0076728826728827, 1.8757284382284383], "isController": false}, {"data": ["(GET) Powiązene zadania (czy istnieją zadania)", 20, 0, 0.0, 2931.2000000000007, 2662, 3483, 2881.5, 3160.4, 3467.0, 3483.0, 2.2361359570661894, 83.81950364769678, 0.3887033206618962], "isController": false}, {"data": ["(POST) Dodaj-klienta-1", 20, 0, 0.0, 1630.0, 1575, 1684, 1630.0, 1680.0, 1683.9, 1684.0, 3.355141754739138, 56.35999229365878, 0.5307939104177152], "isController": false}, {"data": ["(POST) Dodaj-powiązaną-usługę (do task-0)-0", 20, 0, 0.0, 1310.45, 1232, 1395, 1316.0, 1344.0, 1392.5, 1395.0, 3.4910106475824754, 1.1318511083958807, 2.065969191831035], "isController": false}, {"data": ["(GET) Edytuj-pliki (do task-0)", 20, 0, 0.0, 1363.75, 1253, 1698, 1350.0, 1505.0000000000002, 1688.6499999999999, 1698.0, 3.1201248049921997, 9.467019305772231, 0.609399375975039], "isController": false}, {"data": ["(GET) Wszystkie usługi (czy istnieją zadania)", 20, 0, 0.0, 2516.4500000000003, 2246, 3388, 2362.0, 3138.7000000000003, 3376.3999999999996, 3388.0, 2.465483234714004, 1591.8787367480277, 0.3683778661242604], "isController": false}, {"data": ["(GET) Strona-główna (czy istnieją zadania)", 20, 0, 0.0, 1818.8000000000002, 1453, 2091, 1851.0, 2083.8, 2090.7, 2091.0, 2.42306760358614, 352.8781499878847, 0.4306624061061304], "isController": false}, {"data": ["(GET) Logowanie", 20, 0, 0.0, 174.39999999999998, 5, 536, 118.0, 434.8000000000002, 531.3499999999999, 536.0, 4.046125834513453, 5.543666548654664, 0.4939118450333806], "isController": false}, {"data": ["(GET) Otwórz-klienta", 20, 0, 0.0, 1631.4499999999998, 1572, 1690, 1622.0, 1687.0, 1689.85, 1690.0, 3.318400530944085, 0.583312593330015, 0.6967344864775178], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 860, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
