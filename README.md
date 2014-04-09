## USA map with zoomable states, data points, and tooltips

This is a zoomable D3.js map based on [http://bl.ocks.org/mbostock/4699541](http://bl.ocks.org/mbostock/4699541). The tooltip capability is from [http://bl.ocks.org/wrobstory/7612013](http://bl.ocks.org/wrobstory/7612013). The d3.tip plugin which is included in the files for this project was determined to be incompatible with the zoom feature of this map and isn't used.

Data file paths in the d3-map.js file (master branch) are for the production site and need to be altered in order to view the map locally or on github pages. A demo of this map is viewable at [http://nupykl.github.io/map-test/](http://nupykl.github.io/map-test/).

To create new data, run: $ python adjusters.py from inside the map-data directory. Check file for things like this: 'Calgary,AL,1,53.4303737,-113.4935933' and 'San Ant5Onio,TX,1,29.4241219,-98.4936282' and remove any whitespace from bottom of file.