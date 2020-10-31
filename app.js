function chart(newSample) {
    d3.json("samples.json").then((data) => {
        var dataSample = data.samples;
        var filteredSample = dataSample.filter(sampleobj => sampleobj.id == newSample);
        var result = filteredSample[0];
        console.log('result', result);
        var otu_id = result.otu_ids;
        console.log('otu id', otu_id);
        var otu_label = result.otu_labels;
        var sample_val = result.sample_values;

        var yticks = otu_id.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [{
                y: yticks,
                x: sample_val.slice(0, 10).reverse(),
                text: otu_label.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"

            }

        ];

        var layout = {
            title: "Top 10 OTU",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", barData, layout);


        var bubbleData = [{
                y: sample_val,
                x: otu_id,
                text: otu_label,
                mode: "markers",
                marker: {
                    size: sample_val,
                    color: otu_id,
                    colorscale: "Portland",
                }

            }

        ];


        var newLayout = {
            title: "OTU ID",

            margin: {
                l: 110,
                r: 110,
                t: 110,
                b: 40
            }
        };

        // create the bubble plot
        Plotly.newPlot("bubble", bubbleData, newLayout);

        var metaData = data.metadata;
        var filteredMeta = metaData.filter(sampleobj => sampleobj.id == newSample);
        var results = filteredMeta[0];
        var demographics = Object.entries(results);

        var clearThis = d3.select("#sample-metadata");
        clearThis.html('');
        
        d3.select("#sample-metadata").selectAll("p").data(demographics).enter().append("p").text(d => {
            return `${d[0]}: ${d[1]}`
        });


    });

}



function init() {
    // selecting dropdown
    var selector = d3.select("#selDataset");
    //reading in data
    d3.json("samples.json").then((data) => {
    console.log(data);
        var sampleName = data.names;
        sampleName.forEach((x) => {
            selector
                .append("option")
                .text(x)
                .property("value", x)
        });

        var firstSample = sampleName[0];
        chart(firstSample);

    });


}

function optionChanged(newSample) {
    chart(newSample);

}

init();