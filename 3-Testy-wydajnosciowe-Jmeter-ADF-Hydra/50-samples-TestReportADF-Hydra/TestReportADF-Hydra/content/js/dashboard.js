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

    var data = {"OkPercent": 99.71014492753623, "KoPercent": 0.2898550724637681};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.013404825737265416, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-1-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-2-0"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-1-0"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-2-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-powiązaną-usługę (do task-0)-1"], "isController": false}, {"data": [0.02, 500, 1500, "(POST) Logowanie-0"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Strona-główna"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Logowanie-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Logowanie"], "isController": false}, {"data": [0.0, 500, 1500, "Wyświetlanie Zadań (strona główna, serwis)"], "isController": true}, {"data": [0.0, 500, 1500, "(GET) Otwórz-plik-pdf-1 (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Dodaj-klienta"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-dane-klienta-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-dane-klienta"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-powiązaną-usługę (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Główne usługi (czy istnieją zadania)"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Kalendarz"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "Dawanie, Edytowanie Klientów i Zadań (zakładka klieńci)"], "isController": true}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-usługę-2"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Edytuj-usługę (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(DELETE) Edytuj-pliki \"usuń- plik\" [pdf4] (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-usługę (do task-0)-1"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Klienci"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-usługę (do task-0)-0"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-dane-klienta-0"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-1"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Serwis (czy istnieją zadania)"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Dodaj-usługę"], "isController": false}, {"data": [0.0, 500, 1500, "Logowanie"], "isController": true}, {"data": [0.0, 500, 1500, "(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-0"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Edytuj-dane-klienta"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Dodaj-powiązaną-usługę (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Edytuj-usługę (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Kalendarz-Dzień (czy istnieją zadania)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-klienta"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-klienta-0"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Powiązene zadania (czy istnieją zadania)"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-klienta-1"], "isController": false}, {"data": [0.0, 500, 1500, "(POST) Dodaj-powiązaną-usługę (do task-0)-0"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Edytuj-pliki (do task-0)"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Wszystkie usługi (czy istnieją zadania)"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Strona-główna (czy istnieją zadania)"], "isController": false}, {"data": [0.58, 500, 1500, "(GET) Logowanie"], "isController": false}, {"data": [0.0, 500, 1500, "(GET) Otwórz-klienta"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2070, 6, 0.2898550724637681, 5221.942028985508, 3, 28963, 4081.5, 8571.5, 11551.499999999998, 23579.51, 11.406781248794573, 3101.929148846441, 229.39407975310104], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["(POST) Dodaj-usługę-1-1", 50, 0, 0.0, 4161.5599999999995, 3962, 4480, 4184.5, 4285.2, 4342.1, 4480.0, 4.692632566870014, 563.2905986039418, 0.9878358165180667], "isController": false}, {"data": ["(POST) Dodaj-usługę-2-0", 50, 0, 0.0, 2508.700000000001, 2364, 2849, 2512.0, 2599.9, 2617.35, 2849.0, 5.546311702717693, 1.7982182473655017, 3.1143840127565166], "isController": false}, {"data": ["(POST) Dodaj-usługę-1-0", 50, 0, 0.0, 2406.96, 2320, 2490, 2393.0, 2476.2, 2484.8, 2490.0, 5.641430666817105, 1.8290575990071083, 3.1237218633645494], "isController": false}, {"data": ["(POST) Dodaj-usługę-2-1", 50, 0, 0.0, 4306.22, 3982, 4598, 4311.5, 4475.8, 4565.4, 4598.0, 4.517936206740761, 803.1293414543237, 0.9510608678955453], "isController": false}, {"data": ["(POST) Dodaj-powiązaną-usługę (do task-0)-1", 50, 0, 0.0, 4721.52, 3994, 5492, 5125.0, 5350.5, 5438.2, 5492.0, 4.144905910635829, 976.6003870305893, 0.8725350762662687], "isController": false}, {"data": ["(POST) Logowanie-0", 50, 0, 0.0, 4795.159999999999, 1198, 6909, 5432.0, 6702.7, 6795.899999999999, 6909.0, 4.4033465433729635, 1.1438380669308674, 1.2685422170849845], "isController": false}, {"data": ["(GET) Strona-główna", 50, 0, 0.0, 4382.719999999999, 3665, 8149, 4205.0, 4441.3, 7432.7499999999945, 8149.0, 3.1977487848554618, 51.620596599993604, 0.5613548062164236], "isController": false}, {"data": ["(POST) Logowanie-1", 50, 3, 6.0, 5082.4, 1952, 8668, 4367.5, 8228.2, 8288.75, 8668.0, 3.5914380117799167, 898.9981711724249, 0.45243701515586837], "isController": false}, {"data": ["(POST) Logowanie", 50, 3, 6.0, 9878.320000000002, 3756, 11557, 10361.0, 11355.099999999999, 11538.2, 11557.0, 3.298370604921169, 826.4952055091035, 1.3657315786001714], "isController": false}, {"data": ["Wyświetlanie Zadań (strona główna, serwis)", 34, 0, 0.0, 85146.70588235292, 83225, 87461, 84920.5, 86818.0, 87335.75, 87461.0, 0.36631615238751936, 3934.6678782651966, 0.3956500630279262], "isController": true}, {"data": ["(GET) Otwórz-plik-pdf-1 (do task-0)", 50, 0, 0.0, 2432.3, 2378, 2525, 2427.5, 2471.0, 2492.45, 2525.0, 4.6455449224194005, 3.0709592469571683, 1.0294600134720804], "isController": false}, {"data": ["(GET) Dodaj-klienta", 50, 0, 0.0, 1697.6800000000005, 1573, 2482, 1634.5, 1830.2, 2351.649999999999, 2482.0, 5.6637970095151795, 31.128759345265067, 0.7909404026959674], "isController": false}, {"data": ["(POST) Edytuj-dane-klienta-1", 50, 0, 0.0, 4089.0800000000004, 3990, 4176, 4084.0, 4140.7, 4156.55, 4176.0, 4.751045229950589, 297.2784676691372, 1.000132138445458], "isController": false}, {"data": ["(POST) Edytuj-dane-klienta", 50, 0, 0.0, 6536.5599999999995, 6417, 6646, 6545.5, 6607.8, 6624.65, 6646.0, 3.86458494357706, 243.06457962977274, 2.409931017158757], "isController": false}, {"data": ["(POST) Dodaj-powiązaną-usługę (do task-0)", 50, 0, 0.0, 7988.960000000001, 7178, 8743, 8317.0, 8572.4, 8651.45, 8743.0, 3.219160442956477, 759.5249424575071, 2.5827475131985578], "isController": false}, {"data": ["(GET) Główne usługi (czy istnieją zadania)", 34, 0, 0.0, 20608.794117647063, 15037, 27778, 20388.5, 23522.5, 26789.5, 27778.0, 0.7503696674096798, 1985.6364210677318, 0.1121157803844541], "isController": false}, {"data": ["(GET) Kalendarz", 34, 0, 0.0, 8225.85294117647, 6223, 10014, 8418.5, 9793.0, 9932.25, 10014.0, 1.6615354542344718, 13.209531379807457, 0.2368986096857743], "isController": false}, {"data": ["Test", 34, 3, 8.823529411764707, 176766.4411764706, 175445, 178311, 176838.0, 177662.5, 177949.5, 178311.0, 0.18732679158792515, 2298.3789248664607, 103.85020476815555], "isController": true}, {"data": ["Dawanie, Edytowanie Klientów i Zadań (zakładka klieńci)", 50, 0, 0.0, 80965.04, 79445, 85099, 80916.0, 81774.3, 84084.15, 85099.0, 0.5411841108345059, 580.6861749445286, 299.14805782552224], "isController": true}, {"data": ["(POST) Dodaj-usługę-1", 50, 0, 0.0, 6569.080000000001, 6424, 6905, 6566.5, 6711.9, 6767.75, 6905.0, 3.804885472947264, 457.96151477246786, 2.907764820028917], "isController": false}, {"data": ["(POST) Dodaj-usługę-2", 50, 0, 0.0, 6814.88, 6549, 7055, 6829.0, 6957.9, 7040.55, 7055.0, 3.7177485314893297, 662.0896244609264, 2.870218045951372], "isController": false}, {"data": ["(GET) Edytuj-usługę (do task-0)", 50, 0, 0.0, 3408.539999999999, 3156, 3751, 3365.5, 3673.4, 3734.45, 3751.0, 4.475073838718339, 18.995989215072047, 0.878408048420299], "isController": false}, {"data": ["(DELETE) Edytuj-pliki \"usuń- plik\" [pdf4] (do task-0)", 50, 0, 0.0, 2976.2400000000002, 2489, 3516, 3204.0, 3352.8, 3418.2, 3516.0, 4.556639023056594, 1.4951471794404447, 1243.6294270596009], "isController": false}, {"data": ["(POST) Edytuj-usługę (do task-0)-1", 50, 0, 0.0, 4774.620000000001, 3956, 5723, 5128.5, 5452.1, 5589.35, 5723.0, 3.746721618583739, 882.8262574934432, 0.7887141719745222], "isController": false}, {"data": ["(GET) Klienci", 50, 0, 0.0, 2682.3000000000006, 2387, 3400, 2561.0, 3288.3, 3367.15, 3400.0, 5.004504053648284, 448.7178108735362, 0.6695479056150536], "isController": false}, {"data": ["(POST) Edytuj-usługę (do task-0)-0", 50, 0, 0.0, 1644.6799999999998, 1564, 1948, 1609.5, 1777.7, 1880.2999999999997, 1948.0, 5.265374894692502, 1.7071332666385846, 2.977199281276327], "isController": false}, {"data": ["(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)", 50, 0, 0.0, 7434.019999999999, 7208, 7934, 7344.5, 7852.8, 7888.15, 7934.0, 3.0850866909360155, 138.9403739510705, 843.8253194992903], "isController": false}, {"data": ["(POST) Edytuj-dane-klienta-0", 50, 0, 0.0, 2447.04, 2352, 2579, 2442.0, 2505.9, 2524.45, 2579.0, 5.649717514124294, 1.831744350282486, 2.3338188559322033], "isController": false}, {"data": ["(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-1", 50, 0, 0.0, 3249.8800000000006, 3182, 3419, 3247.5, 3279.7, 3344.3999999999996, 3419.0, 4.257130693912303, 190.02434546615584, 1.047653256704981], "isController": false}, {"data": ["(GET) Serwis (czy istnieją zadania)", 50, 0, 0.0, 20606.319999999996, 11662, 28963, 21046.0, 27211.0, 28319.6, 28963.0, 1.2757054651222126, 4831.166361560443, 0.16942963208654385], "isController": false}, {"data": ["(GET) Dodaj-usługę", 50, 0, 0.0, 1628.94, 1516, 1976, 1624.0, 1665.7, 1704.6, 1976.0, 6.268806419257774, 28.644282456745234, 1.0713292220411235], "isController": false}, {"data": ["Logowanie", 50, 3, 6.0, 10702.28, 3759, 12048, 11230.5, 11755.9, 12018.35, 12048.0, 3.2579657262005606, 820.8344744697661, 1.7467023278165115], "isController": true}, {"data": ["(POST) Edytuj-pliki \"dodaj-pliki\" (do task-0)-0", 50, 0, 0.0, 4184.1799999999985, 3981, 4653, 4091.0, 4483.5, 4616.05, 4653.0, 3.852673755586377, 1.538812076205887, 1052.8257255066267], "isController": false}, {"data": ["(GET) Edytuj-dane-klienta", 50, 0, 0.0, 2487.3400000000006, 2419, 2592, 2468.0, 2557.3, 2574.25, 2592.0, 5.605381165919282, 16.28516500840807, 0.9688988929372198], "isController": false}, {"data": ["(GET) Dodaj-powiązaną-usługę (do task-0)", 50, 0, 0.0, 2594.3599999999997, 2378, 3029, 2532.0, 2850.3, 2877.7, 3029.0, 5.397819281010472, 24.98072809834827, 1.1069746572384758], "isController": false}, {"data": ["(POST) Edytuj-usługę (do task-0)", 50, 0, 0.0, 6419.499999999999, 5582, 7301, 6721.0, 7055.6, 7213.05, 7301.0, 3.335779571685903, 787.0790141937421, 2.5883564614050303], "isController": false}, {"data": ["(GET) Kalendarz-Dzień (czy istnieją zadania)", 34, 0, 0.0, 6321.9411764705865, 4624, 12946, 5115.5, 11900.5, 12845.5, 12946.0, 1.8771048418263125, 1187.7215906738254, 0.2877983009440733], "isController": false}, {"data": ["(POST) Dodaj-klienta", 50, 0, 0.0, 7339.320000000001, 7198, 7487, 7339.0, 7436.2, 7469.6, 7487.0, 3.630291149350178, 228.24349497204676, 2.7652608364190807], "isController": false}, {"data": ["(POST) Dodaj-klienta-0", 50, 0, 0.0, 3256.9000000000005, 3190, 3425, 3248.5, 3333.0, 3384.6, 3425.0, 5.201289919900136, 1.6863557162176221, 3.13905973681473], "isController": false}, {"data": ["(GET) Powiązene zadania (czy istnieją zadania)", 34, 0, 0.0, 11964.000000000002, 8004, 24058, 10459.0, 20069.5, 22432.0, 24058.0, 0.8825667116602637, 134.21024373604766, 0.15341491667531928], "isController": false}, {"data": ["(POST) Dodaj-klienta-1", 50, 0, 0.0, 4082.8199999999997, 3986, 4246, 4075.5, 4161.9, 4175.5, 4246.0, 4.803535402055913, 300.4502563887021, 0.7599343116533769], "isController": false}, {"data": ["(POST) Dodaj-powiązaną-usługę (do task-0)-0", 50, 0, 0.0, 3267.2200000000003, 3119, 3707, 3213.5, 3542.7, 3683.7, 3707.0, 4.960809604127394, 1.6083874888381784, 2.9357916211925783], "isController": false}, {"data": ["(GET) Edytuj-pliki (do task-0)", 50, 0, 0.0, 3453.86, 3157, 3830, 3428.5, 3716.1, 3772.6, 3830.0, 4.094668741298829, 12.423960721890099, 0.7997399885349276], "isController": false}, {"data": ["(GET) Wszystkie usługi (czy istnieją zadania)", 34, 0, 0.0, 9683.441176470591, 7680, 12498, 9586.0, 11785.0, 12348.75, 12498.0, 1.3047816409547932, 3666.2937005909894, 0.19495272565047203], "isController": false}, {"data": ["(GET) Strona-główna (czy istnieją zadania)", 50, 0, 0.0, 6309.08, 4938, 7596, 6463.0, 7414.4, 7508.5, 7596.0, 3.27075292732387, 2306.746413414993, 0.5845193219729181], "isController": false}, {"data": ["(GET) Logowanie", 50, 0, 0.0, 823.9600000000002, 3, 1755, 851.5, 1561.8999999999999, 1641.85, 1755.0, 7.908889591901298, 10.836105563903828, 0.9654406240113887], "isController": false}, {"data": ["(GET) Otwórz-klienta", 50, 0, 0.0, 4118.439999999999, 3984, 4205, 4121.0, 4173.9, 4184.0, 4205.0, 4.776005349125991, 0.8421440682013565, 1.0053864385328113], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 6, 100.0, 0.2898550724637681], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2070, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["(POST) Logowanie-1", 50, 3, "404/Not Found", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["(POST) Logowanie", 50, 3, "404/Not Found", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
