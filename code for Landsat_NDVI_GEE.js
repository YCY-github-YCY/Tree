//Function to cloud mask from the pixel_qa band
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = 1 << 3;
  var cloudsBitMask = 1 << 5;
  // Get the pixel QA band.
  var qa = image.select('pixel_qa');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return image.updateMask(mask).divide(10000);
}


// Function to cloud mask from the pixel_qa band of Landsat 457 SR data.
var cloudMaskL457 = function(image) {
  var qa = image.select('pixel_qa');
  // If the cloud bit (5) is set and the cloud confidence (7) is high
  // or the cloud shadow bit is set (3), then it's a bad pixel.
  var cloud = qa.bitwiseAnd(1 << 5)
          .and(qa.bitwiseAnd(1 << 7))
          .or(qa.bitwiseAnd(1 << 3));
  // Remove edge pixels that don't occur in all bands
  var mask2 = image.mask().reduce(ee.Reducer.min());
  return image.updateMask(cloud.not()).updateMask(mask2).divide(10000);
};


var selVar_lc8 = ee.List(['B2', 'B3', 'B4', 'B5', 'B6', 'B7']); 
var selVar_lc457 = ee.List(['B1', 'B2', 'B3', 'B4', 'B5', 'B7']); 
var band_name = ee.List(['Blue', 'Green', 'Red', 'NIR', 'SWIR1', 'SWIR2']);

//function of renaming bands
var rename_bands = function(image){
  return image.rename(band_name);
};

// function of adding NDVI for Landsat 
var addNDVI = function(image) {
  var ndvi = image.normalizedDifference(['NIR', 'Red']).rename('NDVI');
  return image.addBands(ndvi);
};


var surfaceReflectanceL4 = ee.ImageCollection('LANDSAT/LT04/C01/T1_SR');
// // Landsat Surface Refectance product
// // 1984- 2012
var surfaceReflectanceL5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR');
// // 1999 - present
var surfaceReflectanceL7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR');
// //2013 - present
var surfaceReflectanceL8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR");

var surfaceReflectanceL57 = surfaceReflectanceL5.merge(surfaceReflectanceL7)
var surfaceReflectanceL45 = surfaceReflectanceL4.merge(surfaceReflectanceL5)







var yyc_pnt_fc = ee.FeatureCollection('   ')


