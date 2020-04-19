const url = '../data/samples.json';
d3.json(url, function(data) {console.log(data);});

function sampleSelection() {
    var selector = d3.select('#selDataset');

    d3.json(url, function(returned_json) {
        var sampleNames = returned_json.names;
        sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    })}
sampleSelection()


function buildBarchart(id){
    d3.json(url, function(returned_json){
        var samplesData = returned_json.samples.filter(sampleID => {
            return sampleID.id == id
        });
        var sample_values = samplesData[0].sample_values.slice(0,10).reverse()
        var otu_ids = samplesData[0].otu_ids.slice(0,10).map(otuIds => {return 'OTU' + otuIds;}).reverse()
        var otu_labels = samplesData[0].otu_labels.slice(0,10).reverse()

        var trace1 = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            marker: {
                color: 'darkblue',
              },
            name: "Top 10 Units",
            type: 'bar',
            orientation:'h'
        }
        var data = [trace1];
        var layout = { title: "Top 10 Units"}
        Plotly.newPlot('bar',data,layout)
    });
}            

function buildBublechart(id){
    d3.json(url, function(returned_json){
        var samplesData = returned_json.samples.filter(sampleID => {
            return sampleID.id == id
        });
        var sample_values = samplesData[0].sample_values;
        var otu_ids = samplesData[0].otu_ids;
        var otu_labels = samplesData[0].otu_labels

        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            }
        };
        var data = [trace2];
        var layout = {
            showlegend: false 
        };
        Plotly.newPlot('bubble',data,layout)
    });
} 

function buildInfotable(id){
    d3.json(url, function(returned_json){
        var sampleMetadata = returned_json.metadata.filter(sampleID => {
            return sampleID.id == id
        });
        d3.select('#sample-metadata').html('');
        Object.entries(sampleMetadata[0]).forEach(([key,value])=>
            d3.select('#sample-metadata').append('p').text(`${key}: ${value}`)
            );
    });
}


function buildGauge(id){
    d3.json(url, function(returned_json){
        var sampleMetadata = returned_json.metadata.filter(sampleID => {
            return sampleID.id == id
        });
        var sampleWfreq=sampleMetadata[0].wfreq
 
        var data = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: sampleWfreq,
            title: { text: "Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10],tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    { range: [0, 1], color: 'rgba(255,0,0,0.1)' },
                    { range: [1, 2], color: 'rgba(255,0,0,0.2)' },
                    { range: [2, 3], color: 'rgba(255,0,0,0.3)' },
                    { range: [3, 4], color: 'rgba(255,0,0,0.4)' },
                    { range: [4, 5], color: 'rgba(255,0,0,0.5)' },
                    { range: [5, 6], color: 'rgba(255,0,0,0.6)' },
                    { range: [6, 7], color: 'rgba(255,0,0,0.7)' },
                    { range: [7, 8], color: 'rgba(255,0,0,0.8)' },
                    { range: [8, 9], color: 'rgba(255,0,0,0.9)' },
                    { range: [9, 10], color: 'rgba(255,0,0,1.0)' }
                ]
            }
            }
        ];
        
        var layout = { width: 500, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data,layout);
    });
}


function optionChanged(id) {

    buildBarchart(id);
    buildBublechart(id);
    buildInfotable(id);
    buildGauge(id);

  }