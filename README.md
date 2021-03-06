## USA map with zoomable states, data points, and tooltips

This is a zoomable D3.js map based on [http://bl.ocks.org/mbostock/4699541](http://bl.ocks.org/mbostock/4699541). The tooltip capability is from [http://bl.ocks.org/wrobstory/7612013](http://bl.ocks.org/wrobstory/7612013). The d3.tip plugin which is included in the files for this project was determined to be incompatible with the zoom feature of this map and isn't used.

Data file paths in the d3-map.js file (master branch) are for the production site and need to be altered in order to view the map locally or on github pages. A demo of this map is viewable at [http://nupykl.github.io/mariposa-map/](http://nupykl.github.io/mariposa-map/).

To create new data, run: $ python adjusters.py from inside the map-data directory. Check command line for a list of problem entries and correct cities.csv accordingly.

The cities.csv file on mariposaltd.com (ee_sys/d3-map/map-data/cities.csv) can be replaced with the new csv file via ftp.