var id_list = yyc_pnt_fc.reduceColumns(ee.Reducer.toList(), ['id']).get('list').getInfo()
var y_list = yyc_pnt_fc.reduceColumns(ee.Reducer.toList(), ['Y']).get('list').getInfo()
for (var i = 0; i < id_list.length; i++) {
  var id = id_list[i]
  var y = y_list[i]
  var pnt_feature = yyc_pnt_fc.filterMetadata('id', 'equals', id)
  

  var sample_list = []
  for (var year = 1984; year <= 2020; year++) {
    
    
    var collection_lcsr = null
    
    if (year >= 2013) {
      if (y < -23.5) {
        var collection_lc08sr = surfaceReflectanceL8.filterDate(year+'-10-01', (year+1)+'-04-30');
      } else if (y > 23.5) {
        var collection_lc08sr = surfaceReflectanceL8.filterDate(year+'-04-01', year+'-10-31');
      } else {
        var collection_lc08sr = surfaceReflectanceL8.filterDate(year+'-01-01', year+'-12-31');
      }
      

      
      collection_lc08sr = collection_lc08sr
                  .map(maskL8sr)
                  .select(selVar_lc8)
                  .map(rename_bands)
                  .map(addNDVI)
                  //.mean()//.select('NDVI')
      
      collection_lcsr = collection_lc08sr

    } else if (year >= 2012) {
      
      if (y < -23.5) {
        var collection_lc57sr = surfaceReflectanceL7.filterDate(year+'-10-01', (year+1)+'-04-30');
      } else if (y > 23.5) {
        var collection_lc57sr = surfaceReflectanceL7.filterDate(year+'-04-01', year+'-10-31');
      } else {
        var collection_lc57sr = surfaceReflectanceL7.filterDate(year+'-01-01', year+'-12-31');
      }
      
      collection_lc57sr = collection_lc57sr
                  .map(cloudMaskL457)
                  .map(function(image){
  var filled1a = image.focal_mean()
  return filled1a.blend(image);
})
                  .select(selVar_lc457)
                  .map(rename_bands)
                  .map(addNDVI)
                  //.mean()//.select('NDVI')
      
      collection_lcsr = collection_lc57sr
    } else if (year >= 2003) {
      
      if (y < -23.5) {
        var collection_lc5sr = surfaceReflectanceL5.filterDate(year+'-10-01', (year+1)+'-04-30');
      } else if (y > 23.5) {
        var collection_lc5sr = surfaceReflectanceL5.filterDate(year+'-04-01', year+'-10-31');
      } else {
        var collection_lc5sr = surfaceReflectanceL5.filterDate(year+'-01-01', year+'-12-31');
      }
      
      collection_lc5sr = collection_lc5sr
                  .map(cloudMaskL457)
                  .select(selVar_lc457)
                  .map(rename_bands)
                  .map(addNDVI)
                  //.mean()//.select('NDVI')
      
      collection_lcsr = collection_lc5sr
      
    } else if (year >= 1999) {
      
      if (y < -23.5) {
        var collection_lc57sr = surfaceReflectanceL57.filterDate(year+'-10-01', (year+1)+'-04-30');
      } else if (y > 23.5) {
        var collection_lc57sr = surfaceReflectanceL57.filterDate(year+'-04-01', year+'-10-31');
      } else {
        var collection_lc57sr = surfaceReflectanceL57.filterDate(year+'-01-01', year+'-12-31');
      }
      
      collection_lc57sr = collection_lc57sr
                  .map(cloudMaskL457)
                  .select(selVar_lc457)
                  .map(rename_bands)
                  .map(addNDVI)
                  //.mean()//.select('NDVI')
      
      collection_lcsr = collection_lc57sr
      
    }
    else {
      
      if (y < -23.5) {
        var collection_lc45sr = surfaceReflectanceL5.filterDate(year+'-10-01', (year+1)+'-04-30');
      } else if (y > 23.5) {
        var collection_lc45sr = surfaceReflectanceL5.filterDate(year+'-04-01', year+'-10-31');
      } else {
        var collection_lc45sr = surfaceReflectanceL5.filterDate(year+'-01-01', year+'-12-31');
      }
      
      collection_lc45sr = collection_lc45sr
                  .map(cloudMaskL457)
                  .select(selVar_lc457)
                  .map(rename_bands)
                  .map(addNDVI)
                  //.mean()//.select('NDVI')
      
      collection_lcsr = collection_lc45sr
      
    }
    
    
    var inner_call = function (collection_lcsr, pnt_feature) {
      
      var imageNeighborhood = collection_lcsr.mean().select('NDVI').neighborhoodToArray({
        kernel: ee.Kernel.rectangle(1, 1, 'pixels')
      });
      
      pnt_feature = pnt_feature.map(function (p) {
        return p.set('year', year);
      });
      
      var samples = imageNeighborhood.sampleRegions({
        collection: pnt_feature,
        scale: 30
      })
      
      return samples
      
    }
    
    var samples = ee.Algorithms.If({
                condition: collection_lcsr.size().gt(0),
                trueCase: inner_call(collection_lcsr, pnt_feature),
                falseCase: ee.FeatureCollection([])
    })
    
    
      
    sample_list.push(samples)


  }
  
  // print(sample_list)
  
  Export.table.toDrive({
    collection: ee.FeatureCollection(sample_list).flatten(),
    description: id + '',
    folder: '      ',
    fileFormat: 'CSV',
  })
  
  print(sample_list)
  
  // break
  
  
}