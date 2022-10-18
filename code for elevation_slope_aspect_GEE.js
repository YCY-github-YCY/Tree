var point_fc = ee.FeatureCollection(' ')
var dataset = ee.Image('USGS/SRTMGL1_003');
var elevation = dataset.select('elevation');
var slope = ee.Terrain.slope(elevation).rename('slope');
var aspect = ee.Terrain.aspect(elevation).rename('aspect');

var com = elevation.addBands(slope, ['slope'])
                  .addBands(aspect, ['aspect'])


// print(com)

// Map.addLayer(point_fc)


var point_fc_with_pro = com.reduceRegions({
  'collection': point_fc,
  'reducer': ee.Reducer.first(),
  'scale': 30
})

print(point_fc_with_pro)


Export.table.toDrive({
'collection': point_fc_with_pro,
'description': 'dem',
'folder': ' ',
'fileNamePrefix': 'dem',
'fileFormat': 'SHP'
})