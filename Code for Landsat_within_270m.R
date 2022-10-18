rm(list = ls())

install.packages("raster")
install.packages("rgdal")
install.packages("ggplot2")
install.packages("dplyr")
library(raster)
library(rgdal)
library(ggplot2)
library(dplyr)

setwd("  ")
raster_files <- list.files(pattern = "tif")

for (i in raster_files) {
  raster_file <- raster(i)
  sum_raster_file <- summary(raster_file)
  df_raster_file <- as.data.frame(raster_file, xy = TRUE)
  mean_3by3 <- (df_raster_file[31,3] + df_raster_file[32,3] + df_raster_file[33,3] +
                df_raster_file[40,3] + df_raster_file[41,3] + df_raster_file[42,3] +
                df_raster_file[49,3] + df_raster_file[50,3] + df_raster_file[51,3])/9
  n_row <- nrow(df_raster_file)
  k = 0
  for (j in 1: n_row) {
    if (df_raster_file [j,3] <= mean_3by3){
      k = k + 1
    }
  }
  print(i)
  print(k)
  result_smaller_than_mean <- data.frame(rasterLayer = i, number_of_cells = k)
  write.table(result_smaller_than_mean, file = "  .csv", sep = ",", 
              col.names = FALSE, row.names = FALSE, append = TRUE)
}


