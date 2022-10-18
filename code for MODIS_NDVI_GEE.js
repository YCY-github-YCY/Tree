
// // 2000- 2020
var surfaceReflectanceL8 = ee.ImageCollection('MODIS/006/MOD13Q1');





var yyc_pnt_fc = ee.FeatureCollection('    ')


var id_list = yyc_pnt_fc.reduceColumns(ee.Reducer.toList(), ['id']).get('list').getInfo()
var y_list = yyc_pnt_fc.reduceColumns(ee.Reducer.toList(), ['Y']).get('list').getInfo()
print(y_list.length)
for (var i = 0; i < y_list.length; i++) {
  
  var id = id_list[i]
  var y = y_list[i]

  print(id)
  var pnt_feature = yyc_pnt_fc.filterMetadata('id', 'equals', id)
  

  var sample_list = []
  for (var year = 2000; year <= 2020; year++) {
    
    
    var collection_lcsr = null
    var month_list = null
    
    if (y < -23.5) {
      month_list = [10, 11, 12, 1, 2, 3, 4]
      var collection_lc08sr = surfaceReflectanceL8.filterDate(year+'-10-01', (year+1)+'-04-30');
    } else if (y > 23.5) {
      month_list = [4, 5, 6, 7, 8, 9, 10]
      var collection_lc08sr = surfaceReflectanceL8.filterDate(year+'-04-01', year+'-10-31');
    } else {
      month_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      var collection_lc08sr = surfaceReflectanceL8.filterDate(year+'-01-01', year+'-12-31');
    }
    
    collection_lcsr = collection_lc08sr
    
    var image_list = ee.List([])
    for (var j = 0; j < month_list.length; j++) {
      var month = month_list[j]
      var month_max_list = collection_lcsr.filter(ee.Filter.calendarRange(month,month,'month'))
      var month_max = ee.Algorithms.If({
                  condition: month_max_list.size().gt(0),
                  trueCase: ee.List([month_max_list.max()]),
                  falseCase: ee.List([])
      })
      

      image_list = image_list.add(month_max)
    }
    

    var img_c = ee.ImageCollection(image_list.flatten())
    

    
    var month_max = collection_lcsr.filter(ee.Filter.calendarRange(1,1,'month'))


    var inner_call = function (collection_lcsr, pnt_feature) {
      
      var imageNeighborhood = collection_lcsr.mean().select('NDVI').divide(10000);
      
      pnt_feature = pnt_feature.map(function (p) {
        return p.set('year', year);
      });
      
      var samples = imageNeighborhood.sampleRegions({
        collection: pnt_feature,
        scale: 250
      })
      
      return samples
      
    }
    
    var samples = ee.Algorithms.If({
                condition: img_c.size().gt(0),
                trueCase: inner_call(img_c, pnt_feature),
                falseCase: ee.FeatureCollection([])
    })
    
      
    sample_list.push(samples)
    

  }
  
  print(sample_list)
  
  Export.table.toDrive({
    collection: ee.FeatureCollection(sample_list).flatten(),
    description: id + '',
    folder: '    ',
    fileFormat: 'CSV',
  })
  
}