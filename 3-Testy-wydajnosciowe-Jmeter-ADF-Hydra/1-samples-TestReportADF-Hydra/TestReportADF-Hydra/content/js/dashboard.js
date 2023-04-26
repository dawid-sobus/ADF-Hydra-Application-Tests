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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.40425531914893614, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "(POST) Dodaj-usługę-1-1"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Dodaj-usługę-2-0"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Dodaj-usługę-1-0"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Dodaj-usługę-2-1"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Dodaj-powiązaną-usługę (do task-0)-1"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Logowanie-0"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Strona-główna"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Logowanie-1"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Logowanie"], "isController": false}, {"data": [0.0, 500, 1500, "Wyświetlanie Zadań (strona główna, serwis)"], "isController": true}, {"data": [0.5, 500, 1500, "(GET) Otwórz-plik-pdf-1 (do task-0)"], "isController": false}, {"data": [1.0, 500, 1500, "(GET) Dodaj-klienta"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Edytuj-dane-klienta-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-dane-klienta"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-powiązaną-usługę (do task-0)"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Główne usługi (czy istnieją zadania)"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Kalendarz"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "Dawanie, Edytowanie Klientów i Zadań (zakładka klieńci)"], "isController": true}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-2"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Edytuj-usługę (do task-0)"], "isController": false}, {"data": [0.5, 500, 1500, "(DELETE) Edytuj-pliki \"usuń- plik\" [pdf4] (do task-0)"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Edytuj-usługę (do task-0)-1"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Klienci"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Edytuj-usługę (do task-0)-0"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Edytuj-dane-klienta-0"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-1"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Serwis (czy istnieją zadania)"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Dodaj-usługę"], "isController": false}, {"data": [0.5, 500, 1500, "Logowanie"], "isController": true}, {"data": [0.5, 500, 1500, "(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-0"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Edytuj-dane-klienta"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Dodaj-powiązaną-usługę (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-usługę (do task-0)"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Kalendarz-Dzień (czy istnieją zadania)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-klienta"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Dodaj-klienta-0"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Powiązene zadania (czy istnieją zadania)"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Dodaj-klienta-1"], "isController": false}, {"data": [0.5, 500, 1500, "(POST) Dodaj-powiązaną-usługę (do task-0)-0"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Edytuj-pliki (do task-0)"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Wszystkie usługi (czy istnieją zadania)"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Strona-główna (czy istnieją zadania)"], "isController": false}, {"data": [1.0, 500, 1500, "(GET) Logowanie"], "isController": false}, {"data": [0.5, 500, 1500, "(GET) Otwórz-klienta"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 43, 0, 0.0, 1059.255813953488, 95, 2044, 1016.0, 1840.2, 1964.1999999999996, 2044.0, 1.370430570162858, 12.246667045128598, 26.541261314019824], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["(POST) Dodaj-usługę-1-1", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 11.617595897870281, 0.2032535696999032], "isController": false}, {"data": ["(POST) Dodaj-usługę-2-0", 1, 0, 0.0, 806.0, 806, 806, 806.0, 806.0, 806.0, 806.0, 1.2406947890818858, 0.40225651364764264, 0.696679202853598], "isController": false}, {"data": ["(POST) Dodaj-usługę-1-0", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.5323788998357964, 0.9092133620689655], "isController": false}, {"data": ["(POST) Dodaj-usługę-2-1", 1, 0, 0.0, 1035.0, 1035, 1035, 1035.0, 1035.0, 1035.0, 1035.0, 0.966183574879227, 14.937160326086957, 0.20286080917874397], "isController": false}, {"data": ["(POST) Dodaj-powiązaną-usługę (do task-0)-1", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 18.49624457046332, 0.2026649975868726], "isController": false}, {"data": ["(POST) Logowanie-0", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.4605773492907802, 0.5107906693262412], "isController": false}, {"data": ["(GET) Strona-główna", 1, 0, 0.0, 839.0, 839, 839, 839.0, 839.0, 839.0, 839.0, 1.1918951132300357, 0.20951281287246723, 0.21184073301549464], "isController": false}, {"data": ["(POST) Logowanie-1", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 8.463094522664836, 0.1730447287087912], "isController": false}, {"data": ["(POST) Logowanie", 1, 0, 0.0, 1295.0, 1295, 1295, 1295.0, 1295.0, 1295.0, 1295.0, 0.7722007722007722, 4.958222731660232, 0.31973938223938225], "isController": false}, {"data": ["Wyświetlanie Zadań (strona główna, serwis)", 1, 0, 0.0, 8139.0, 8139, 8139, 8139.0, 8139.0, 8139.0, 8139.0, 0.12286521685710776, 19.454219268337635, 0.13258404748740632], "isController": true}, {"data": ["(GET) Otwórz-plik-pdf-1 (do task-0)", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 1.1555137434554974, 0.3885798429319372], "isController": false}, {"data": ["(GET) Dodaj-klienta", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 13.307733050847459, 0.3381318099273608], "isController": false}, {"data": ["(POST) Edytuj-dane-klienta-1", 1, 0, 0.0, 1030.0, 1030, 1030, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 8.307418082524272, 0.20384557038834952], "isController": false}, {"data": ["(POST) Edytuj-dane-klienta", 1, 0, 0.0, 1839.0, 1839, 1839, 1839.0, 1839.0, 1839.0, 1839.0, 0.543773790103317, 4.829178561718325, 0.3387965606307776], "isController": false}, {"data": ["(POST) Dodaj-powiązaną-usługę (do task-0)", 1, 0, 0.0, 1849.0, 1849, 1849, 1849.0, 1849.0, 1849.0, 1849.0, 0.5408328826392645, 10.538847011898323, 0.43361698891292594], "isController": false}, {"data": ["(GET) Główne usługi (czy istnieją zadania)", 1, 0, 0.0, 1219.0, 1219, 1219, 1219.0, 1219.0, 1219.0, 1219.0, 0.8203445447087777, 27.25562705086136, 0.12257101107465135], "isController": false}, {"data": ["(GET) Kalendarz", 1, 0, 0.0, 1108.0, 1108, 1108, 1108.0, 1108.0, 1108.0, 1108.0, 0.9025270758122744, 3.40298539034296, 0.12868061823104693], "isController": false}, {"data": ["Test", 1, 0, 0.0, 31301.0, 31301, 31301, 31301.0, 31301.0, 31301.0, 31301.0, 0.031947861090699976, 9.171032874349063, 17.710658704993453], "isController": true}, {"data": ["Dawanie, Edytowanie Klientów i Zadań (zakładka klieńci)", 1, 0, 0.0, 21772.0, 21772, 21772, 21772.0, 21772.0, 21772.0, 21772.0, 0.04593055300385817, 5.554546837681426, 25.387933756659933], "isController": true}, {"data": ["(POST) Dodaj-usługę-1", 1, 0, 0.0, 1643.0, 1643, 1643, 1643.0, 1643.0, 1643.0, 1643.0, 0.6086427267194157, 7.5016404823493605, 0.4648033323189288], "isController": false}, {"data": ["(POST) Dodaj-usługę-2", 1, 0, 0.0, 1841.0, 1841, 1841, 1841.0, 1841.0, 1841.0, 1841.0, 0.5431830526887561, 8.573698906844106, 0.4190572379141771], "isController": false}, {"data": ["(GET) Edytuj-usługę (do task-0)", 1, 0, 0.0, 1219.0, 1219, 1219, 1219.0, 1219.0, 1219.0, 1219.0, 0.8203445447087777, 3.482458726415094, 0.1610246616078753], "isController": false}, {"data": ["(DELETE) Edytuj-pliki \"usuń- plik\" [pdf4] (do task-0)", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 0.3860294117647059, 321.07306985294116], "isController": false}, {"data": ["(POST) Edytuj-usługę (do task-0)-1", 1, 0, 0.0, 1146.0, 1146, 1146, 1146.0, 1146.0, 1146.0, 1146.0, 0.8726003490401396, 16.73108911431065, 0.18321198734729496], "isController": false}, {"data": ["(GET) Klienci", 1, 0, 0.0, 910.0, 910, 910, 910.0, 910.0, 910.0, 910.0, 1.098901098901099, 4.3226304945054945, 0.1470209478021978], "isController": false}, {"data": ["(POST) Edytuj-usługę (do task-0)-0", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.5376762023217247, 0.9376943407960199], "isController": false}, {"data": ["(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)", 1, 0, 0.0, 2044.0, 2044, 2044, 2044.0, 2044.0, 2044.0, 2044.0, 0.4892367906066536, 2.9100989175636007, 133.812473244863], "isController": false}, {"data": ["(POST) Edytuj-dane-klienta-0", 1, 0, 0.0, 808.0, 808, 808, 808.0, 808.0, 808.0, 808.0, 1.2376237623762376, 0.4012608292079208, 0.5112449721534653], "isController": false}, {"data": ["(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-1", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 6.725852272727273, 0.2982954545454546], "isController": false}, {"data": ["(GET) Serwis (czy istnieją zadania)", 1, 0, 0.0, 1234.0, 1234, 1234, 1234.0, 1234.0, 1234.0, 1234.0, 0.8103727714748784, 41.45721485008104, 0.1076276337115073], "isController": false}, {"data": ["(GET) Dodaj-usługę", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 7.466235191993464, 0.27924581290849676], "isController": false}, {"data": ["Logowanie", 1, 0, 0.0, 1390.0, 1390, 1390, 1390.0, 1390.0, 1390.0, 1390.0, 0.7194244604316546, 5.605047212230216, 0.38570705935251803], "isController": true}, {"data": ["(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-0", 1, 0, 0.0, 1219.0, 1219, 1219, 1219.0, 1219.0, 1219.0, 1219.0, 0.8203445447087777, 0.32765714725184575, 224.172765842904], "isController": false}, {"data": ["(GET) Edytuj-dane-klienta", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 4.754948342880524, 0.28289944762684127], "isController": false}, {"data": ["(GET) Dodaj-powiązaną-usługę (do task-0)", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 5.720555855995055, 0.25349582818294186], "isController": false}, {"data": ["(POST) Edytuj-usługę (do task-0)", 1, 0, 0.0, 1750.0, 1750, 1750, 1750.0, 1750.0, 1750.0, 1750.0, 0.5714285714285715, 11.141741071428571, 0.44308035714285715], "isController": false}, {"data": ["(GET) Kalendarz-Dzień (czy istnieją zadania)", 1, 0, 0.0, 1195.0, 1195, 1195, 1195.0, 1195.0, 1195.0, 1195.0, 0.8368200836820083, 8.552072437238493, 0.12830151673640167], "isController": false}, {"data": ["(POST) Dodaj-klienta", 1, 0, 0.0, 1993.0, 1993, 1993, 1993.0, 1993.0, 1993.0, 1993.0, 0.5017561465127948, 4.4442658680381335, 0.38219706472654286], "isController": false}, {"data": ["(POST) Dodaj-klienta-0", 1, 0, 0.0, 1016.0, 1016, 1016, 1016.0, 1016.0, 1016.0, 1016.0, 0.984251968503937, 0.3191129429133858, 0.5940114419291338], "isController": false}, {"data": ["(GET) Powiązene zadania (czy istnieją zadania)", 1, 0, 0.0, 1546.0, 1546, 1546, 1546.0, 1546.0, 1546.0, 1546.0, 0.646830530401035, 8.250879285252264, 0.11243733829236739], "isController": false}, {"data": ["(POST) Dodaj-klienta-1", 1, 0, 0.0, 976.0, 976, 976, 976.0, 976.0, 976.0, 976.0, 1.0245901639344264, 8.743035988729508, 0.16209336577868852], "isController": false}, {"data": ["(POST) Dodaj-powiązaną-usługę (do task-0)-0", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.39879305043050434, 0.7279174354243543], "isController": false}, {"data": ["(GET) Edytuj-pliki (do task-0)", 1, 0, 0.0, 901.0, 901, 901, 901.0, 901.0, 901.0, 901.0, 1.1098779134295227, 3.3675690205327413, 0.21677302996670367], "isController": false}, {"data": ["(GET) Wszystkie usługi (czy istnieją zadania)", 1, 0, 0.0, 1014.0, 1014, 1014, 1014.0, 1014.0, 1014.0, 1014.0, 0.9861932938856016, 36.99187931459566, 0.14735114644970415], "isController": false}, {"data": ["(GET) Strona-główna (czy istnieją zadania)", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 11.785198967193196, 0.2159591433778858], "isController": false}, {"data": ["(GET) Logowanie", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 14.422286184210526, 1.2849506578947367], "isController": false}, {"data": ["(GET) Otwórz-klienta", 1, 0, 0.0, 1076.0, 1076, 1076, 1076.0, 1076.0, 1076.0, 1076.0, 0.929368029739777, 0.16336547397769516, 0.19513098280669144], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 43, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
